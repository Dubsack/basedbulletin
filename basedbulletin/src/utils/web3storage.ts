import { Web3Storage } from 'web3.storage'

const client = new Web3Storage({ token: 'did:key:z6MkgWRtv12CrGHvusk8mNxqm64eG2SrZv9TSJ8DhEtPspeQ' })

export async function uploadToIPFS(file: File): Promise<string> {
  try {
    console.log('Starting IPFS upload for file:', file.name)
    
    // Create a unique filename
    const filename = `${Date.now()}-${file.name}`.replace(/[^a-zA-Z0-9.-]/g, '')
    const newFile = new File([file], filename, { type: file.type })
    
    console.log('Uploading to IPFS...')
    const cid = await client.put([newFile])
    console.log('IPFS CID received:', cid)
    
    const url = `https://${cid}.ipfs.w3s.link/${filename}`
    console.log('Generated URL:', url)
    
    return url
  } catch (error) {
    console.error('IPFS upload error:', error)
    throw new Error('Failed to upload image to IPFS')
  }
} 