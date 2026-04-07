import { AddBookContext } from '@/context/add-book-context'
import { use } from 'react'

export function useAddBook() {
  const context = use(AddBookContext)
  if (!context) {
    throw new Error('useAddBook must be used within AddBookProvider')
  }
  return context
}
