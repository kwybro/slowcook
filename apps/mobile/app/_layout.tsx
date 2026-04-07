import '@/global.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Stack } from 'expo-router/stack'
import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="(app)" />
      </Stack>
    </QueryClientProvider>
  )
}
