import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import mammoth from 'mammoth'
import {
  FolderOpen,
  Upload,
  FileText,
  FileCode,
  File,
  Eye,
  Download,
  Trash2,
  Search,
  X,
  Maximize2,
  FolderPlus,
  Check,
  AlertTriangle,
  Cloud,
  CloudOff,
  Key,
  Copy,
  ExternalLink,
  HardDrive,
  RefreshCw,
  Share2,
} from 'lucide-react'
import {
  getFolders,
  createFolder,
  deleteFolder,
  getDocuments,
  uploadDocument,
  deleteDocument,
  migrateDocToVercelBlob,
} from '../utils/documentStorage'
import {
  isVercelBlobConfigured,
  getVercelBlobToken,
  saveVercelBlobToken,
  removeVercelBlobToken,
} from '../utils/vercelBlob'

const colorMap = {
  blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  cyan: 'bg-lab-cyan/20 text-lab-cyan border-lab-cyan/30',
  purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
}

export default function DocumentHub() {
  const [searchParams] = useSearchParams()
  const selectedFolder = searchParams.get('folder') || 'all'

  const [folders, setFolders] = useState([])
  const [documents, setDocuments] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState('')

  // Vercel Blob Token & Cloud State
  const [hasCloudToken, setHasCloudToken] = useState(false)
  const [showTokenModal, setShowTokenModal] = useState(false)
  const [inputToken, setInputToken] = useState('')
  const [tokenSavedMsg, setTokenSavedMsg] = useState('')
  const [copiedDocId, setCopiedDocId] = useState(null)
  const [migratingDocId, setMigratingDocId] = useState(null)

  // Folder creation modal state
  const [showNewFolderModal, setShowNewFolderModal] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [newFolderColor, setNewFolderColor] = useState('blue')

  // Document viewer modal state
  const [viewingDoc, setViewingDoc] = useState(null)
  const [viewingUrl, setViewingUrl] = useState(null)
  const [textContent, setTextContent] = useState('')
  const [docHtml, setDocHtml] = useState('')
  const [docLoading, setDocLoading] = useState(false)

  // Delete confirmation modals
  const [docToDelete, setDocToDelete] = useState(null)
  const [folderToDelete, setFolderToDelete] = useState(null)

  const fileInputRef = useRef(null)

  useEffect(() => {
    setHasCloudToken(isVercelBlobConfigured())
    loadFolders()
  }, [])

  useEffect(() => {
    loadDocs(selectedFolder)
  }, [selectedFolder])

  const loadFolders = async () => {
    try {
      const data = await getFolders()
      setFolders(data)
    } catch (err) {
      console.error('Failed to load folders', err)
    }
  }

  const loadDocs = async (folderId) => {
    try {
      const data = await getDocuments(folderId)
      setDocuments(data)
    } catch (err) {
      console.error('Failed to load documents', err)
    }
  }

  const handleSaveToken = (e) => {
    e.preventDefault()
    if (!inputToken.trim()) return
    saveVercelBlobToken(inputToken.trim())
    setHasCloudToken(true)
    setTokenSavedMsg('Vercel Blob token saved successfully! New uploads will go to the cloud.')
    setTimeout(() => {
      setShowTokenModal(false)
      setTokenSavedMsg('')
      setInputToken('')
    }, 1500)
  }

  const handleRemoveToken = () => {
    removeVercelBlobToken()
    setHasCloudToken(false)
    setShowTokenModal(false)
  }

  const handleCreateFolder = async (e) => {
    e.preventDefault()
    if (!newFolderName.trim()) return
    try {
      const created = await createFolder(newFolderName.trim(), newFolderColor)
      setFolders((prev) => [...prev, created])
      setNewFolderName('')
      setShowNewFolderModal(false)
      window.location.href = `/documents?folder=${created.id}`
    } catch (err) {
      console.error('Failed to create folder', err)
    }
  }

  const handleConfirmDeleteFolder = async () => {
    if (!folderToDelete) return
    try {
      await deleteFolder(folderToDelete.id)
      setFolders((prev) => prev.filter((f) => f.id !== folderToDelete.id))
      if (selectedFolder === folderToDelete.id) {
        window.location.href = '/documents?folder=all'
      }
      setFolderToDelete(null)
    } catch (err) {
      console.error('Failed to delete folder', err)
    }
  }

  const handleFileUpload = async (fileList) => {
    if (!fileList || fileList.length === 0) return
    setIsUploading(true)

    const isCloud = isVercelBlobConfigured()
    setUploadMessage(isCloud ? 'Uploading to Vercel Blob Cloud...' : 'Processing document locally...')

    const targetFolder =
      selectedFolder === 'all'
        ? (folders[0]?.id || 'class-3-math')
        : selectedFolder

    let uploadedCount = 0
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i]
      try {
        setUploadMessage(isCloud ? `Uploading ${file.name} to Vercel Blob...` : `Uploading ${file.name}...`)
        await uploadDocument(file, targetFolder)
        uploadedCount++
      } catch (err) {
        console.error('Failed to upload file', file.name, err)
        alert(`Error uploading ${file.name}: ${err.message || err}`)
      }
    }

    setIsUploading(false)
    setUploadMessage('')
    if (uploadedCount > 0) {
      await loadDocs(selectedFolder)
    }
  }

  const handleMigrateDoc = async (doc) => {
    if (!hasCloudToken) {
      setShowTokenModal(true)
      return
    }
    try {
      setMigratingDocId(doc.id)
      await migrateDocToVercelBlob(doc)
      await loadDocs(selectedFolder)
    } catch (err) {
      console.error('Failed to sync doc to Vercel Blob', err)
      alert(`Sync failed: ${err.message || err}`)
    } finally {
      setMigratingDocId(null)
    }
  }

  const handleCopyPublicLink = (doc) => {
    if (!doc.url) return
    navigator.clipboard.writeText(doc.url)
    setCopiedDocId(doc.id)
    setTimeout(() => setCopiedDocId(null), 2000)
  }

  const handleConfirmDeleteDoc = async () => {
    if (!docToDelete) return
    try {
      await deleteDocument(docToDelete.id)
      setDocuments((prev) => prev.filter((d) => d.id !== docToDelete.id))
      setDocToDelete(null)
    } catch (err) {
      console.error('Failed to delete document', err)
    }
  }

  const handleViewDoc = async (doc) => {
    setViewingDoc(doc)
    setDocHtml('')
    setTextContent('')
    setDocLoading(true)

    // Use direct public Vercel Blob URL if available, otherwise local object URL
    const targetUrl = doc.url || (doc.blob ? URL.createObjectURL(doc.blob) : '')
    setViewingUrl(targetUrl)

    const isText = doc.type === 'text/plain' || doc.name.endsWith('.txt')
    const isWord =
      doc.name.endsWith('.docx') ||
      doc.name.endsWith('.doc') ||
      doc.type.includes('word') ||
      doc.type.includes('officedocument')

    if (isText) {
      if (doc.blob) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setTextContent(e.target.result)
          setDocLoading(false)
        }
        reader.readAsText(doc.blob)
      } else if (doc.url) {
        try {
          const res = await fetch(doc.url)
          const txt = await res.text()
          setTextContent(txt)
        } catch (err) {
          setTextContent('Failed to fetch file content from Vercel Blob.')
        }
        setDocLoading(false)
      }
    } else if (isWord) {
      try {
        let arrayBuffer
        if (doc.blob) {
          arrayBuffer = await doc.blob.arrayBuffer()
        } else if (doc.url) {
          const res = await fetch(doc.url)
          arrayBuffer = await res.arrayBuffer()
        }
        if (arrayBuffer) {
          const result = await mammoth.convertToHtml({ arrayBuffer })
          setDocHtml(result.value)
        }
      } catch (err) {
        console.error('mammoth conversion error', err)
        setDocHtml(
          '<p style="color:#f87171;">Could not render this Word document. Try downloading it instead.</p>'
        )
      }
      setDocLoading(false)
    } else {
      setDocLoading(false)
    }
  }

  const handleCloseViewer = () => {
    if (viewingUrl && viewingUrl.startsWith('blob:')) {
      URL.revokeObjectURL(viewingUrl)
    }
    setViewingDoc(null)
    setViewingUrl(null)
    setTextContent('')
    setDocHtml('')
  }

  const filteredDocs = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatSize = (bytes) => {
    if (!bytes) return '0 KB'
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const getFileIcon = (filename, type) => {
    if (filename.endsWith('.pdf') || type.includes('pdf')) {
      return <FileText className="text-red-400" size={24} />
    }
    if (filename.endsWith('.doc') || filename.endsWith('.docx') || type.includes('word')) {
      return <FileText className="text-blue-400" size={24} />
    }
    if (filename.endsWith('.txt')) {
      return <FileCode className="text-emerald-400" size={24} />
    }
    return <File className="text-gray-400" size={24} />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white drop-shadow-md flex items-center gap-3">
            <FolderOpen className="text-lab-cyan" size={32} />
            Resource Library & Documents
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Upload and access your notes and manuals anywhere with <span className="text-lab-cyan font-semibold">Vercel Blob Cloud Storage</span>.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Vercel Blob Status Badge */}
          <button
            onClick={() => {
              setInputToken(getVercelBlobToken() || '')
              setShowTokenModal(true)
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all ${
              hasCloudToken
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20 animate-pulse'
            }`}
            title="Configure Vercel Blob Storage Token"
          >
            {hasCloudToken ? <Cloud size={16} /> : <CloudOff size={16} />}
            <span>{hasCloudToken ? 'Vercel Blob Connected' : 'Connect Vercel Blob'}</span>
          </button>

          <button
            onClick={() => setShowNewFolderModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass hover:bg-white/10 text-gray-200 text-sm font-semibold transition-all border border-white/10"
          >
            <FolderPlus size={18} className="text-lab-cyan" />
            <span>New Folder</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-lab-cyan via-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-lab-cyan/20 transition-all scale-105"
          >
            <Upload size={18} />
            <span>Upload Document</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt"
            onChange={async (e) => {
              const files = e.target.files
              if (files && files.length > 0) {
                await handleFileUpload(files)
              }
              e.target.value = ''
            }}
            className="hidden"
          />
        </div>
      </div>

      {/* Storage Mode Notice Banner */}
      {!hasCloudToken && (
        <div className="glass mb-6 rounded-2xl p-4 border border-amber-500/30 bg-amber-500/5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-xl text-amber-400">
              <CloudOff size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Local Storage Mode Active</h4>
              <p className="text-xs text-gray-300">
                Documents uploaded now are stored in your local browser cache. Connect a <span className="text-lab-cyan font-semibold">Vercel Blob Read-Write Token</span> to access files from anywhere on any device.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowTokenModal(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-colors whitespace-nowrap"
          >
            Configure Vercel Blob Token
          </button>
        </div>
      )}

      <div className="space-y-6">
        {/* Search & Drag-Drop Upload Box */}
        <div className="glass rounded-3xl p-6 border border-white/10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search uploaded documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/60 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-lab-cyan transition-colors"
              />
            </div>
            <div className="text-xs text-gray-400 flex items-center gap-2">
              <span>Showing <span className="text-white font-bold">{filteredDocs.length}</span> files</span>
              {hasCloudToken && (
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                  Cloud Active
                </span>
              )}
            </div>
          </div>

          {/* Drop Zone Box */}
          <div
            onDragOver={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            onDragEnter={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            onDrop={async (e) => {
              e.preventDefault()
              e.stopPropagation()
              if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                await handleFileUpload(e.dataTransfer.files)
              }
            }}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-white/20 hover:border-lab-cyan/60 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-white/5 hover:bg-lab-cyan/5 group"
          >
            <div className="p-3 bg-lab-cyan/10 text-lab-cyan rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Upload size={24} />
            </div>
            <p className="text-sm font-semibold text-gray-200">
              Drag and drop PDF or DOC files here, or <span className="text-lab-cyan underline">click to select files</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Supports PDF (.pdf), Word (.doc, .docx), and Text (.txt) files.{' '}
              {hasCloudToken ? 'Directly uploaded to Vercel Blob cloud.' : 'Stored locally until cloud token is added.'}
            </p>
            {isUploading && (
              <div className="mt-3 text-xs text-lab-cyan font-bold animate-pulse flex items-center justify-center gap-2">
                <RefreshCw size={14} className="animate-spin" />
                <span>{uploadMessage || 'Uploading document...'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Document Cards Grid */}
        {filteredDocs.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center border border-white/10 text-gray-400 space-y-3">
            <FileText size={48} className="mx-auto text-gray-600" />
            <h3 className="text-lg font-bold text-gray-300">No documents in this folder</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Upload your class PDF notes, assignment docs, or lab guides to access them anytime.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredDocs.map((doc) => {
              const isCloud = doc.storedIn === 'vercel-blob' || Boolean(doc.url)

              return (
                <div
                  key={doc.id}
                  onClick={() => handleViewDoc(doc)}
                  className="glass rounded-2xl p-4 border border-white/10 hover:border-lab-cyan/40 transition-all cursor-pointer flex flex-col justify-between group hover:shadow-xl hover:shadow-lab-cyan/5 relative"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="p-2.5 bg-slate-900/80 rounded-xl border border-white/5 group-hover:scale-105 transition-transform">
                          {getFileIcon(doc.name, doc.type)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-bold text-white truncate group-hover:text-lab-cyan transition-colors" title={doc.name}>
                            {doc.name}
                          </h4>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {formatSize(doc.size)} • {new Date(doc.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Storage Location Badge */}
                    <div className="mt-2 flex items-center justify-between">
                      {isCloud ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 text-[10px] font-semibold border border-emerald-500/25">
                          <Cloud size={10} />
                          <span>Vercel Blob Cloud</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-400 text-[10px] font-semibold border border-amber-500/25">
                          <HardDrive size={10} />
                          <span>Local Browser</span>
                        </span>
                      )}

                      {!isCloud && hasCloudToken && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleMigrateDoc(doc)
                          }}
                          disabled={migratingDocId === doc.id}
                          className="flex items-center gap-1 text-[10px] font-semibold text-lab-cyan hover:underline disabled:opacity-50"
                        >
                          {migratingDocId === doc.id ? (
                            <RefreshCw size={10} className="animate-spin" />
                          ) : (
                            <Cloud size={10} />
                          )}
                          <span>{migratingDocId === doc.id ? 'Syncing...' : 'Sync to Cloud'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-3 border-t border-white/5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleViewDoc(doc)
                      }}
                      className="flex items-center gap-1.5 text-xs font-semibold text-lab-cyan hover:underline"
                    >
                      <Eye size={14} />
                      <span>View</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      {isCloud && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCopyPublicLink(doc)
                          }}
                          className="p-1.5 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors relative"
                          title="Copy Public Vercel Blob Link"
                        >
                          {copiedDocId === doc.id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        </button>
                      )}

                      <a
                        href={doc.downloadUrl || doc.url || (doc.blob ? URL.createObjectURL(doc.blob) : '#')}
                        download={doc.name}
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        title="Download file"
                      >
                        <Download size={14} />
                      </a>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setDocToDelete(doc)
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete file"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Vercel Blob Token Setup Modal */}
      {showTokenModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass rounded-3xl max-w-lg w-full p-6 border border-lab-cyan/30 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-3 text-lab-cyan">
                <div className="p-2 bg-lab-cyan/10 rounded-xl border border-lab-cyan/20">
                  <Cloud size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Vercel Blob Storage Setup</h3>
                  <p className="text-xs text-gray-400">Enable cloud access for your documents</p>
                </div>
              </div>
              <button
                onClick={() => setShowTokenModal(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            {tokenSavedMsg ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-xs font-semibold flex items-center gap-2">
                <Check size={18} />
                <span>{tokenSavedMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleSaveToken} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center justify-between">
                    <span>Vercel Blob Read-Write Token</span>
                    <a
                      href="https://vercel.com/docs/storage/vercel-blob"
                      target="_blank"
                      rel="noreferrer"
                      className="text-lab-cyan hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <span>Get Token</span>
                      <ExternalLink size={12} />
                    </a>
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3.5 top-3 text-gray-400" size={16} />
                    <input
                      type="password"
                      required
                      placeholder="vercel_blob_rw_..."
                      value={inputToken}
                      onChange={(e) => setInputToken(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-lab-cyan font-mono"
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">
                    Paste your Vercel Blob Read-Write token (<code className="text-lab-cyan">vercel_blob_rw_...</code>) to automatically upload all documents directly to Vercel Blob CDN.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  {hasCloudToken ? (
                    <button
                      type="button"
                      onClick={handleRemoveToken}
                      className="text-xs text-red-400 hover:underline font-semibold"
                    >
                      Remove Token
                    </button>
                  ) : (
                    <span />
                  )}

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setShowTokenModal(false)}
                      className="px-4 py-2 rounded-xl glass text-gray-300 text-xs font-semibold hover:bg-white/10"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-lab-cyan text-slate-950 text-xs font-bold hover:bg-cyan-400 transition-colors shadow-lg shadow-lab-cyan/20"
                    >
                      Save & Connect
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Custom Delete Document Modal */}
      {docToDelete && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass rounded-3xl max-w-md w-full p-6 border border-red-500/30 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2 bg-red-500/10 rounded-xl border border-red-500/20">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">Delete Document?</h3>
            </div>
            <p className="text-sm text-gray-300">
              Are you sure you want to delete <span className="text-white font-bold">"{docToDelete.name}"</span>?{' '}
              {docToDelete.storedIn === 'vercel-blob' && 'This will remove the file from Vercel Blob cloud storage.'}
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDocToDelete(null)}
                className="px-4 py-2 rounded-xl glass text-gray-300 text-sm font-semibold hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteDoc}
                className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold shadow-lg shadow-red-500/20 transition-all"
              >
                Delete Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Delete Folder Modal */}
      {folderToDelete && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass rounded-3xl max-w-md w-full p-6 border border-red-500/30 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2 bg-red-500/10 rounded-xl border border-red-500/20">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">Delete Folder?</h3>
            </div>
            <p className="text-sm text-gray-300">
              Are you sure you want to delete folder <span className="text-white font-bold">"{folderToDelete.name}"</span> and all documents inside it?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setFolderToDelete(null)}
                className="px-4 py-2 rounded-xl glass text-gray-300 text-sm font-semibold hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteFolder}
                className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold shadow-lg shadow-red-500/20 transition-all"
              >
                Delete Folder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass rounded-3xl max-w-md w-full p-6 border border-white/20 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FolderPlus className="text-lab-cyan" size={22} />
                Create New Folder
              </h3>
              <button
                onClick={() => setShowNewFolderModal(false)}
                className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateFolder} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Folder Name (e.g. Class 3 Math, Class 4 Computer)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter folder name..."
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-lab-cyan"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Theme Color Tag
                </label>
                <div className="flex gap-3">
                  {['blue', 'cyan', 'purple', 'emerald', 'amber'].map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setNewFolderColor(col)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform ${
                        newFolderColor === col ? 'scale-110 ring-2 ring-white' : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{
                        backgroundColor:
                          col === 'cyan'
                            ? '#06b6d4'
                            : col === 'purple'
                            ? '#a855f7'
                            : col === 'emerald'
                            ? '#10b981'
                            : col === 'amber'
                            ? '#f59e0b'
                            : '#3b82f6',
                      }}
                    >
                      {newFolderColor === col && <Check size={16} className="text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewFolderModal(false)}
                  className="px-4 py-2 rounded-xl glass text-gray-300 text-sm font-semibold hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-lab-cyan text-slate-950 text-sm font-bold hover:bg-cyan-400 transition-colors shadow-lg shadow-lab-cyan/20"
                >
                  Create Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Embedded Document Viewer Modal */}
      {viewingDoc && viewingUrl && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col border border-white/20 shadow-2xl overflow-hidden">
            {/* Viewer Header */}
            <div className="p-4 bg-slate-900/90 border-b border-white/10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                {getFileIcon(viewingDoc.name, viewingDoc.type)}
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-white truncate" title={viewingDoc.name}>
                    {viewingDoc.name}
                  </h3>
                  <p className="text-xs text-gray-400 flex items-center gap-2">
                    <span>{formatSize(viewingDoc.size)}</span>
                    {viewingDoc.storedIn === 'vercel-blob' && (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <Cloud size={12} />
                        Vercel Blob Public CDN
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {viewingDoc.url && (
                  <button
                    onClick={() => handleCopyPublicLink(viewingDoc)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass hover:bg-emerald-500/20 text-xs font-semibold text-emerald-400 border border-emerald-500/30"
                  >
                    {copiedDocId === viewingDoc.id ? <Check size={14} /> : <Share2 size={14} />}
                    <span>{copiedDocId === viewingDoc.id ? 'Link Copied!' : 'Copy Cloud Link'}</span>
                  </button>
                )}

                <a
                  href={viewingDoc.downloadUrl || viewingUrl}
                  download={viewingDoc.name}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass hover:bg-white/10 text-xs font-semibold text-gray-200"
                >
                  <Download size={14} />
                  <span>Download</span>
                </a>
                <a
                  href={viewingDoc.url || viewingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-lab-cyan/20 hover:bg-lab-cyan/30 text-lab-cyan text-xs font-semibold"
                >
                  <Maximize2 size={14} />
                  <span>Open Full Window</span>
                </a>
                <button
                  onClick={handleCloseViewer}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Viewer Body */}
            <div className="flex-1 bg-slate-950 overflow-hidden relative">
              {docLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-3">
                    <div className="w-10 h-10 border-3 border-lab-cyan/30 border-t-lab-cyan rounded-full animate-spin mx-auto" />
                    <p className="text-sm text-gray-400 font-medium">Rendering document...</p>
                  </div>
                </div>
              ) : viewingDoc.type === 'application/pdf' || viewingDoc.name.endsWith('.pdf') ? (
                <iframe
                  src={viewingUrl}
                  title={viewingDoc.name}
                  className="w-full h-full border-0"
                />
              ) : (viewingDoc.type === 'text/plain' || viewingDoc.name.endsWith('.txt')) ? (
                <div className="p-6 h-full overflow-y-auto font-mono text-sm text-green-400 bg-slate-900/90 whitespace-pre-wrap">
                  {textContent || 'Loading document text...'}
                </div>
              ) : docHtml ? (
                <div
                  className="p-8 h-full overflow-y-auto bg-white text-gray-900 prose prose-sm max-w-none"
                  style={{ fontFamily: 'Georgia, "Times New Roman", serif', lineHeight: 1.7 }}
                  dangerouslySetInnerHTML={{ __html: docHtml }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
                  <FileText size={64} className="text-lab-cyan animate-pulse" />
                  <h4 className="text-xl font-bold text-white">{viewingDoc.name}</h4>
                  <p className="text-sm text-gray-400 max-w-md">
                    This file type cannot be previewed inline. Download it or open full window to view.
                  </p>
                  <a
                    href={viewingDoc.downloadUrl || viewingUrl}
                    download={viewingDoc.name}
                    className="px-6 py-3 rounded-xl bg-lab-cyan text-slate-950 font-bold text-sm hover:bg-cyan-400 transition-colors shadow-lg"
                  >
                    Download Document
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
