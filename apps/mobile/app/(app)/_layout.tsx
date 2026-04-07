import { Stack } from 'expo-router/stack'

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'My Cookbooks',
          headerLargeTitle: true,
        }}
      />
      <Stack.Screen
        name="book/[id]"
        options={{
          title: 'Book',
        }}
      />
      <Stack.Screen
        name="add-book"
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
    </Stack>
  )
}
