'use client'

import React from 'react';
import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { ConnectButton, lightTheme } from '@rainbow-me/rainbowkit'
import Image from 'next/image'
import { AuthorDisplay } from '../utils/AuthorDisplay'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../providers/contract'
import { ProfilePicture } from '../utils/ProfilePicture'
import { handleDeletePost } from '../utils/deletePost'
import { getEthPrice } from '../utils/getEthPrice'

type ProfileSetupProps = {
  handleSetProfile: (profile: any) => void; // Adjust the type as necessary
};

const ProfileSetup = ({ handleSetProfile }: ProfileSetupProps) => {
  const [username, setUsername] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSetProfile(username);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="message">
      <h2 className="text-xl mb-4 text-white">Set Up Your Profile</h2>
      <p className="mb-4 text-gray-300">You need to set up a profile before you can post or interact.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          className="w-full p-4 bg-[rgba(229,231,235,0.1)] text-white rounded-3xl border border-[rgba(229,231,235,0.2)] focus:border-[#6A9AB0] focus:ring-1 focus:ring-[#6A9AB0] outline-none"
        />
        <button 
          type="submit"
          className="button-base mt-4"
        >
          Set Profile
        </button>
      </form>
    </div>
  );
}

const MainContent: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const { isConnected, address } = useAccount()
  const [newPost, setNewPost] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { writeContractAsync } = useWriteContract()
  const [ethPrice, setEthPrice] = useState<number>(0)
  const FEE = 0.0001 // Fee in ETH

  const { data: userProfile } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'getProfile',
    args: [address as `0x${string}`],
  })

  const { data: posts = [], isError, isLoading, refetch } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'getAllPosts',
  })

  // Move all useEffect hooks here
  useEffect(() => {
    const fetchPrice = async () => {
      const price = await getEthPrice()
      setEthPrice(price)
    }

    fetchPrice()
    const interval = setInterval(fetchPrice, 300000) // 5 minutes
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPost.trim()) return

    try {
      await writeContractAsync({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'createPost',
        args: [newPost, FEE],
        value: BigInt(FEE * 1e18)
      })

      setNewPost('')
      
      // Add a small delay to allow the blockchain to update
      setTimeout(async () => {
        await refetch() // Refresh the posts
      }, 2000) // 2 second delay

    } catch (error) {
      console.error('Error creating post:', error)
    }
  }

  const handleSetProfilePicture = async () => {
    if (!imageUrl) return;

    try {
      // Create a temporary HTML image element
      const img = document.createElement('img');
      img.src = imageUrl;
      
      const compressedImageUrl = await new Promise((resolve, reject) => {
        img.onload = () => {
          // Create canvas
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }
          
          // Set maximum dimensions
          const MAX_WIDTH = 100;  // Reduced from 200 to 100
          const MAX_HEIGHT = 100; // Reduced from 200 to 100
          
          // Calculate new dimensions
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          
          // Resize image
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          
          // Get compressed image URL with higher compression
          resolve(canvas.toDataURL('image/jpeg', 0.5)); // Increased compression (0.7 -> 0.5)
        };

        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };
      });

      // Send the compressed image URL to the contract
      await writeContractAsync({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'updateProfilePicture',
        args: [compressedImageUrl], // Using the compressed URL instead of original
      });

      setImageUrl('');
      setIsModalOpen(false);
      alert('Profile picture updated successfully!');
      
      // Refresh the page
      window.location.reload();
      
    } catch (error) {
      console.error('Error setting profile picture:', error);
      alert('Failed to update profile picture. Please try again.');
    }
  };

  const handleSetProfile = async (username: string) => {
    if (!address) {
      alert('Please connect your wallet');
      return;
    }

    try {
      await writeContractAsync({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'setProfile',
        args: [username],
      });

      alert('Profile set successfully!');
      window.location.reload();
    } catch (error) {
      console.error('Error setting profile:', error);
      alert('Failed to set profile. Please try again.');
    }
  };

  // Move the conditional render AFTER all hooks
  if (isConnected && !userProfile?.username) {
    return <ProfileSetup handleSetProfile={handleSetProfile} />;
  }

  const reversedPosts = [...posts].reverse(); // Reverse the posts array

  return (
    <>
      <main className="mt-1 pt-24 pb-12 min-h-screen">
        <div className="max-w-3xl mx-auto px-6">
          {isConnected ? (
            <>
              <div className="mb-8 mt-1">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="camera-button mb-4 flex items-center"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-6 w-6 text-white mr-2"
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Upload profile picture
                </button>

                <form onSubmit={handleSubmit}>
                  <div className="relative">
                    <textarea
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      placeholder="What's on your mind?"
                      className="message w-full resize-none"
                      rows={3}
                    />
                  </div>

                  {/* Preview uploaded image if exists */}
                  {imageUrl && (
                    <div className="message mt-4 relative w-full flex flex-col items-center gap-4">
                      <div className="relative max-w-[300px] max-h-[200px] overflow-hidden">
                        <img
                          src={imageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-2xl"
                          style={{ maxWidth: '300px', maxHeight: '200px' }}
                        />
                        <button
                          type="button"
                          onClick={() => setImageUrl('')}
                          className="absolute top-2 right-2 p-1 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-opacity z-10"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Submit PFP Button */}
                      <button
                        type="button"
                        onClick={handleSetProfilePicture}
                        className="button-base"
                      >
                        Set as Profile Picture
                      </button>
                    </div>
                  )}

                  {/* Upload Modal */}
                  {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center modal-overlay">
                      <div className="message max-w-lg w-full mx-4 relative">
                        <button
                          type="button"
                          onClick={() => setIsModalOpen(false)}
                          className="absolute top-4 right-4 text-white hover:opacity-80"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        
                        <h3 className="text-white text-xl mb-6">Upload Photo</h3>
                        
                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-xl p-8 cursor-pointer hover:border-gray-300 transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                const reader = new FileReader()
                                reader.onloadend = () => {
                                  setImageUrl(reader.result as string)
                                  setIsModalOpen(false)
                                }
                                reader.readAsDataURL(file)
                              }
                            }}
                            className="hidden"
                          />
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-white text-center">
                            Click to upload or drag and drop<br />
                            <span className="text-gray-400">PNG, JPG up to 10MB</span>
                          </p>
                        </label>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4">
                    {/* Upload PFP Button - now on the left */}
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                    >
                    </button>
                    <div className="flex items-center gap-4"> {/* Wrapper for right-side elements */}
                      {/* Post Button */}
                      <button
                        type="submit"
                        disabled={!newPost.trim()}
                        className="button-base disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Post
                      </button>

                      {/* Fee Display */}
                      <div className="text-white text-sm opacity-80">
                        Fee: {FEE} ETH {ethPrice > 0 && `(≈ $${(FEE * ethPrice).toFixed(4)})`}
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <div style={{ minHeight: '4vh' }}></div>

              <div className="chat-feed">
                {reversedPosts.map((post, index) => (
                  <div key={index} className="message">
                    <div className="message-header flex items-center gap-3 mb-4">
                      <ProfilePicture address={post.author} />
                      <AuthorDisplay address={post.author} />
                    </div>
                    <div className="message-content">
                      {post.content}
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                      {address && address.toLowerCase() === post.author.toLowerCase() && (
                        <button 
                          onClick={() => handleDeletePost(index, post.author, address, writeContractAsync, refetch)}
                          className="delete-button"
                        >
                          Delete Post
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center text-white">
              Please connect your wallet to post and interact
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default function Page() {
  return <MainContent />
}
