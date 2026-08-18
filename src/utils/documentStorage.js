// IndexedDB + Vercel Blob cloud storage utility for folders and documents
import {
  isVercelBlobConfigured,
  uploadToVercelBlob,
  deleteFromVercelBlob,
} from './vercelBlob'

const DB_NAME = 'ComputerExplorerLab_DocHub_v5'
const DB_VERSION = 1

const DEFAULT_FOLDERS = [
  { id: 'class-3-math', name: 'Class 3 Mathematics', color: 'blue', createdAt: Date.now() - 100000 },
  { id: 'class-4-comp', name: 'Class 4 Computer Studies', color: 'cyan', createdAt: Date.now() - 50000 },
  { id: 'lab-manuals', name: 'Lab Manuals & Guides', color: 'purple', createdAt: Date.now() - 20000 },
]

function createSampleTextBuffer(title, content) {
  const text = `${title}\n${'=' .repeat(title.length)}\n\n${content}`
  return new TextEncoder().encode(text).buffer
}

const SAMPLE_DOCS = [
  {
    id: 'sample-1',
    folderId: 'class-3-math',
    name: 'Class 3 Math Study Notes & Exercises.txt',
    type: 'text/plain',
    size: 1024,
    storedIn: 'local',
    buffer: createSampleTextBuffer(
      'Class 3 Mathematics Study Guide',
      'Welcome to Class 3 Mathematics Resources!\n\n1. Vertical Addition & Subtraction\n   - Always align digits starting from the right (ones place).\n   - Remember to carry over when sum >= 10.\n\n2. Vertical Multiplication\n   - Multiply ones digit first, then tens digit.\n   - Practice multiplication tables from 1 to 10.'
    ),
    createdAt: Date.now() - 80000,
  },
  {
    id: 'sample-2',
    folderId: 'lab-manuals',
    name: 'Computer Explorer Lab Guide.txt',
    type: 'text/plain',
    size: 2048,
    storedIn: 'local',
    buffer: createSampleTextBuffer(
      'Computer Explorer Lab Guide',
      'Overview of Computer Types:\n1. Analog Computers: Measure continuous physical quantities (thermometers, speedometers).\n2. Digital Computers: Process discrete binary data (laptops, PCs).\n3. Hybrid Computers: Combine analog speed with digital accuracy.\n4. Microcomputers, Minicomputers, Mainframe & Supercomputers.'
    ),
    createdAt: Date.now() - 40000,
  },
]

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = (e) => {
      const db = e.target.result
      if (!db.objectStoreNames.contains('folders')) {
        const folderStore = db.createObjectStore('folders', { keyPath: 'id' })
        DEFAULT_FOLDERS.forEach((f) => folderStore.add(f))
      }
      if (!db.objectStoreNames.contains('documents')) {
        const docStore = db.createObjectStore('documents', { keyPath: 'id' })
        SAMPLE_DOCS.forEach((d) => docStore.add(d))
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

// In-memory fallback store
const memoryStore = {
  folders: [...DEFAULT_FOLDERS],
  documents: [...SAMPLE_DOCS],
}

export async function getFolders() {
  try {
    const db = await openDB()
    return new Promise((resolve) => {
      const tx = db.transaction('folders', 'readonly')
      const store = tx.objectStore('folders')
      const request = store.getAll()
      request.onsuccess = () => {
        const res = request.result || []
        resolve(res.length ? res : memoryStore.folders)
      }
      request.onerror = () => resolve(memoryStore.folders)
    })
  } catch (err) {
    return memoryStore.folders
  }
}

export async function createFolder(name, color = 'blue') {
  const folder = {
    id: 'folder-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    name,
    color,
    createdAt: Date.now(),
  }
  try {
    const db = await openDB()
    const tx = db.transaction('folders', 'readwrite')
    tx.objectStore('folders').add(folder)
  } catch (e) {
    console.warn('IndexedDB folder create error', e)
  }
  memoryStore.folders.push(folder)
  return folder
}

export async function deleteFolder(folderId) {
  try {
    const db = await openDB()
    await new Promise((resolve, reject) => {
      const tx = db.transaction(['folders', 'documents'], 'readwrite')
      const folderStore = tx.objectStore('folders')
      const docStore = tx.objectStore('documents')

      folderStore.delete(folderId)

      const docReq = docStore.getAll()
      docReq.onsuccess = () => {
        const docs = docReq.result || []
        docs.forEach((doc) => {
          if (doc.folderId === folderId) {
            if (doc.storedIn === 'vercel-blob' && doc.url) {
              deleteFromVercelBlob(doc.url)
            }
            docStore.delete(doc.id)
          }
        })
      }

      tx.oncomplete = () => resolve(true)
      tx.onerror = () => reject(tx.error)
    })
  } catch (e) {
    console.warn('IndexedDB folder delete error', e)
  }
  memoryStore.folders = memoryStore.folders.filter((f) => f.id !== folderId)
  memoryStore.documents = memoryStore.documents.filter((d) => d.folderId !== folderId)
  return true
}

export async function getDocuments(folderId = null) {
  let rawDocs = []
  try {
    const db = await openDB()
    rawDocs = await new Promise((resolve) => {
      const tx = db.transaction('documents', 'readonly')
      const request = tx.objectStore('documents').getAll()
      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => resolve(memoryStore.documents)
    })
  } catch (e) {
    rawDocs = memoryStore.documents
  }

  if (!rawDocs || rawDocs.length === 0) {
    rawDocs = memoryStore.documents
  }

  const processed = rawDocs.map((doc) => {
    let blob = doc.blob
    if (!blob && doc.buffer) {
      blob = new Blob([doc.buffer], { type: doc.type })
    }
    return {
      ...doc,
      blob: blob || new Blob([''], { type: doc.type }),
      storedIn: doc.storedIn || (doc.url ? 'vercel-blob' : 'local'),
    }
  })

  if (folderId && folderId !== 'all') {
    return processed.filter((d) => d.folderId === folderId)
  }
  return processed
}

export async function uploadDocument(file, folderId = 'class-3-math') {
  const mimeType = file.type || getFallbackFileType(file.name)
  let cloudInfo = null

  // Trigger Vercel Blob cloud upload instantly without waiting for arrayBuffer conversion
  if (isVercelBlobConfigured()) {
    try {
      cloudInfo = await uploadToVercelBlob(file)
    } catch (err) {
      console.warn('Vercel Blob upload failed, falling back to local storage:', err)
    }
  }

  // Generate buffer for local storage / offline caching
  let buffer = null
  try {
    buffer = await file.arrayBuffer()
  } catch (e) {
    console.warn('Could not read array buffer for local cache', e)
  }

  const doc = {
    id: 'doc-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    folderId,
    name: file.name,
    type: mimeType,
    size: file.size,
    buffer,
    storedIn: cloudInfo ? 'vercel-blob' : 'local',
    url: cloudInfo ? cloudInfo.url : null,
    downloadUrl: cloudInfo ? cloudInfo.downloadUrl : null,
    pathname: cloudInfo ? cloudInfo.pathname : null,
    createdAt: Date.now(),
  }

  try {
    const db = await openDB()
    await new Promise((resolve, reject) => {
      const tx = db.transaction('documents', 'readwrite')
      const store = tx.objectStore('documents')
      const req = store.put(doc)
      req.onsuccess = () => resolve(true)
      req.onerror = () => reject(req.error)
    })
  } catch (e) {
    console.warn('IndexedDB write failed, using memory fallback', e)
  }

  // Update memory store
  const existingIdx = memoryStore.documents.findIndex((d) => d.id === doc.id)
  if (existingIdx >= 0) {
    memoryStore.documents[existingIdx] = doc
  } else {
    memoryStore.documents.push(doc)
  }

  return {
    ...doc,
    blob: buffer ? new Blob([buffer], { type: mimeType }) : new Blob([''], { type: mimeType }),
  }
}

export async function migrateDocToVercelBlob(doc) {
  if (!isVercelBlobConfigured()) {
    throw new Error('Please configure your Vercel Blob Read-Write Token first.')
  }

  let fileToUpload
  if (doc.blob && doc.blob instanceof Blob) {
    fileToUpload = new File([doc.blob], doc.name, { type: doc.type })
  } else if (doc.buffer) {
    fileToUpload = new File([doc.buffer], doc.name, { type: doc.type })
  } else {
    throw new Error('Document buffer/blob unavailable for cloud migration.')
  }

  const cloudInfo = await uploadToVercelBlob(fileToUpload)

  const updatedDoc = {
    ...doc,
    storedIn: 'vercel-blob',
    url: cloudInfo.url,
    downloadUrl: cloudInfo.downloadUrl,
    pathname: cloudInfo.pathname,
  }

  try {
    const db = await openDB()
    await new Promise((resolve, reject) => {
      const tx = db.transaction('documents', 'readwrite')
      const store = tx.objectStore('documents')
      const req = store.put(updatedDoc)
      req.onsuccess = () => resolve(true)
      req.onerror = () => reject(req.error)
    })
  } catch (e) {
    console.warn('IndexedDB update failed during cloud migration', e)
  }

  const idx = memoryStore.documents.findIndex((d) => d.id === doc.id)
  if (idx >= 0) {
    memoryStore.documents[idx] = updatedDoc
  }

  return updatedDoc
}

export async function deleteDocument(docId) {
  let docToDelete = memoryStore.documents.find((d) => d.id === docId)
  
  try {
    const db = await openDB()
    const dbDoc = await new Promise((resolve) => {
      const tx = db.transaction('documents', 'readonly')
      const req = tx.objectStore('documents').get(docId)
      req.onsuccess = () => resolve(req.result)
      req.onerror = () => resolve(null)
    })
    if (dbDoc) docToDelete = dbDoc

    if (docToDelete && docToDelete.storedIn === 'vercel-blob' && docToDelete.url) {
      await deleteFromVercelBlob(docToDelete.url)
    }

    await new Promise((resolve, reject) => {
      const tx = db.transaction('documents', 'readwrite')
      const store = tx.objectStore('documents')
      const req = store.delete(docId)
      req.onsuccess = () => resolve(true)
      req.onerror = () => reject(req.error)
    })
  } catch (e) {
    console.warn('IndexedDB delete error', e)
  }

  memoryStore.documents = memoryStore.documents.filter((d) => d.id !== docId)
  return true
}

function getFallbackFileType(filename) {
  const ext = filename.split('.').pop().toLowerCase()
  if (ext === 'pdf') return 'application/pdf'
  if (ext === 'doc' || ext === 'docx') return 'application/msword'
  if (ext === 'txt') return 'text/plain'
  return 'application/octet-stream'
}
