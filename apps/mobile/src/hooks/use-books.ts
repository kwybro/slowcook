import { api } from '@/lib/api-client'
import type { BookResponse, BookWithRecipesResponse, CreateBookRequest } from '@slowcook/shared'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useBooks(searchQuery?: string) {
  const path = searchQuery ? `/api/books?q=${encodeURIComponent(searchQuery)}` : '/api/books'
  return useQuery<BookResponse[]>({
    queryKey: ['books', searchQuery ?? ''],
    queryFn: () => api.get(path),
  })
}

export function useBook(id: string) {
  return useQuery<BookWithRecipesResponse>({
    queryKey: ['books', id],
    queryFn: () => api.get(`/api/books/${id}`),
  })
}

export function useCreateBook() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateBookRequest) => api.post<BookResponse>('/api/books', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] })
    },
  })
}

export function useDeleteBook() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/books/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] })
    },
  })
}
