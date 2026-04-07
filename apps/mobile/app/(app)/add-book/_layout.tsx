import { AddBookProvider } from '@/context/add-book-context'
import { Stack } from 'expo-router/stack'

export default function AddBookLayout() {
  return (
    <AddBookProvider>
      <Stack>
        <Stack.Screen name="scan-cover" options={{ title: 'Scan Cover' }} />
        <Stack.Screen name="review-cover" options={{ title: 'Book Details' }} />
        <Stack.Screen name="scan-index" options={{ title: 'Scan Index' }} />
        <Stack.Screen name="review-recipes" options={{ title: 'Review Recipes' }} />
      </Stack>
    </AddBookProvider>
  )
}
