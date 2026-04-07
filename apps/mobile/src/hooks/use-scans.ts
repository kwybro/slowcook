import { api } from '@/lib/api-client'
import type { ExtractedBookMeta, ExtractedRecipe } from '@slowcook/shared'
import { useMutation } from '@tanstack/react-query'

interface ScanCoverResult {
  title: string
  author: string
}

export function useScanCover() {
  return useMutation({
    mutationFn: async (imageUri: string): Promise<ScanCoverResult> => {
      const formData = new FormData()
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'cover.jpg',
      } as unknown as Blob)
      return api.postFormData<ExtractedBookMeta>('/api/scans/cover', formData)
    },
  })
}

export function useScanIndex() {
  return useMutation({
    mutationFn: async (imageUris: string[]): Promise<ExtractedRecipe[]> => {
      const formData = new FormData()
      for (const uri of imageUris) {
        formData.append('images', {
          uri,
          type: 'image/jpeg',
          name: 'index.jpg',
        } as unknown as Blob)
      }
      return api.postFormData<ExtractedRecipe[]>('/api/scans/index', formData)
    },
  })
}
