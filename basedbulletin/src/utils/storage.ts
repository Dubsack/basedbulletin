export async function uploadToIPFS(file: File): Promise<string> {
    try {
      console.log('Starting upload...')
      
      const formData = new FormData()
      formData.append('file', file)
  
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
  
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Upload failed')
      }
  
      const data = await response.json()
      const imageUrl = data.url
      console.log('Upload complete:', imageUrl)
      
      // Return the full URL
      const baseUrl = window.location.origin
      return `${baseUrl}${imageUrl}`
    } catch (error) {
      console.error('Upload error:', error)
      throw new Error('Failed to upload image')
    }
  }