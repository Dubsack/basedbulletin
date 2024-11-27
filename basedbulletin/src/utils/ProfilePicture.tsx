'use client'

import { useEffect, useState } from 'react'
import { useReadContract } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../providers/contract'

interface ProfilePictureProps {
  address: string
  className?: string
}

export function ProfilePicture({ address, className = "w-10 h-10" }: ProfilePictureProps) {
  const { data: profile } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'getProfile',
    args: [address],
  })

  return (
    <div className={`${className} rounded-full overflow-hidden bg-gray-800 flex items-center justify-center`}>
      {profile?.imageUrl ? (
        <img
          src={profile.imageUrl}
          alt={`Profile picture of ${address}`}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
      )}
    </div>
  )
}