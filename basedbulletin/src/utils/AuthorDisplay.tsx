import { useState, useEffect } from 'react'
import { useReadContract } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../providers/contract'

export function AuthorDisplay({ address }: { address: string }) {
  const [displayName, setDisplayName] = useState<string>('')
  const [error, setError] = useState(false)
  
  const { data: profile, isError } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'getProfile',
    args: [address],
    onError: (error) => {
      console.error('Error fetching profile:', error)
      setError(true)
      setDisplayName(`${address.slice(0, 6)}...${address.slice(-4)}`)
    },
  })

  useEffect(() => {
    if (profile && profile.username) {
      setDisplayName(profile.username)
      setError(false)
    } else if (!error) {
      setDisplayName(`${address.slice(0, 6)}...${address.slice(-4)}`)
    }
  }, [profile, address, error])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  return (
    <div className="text-[#e0f2fe] font-medium">
      {displayName}
    </div>
  )
} 