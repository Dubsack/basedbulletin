'use client'

import { useState } from 'react'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './contract'
import { AuthorDisplay } from '../utils/AuthorDisplay'

export function Feed() {
  const [newPost, setNewPost] = useState('')
  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()

  const { data: posts = [], isError, isLoading, refetch } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'getAllPosts',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPost.trim()) return

    try {
      await writeContractAsync({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'createPost',
        args: [newPost, 'additionalArgument'],
      })
      setNewPost('')
    } catch (error) {
      console.error('Error creating post:', error)
    }
  }

  if (isLoading) return <div className="text-[#EAD8B1] text-center py-8">Loading...</div>
  if (isError) return <div className="text-red-500 text-center py-8">Error loading posts</div>

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {address && (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full p-4 bg-[#1A1B1E] text-[#EAD8B1] rounded-xl border border-[#2A2B2E] focus:border-[#4A4B4E] focus:ring-1 focus:ring-[#4A4B4E] outline-none resize-none"
            rows={3}
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={!newPost.trim()}
              className="px-6 py-2 bg-[#2A2B2E] text-[#EAD8B1] rounded-xl hover:bg-[#3A3B3E] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Post
            </button>
          </div>
        </form>
      )}
    </div>
  )
} 