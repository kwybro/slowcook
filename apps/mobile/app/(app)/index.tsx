import { useBooks } from '@/hooks/use-books'
import { Image } from 'expo-image'
import { Link, Stack } from 'expo-router'
import { useState } from 'react'
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native'

export default function LibraryScreen() {
  const [search, setSearch] = useState('')
  const { data: books, isLoading, error } = useBooks(search || undefined)

  return (
    <>
      <Stack.Screen
        options={{
          title: 'My Cookbooks',
          headerLargeTitle: true,
          headerSearchBarOptions: {
            placeholder: 'Search books & recipes...',
            onChangeText: (e) => setSearch(e.nativeEvent.text),
          },
          headerRight: () => (
            <Link href="/(app)/add-book/scan-cover" asChild>
              <Pressable>
                <Image source="sf:plus" style={{ width: 24, height: 24 }} tintColor="#007AFF" />
              </Pressable>
            </Link>
          ),
        }}
      />

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-red-500 text-center">Failed to load books</Text>
        </View>
      ) : books?.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8 gap-3">
          <Image source="sf:book.closed" style={{ width: 48, height: 48 }} tintColor="#9CA3AF" />
          <Text className="text-gray-500 text-center text-lg">No cookbooks yet</Text>
          <Text className="text-gray-400 text-center text-sm">
            Tap + to scan your first cookbook
          </Text>
        </View>
      ) : (
        <FlatList
          data={books}
          contentInsetAdjustmentBehavior="automatic"
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          renderItem={({ item }) => (
            <Link href={`/(app)/book/${item.id}`} asChild>
              <Pressable
                className="bg-white rounded-xl p-4 gap-1"
                style={{ borderCurve: 'continuous', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
              >
                <Text className="text-base font-semibold text-gray-900">{item.title}</Text>
                <Text className="text-sm text-gray-500">{item.author}</Text>
              </Pressable>
            </Link>
          )}
        />
      )}
    </>
  )
}
