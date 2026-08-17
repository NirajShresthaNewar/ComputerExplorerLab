import { put, del } from '@vercel/blob'

const STORAGE_KEY = 'vercel_blob_rw_token'

/**
 * Gets the current Vercel Blob Read-Write Token from localStorage or environment variables.
 */
export function getVercelBlobToken() {
  const localToken = localStorage.getItem(STORAGE_KEY)
  if (localToken && localToken.trim()) {
    return localToken.trim()
  }
  const envToken = import.meta.env.VITE_VERCEL_BLOB_TOKEN
  if (envToken && envToken.trim()) {
    return envToken.trim()
  }
  return null
}

/**
 * Saves the Vercel Blob Read-Write Token to localStorage.
 */
export function saveVercelBlobToken(token) {
  if (!token || !token.trim()) {
    localStorage.removeItem(STORAGE_KEY)
  } else {
    localStorage.setItem(STORAGE_KEY, token.trim())
  }
}

/**
 * Removes the Vercel Blob token from localStorage.
 */
export function removeVercelBlobToken() {
  localStorage.removeItem(STORAGE_KEY)
}

/**
 * Returns true if a Vercel Blob token is available.
 */
export function isVercelBlobConfigured() {
  return Boolean(getVercelBlobToken())
}

/**
 * Uploads a file to Vercel Blob storage.
 * Returns metadata including { url, downloadUrl, pathname, contentType }.
 */
export async function uploadToVercelBlob(file, customFilename = null) {
  const token = getVercelBlobToken()
  if (!token) {
    throw new Error('Vercel Blob token is missing. Please configure your Vercel Blob Read-Write Token.')
  }

  const filename = customFilename || file.name
  const mimeType = file.type || getFallbackMimeType(filename)

  try {
    // Attempt standard @vercel/blob SDK put call first
    const blobResult = await put(filename, file, {
      access: 'public',
      token,
      contentType: mimeType,
      addRandomSuffix: true,
    })
    return {
      url: blobResult.url,
      downloadUrl: blobResult.downloadUrl || blobResult.url,
      pathname: blobResult.pathname || filename,
      contentType: blobResult.contentType || mimeType,
      size: file.size,
    }
  } catch (sdkErr) {
    console.warn('SDK upload error, trying direct Vercel Blob REST endpoint...', sdkErr)
    // Fallback to direct REST endpoint upload if SDK call encounters client environment restrictions
    return await uploadViaRestApi(file, filename, mimeType, token)
  }
}

/**
 * Fallback direct REST API upload for Vercel Blob
 */
async function uploadViaRestApi(file, filename, mimeType, token) {
  const encodedName = encodeURIComponent(filename)
  const uploadUrl = `https://blob.vercel-storage.com/${encodedName}?addRandomSuffix=true`

  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      authorization: `Bearer ${token}`,
      'x-api-version': '7',
      'x-access': 'public',
      'content-type': mimeType,
    },
    body: file,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Vercel Blob upload failed (${response.status}): ${errorText || response.statusText}`)
  }

  const data = await response.json()
  return {
    url: data.url,
    downloadUrl: data.downloadUrl || data.url,
    pathname: data.pathname || filename,
    contentType: data.contentType || mimeType,
    size: file.size,
  }
}

/**
 * Deletes a file from Vercel Blob storage given its public URL.
 */
export async function deleteFromVercelBlob(url) {
  if (!url) return false
  const token = getVercelBlobToken()
  if (!token) {
    console.warn('Cannot delete from Vercel Blob: Token missing')
    return false
  }

  try {
    await del(url, { token })
    return true
  } catch (err) {
    console.warn('Vercel Blob SDK delete failed, trying REST API...', err)
    try {
      const response = await fetch('https://blob.vercel-storage.com/delete', {
        method: 'POST',
        headers: {
          authorization: `Bearer ${token}`,
          'x-api-version': '7',
          'content-type': 'application/json',
        },
        body: JSON.stringify({ urls: [url] }),
      })
      return response.ok
    } catch (restErr) {
      console.error('Failed to delete blob from Vercel Blob', restErr)
      return false
    }
  }
}

function getFallbackMimeType(filename) {
  const ext = filename.split('.').pop().toLowerCase()
  if (ext === 'pdf') return 'application/pdf'
  if (ext === 'doc' || ext === 'docx') return 'application/msword'
  if (ext === 'txt') return 'text/plain'
  return 'application/octet-stream'
}
