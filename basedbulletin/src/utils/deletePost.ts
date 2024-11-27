import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../providers/contract';
import { toast } from 'react-hot-toast'

export const handleDeletePost = async (
  index: number, 
  postAuthor: string, 
  currentAddress: string,
  writeContractAsync: any,
  refetch: () => void
) => {
  if (postAuthor.toLowerCase() !== currentAddress.toLowerCase()) {
    toast.error("You can only delete your own posts")
    return
  }

  try {
    await writeContractAsync({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'deletePost',
      args: [index],
    })
    toast.success('Post deleted successfully')
    await refetch() // Await the refetch
  } catch (error: any) {
    console.error('Error deleting post:', error)
    // Check for specific error message
    if (error.message?.includes('Post already deleted')) {
      toast.error('This post has already been deleted')
      await refetch() // Refresh to remove the deleted post from UI
    } else {
      toast.error('Failed to delete post')
    }
  }
};