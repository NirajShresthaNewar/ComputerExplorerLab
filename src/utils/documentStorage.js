// IndexedDB + fallback storage utility for folders and documents

const DB_NAME = 'ComputerExplorerLab_DocHub_v4'
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
    buffer: createSampleTextBuffer(
      'Computer Explorer Lab Guide',
      'Overview of Computer Types:\n1. Analog Computers: Measure continuous physical quantities (thermometers, speedometers).\n2. Digital Computers: Process discrete binary data (laptops, PCs).\n3. Hybrid Computers: Combine analog speed with digital accuracy.\n4. Microcomputers, Minicomputers, Mainframe & Supercomputers.'
    ),
    createdAt: Date.now() - 40000,
  },
]

// Flag to track initial sample seeding
let hasSeeded = false

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
        hasSeeded = true
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
        resolve(res)
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
          if (doc.folderId === folderId) docStore.delete(doc.id)
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

  const processed = rawDocs.map((doc) => {
    let blob = doc.blob
    if (!blob && doc.buffer) {
      blob = new Blob([doc.buffer], { type: doc.type })
    }
    return {
      ...doc,
      blob: blob || new Blob([''], { type: doc.type }),
    }
  })

  if (folderId && folderId !== 'all') {
    return processed.filter((d) => d.folderId === folderId)
  }
  return processed
}

export async function uploadDocument(file, folderId = 'class-3-math') {
  const buffer = await file.arrayBuffer()
  const mimeType = file.type || getFallbackFileType(file.name)

  const doc = {
    id: 'doc-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    folderId,
    name: file.name,
    type: mimeType,
    size: file.size,
    buffer, // Stored safely as ArrayBuffer
    createdAt: Date.now(),
  }

  try {
    const db = await openDB()
    await new Promise((resolve, reject) => {
      const tx = db.transaction('documents', 'readwrite')
      const store = tx.objectStore('documents')
      const req = store.add(doc)
      req.onsuccess = () => resolve(true)
      req.onerror = () => reject(req.error)
    })
  } catch (e) {
    console.warn('IndexedDB write failed, using memory fallback', e)
  }

  // Also sync memory store
  memoryStore.documents.push(doc)

  return {
    ...doc,
    blob: new Blob([buffer], { type: mimeType }),
  }
}

export async function deleteDocument(docId) {
  try {
    const db = await openDB()
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
