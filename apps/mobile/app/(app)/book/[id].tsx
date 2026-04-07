import { useBook, useDeleteBook } from '@/hooks/use-books'
import { Image } from 'expo-image'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import { ActivityIndicator, Alert, FlatList, Pressable, Text, View } from 'react-native'

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data: book, isLoading, error } = useBook(id)
  const deleteBook = useDeleteBook()

  const handleDelete = () => {
    Alert.alert('Delete Book', `Remove "${book?.title}" and all its recipes?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteBook.mutate(id, {
            onSuccess: () => router.back(),
          })
        },
      },
    ])
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (error || !book) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-500">Failed to load book</Text>
      </View>
    )
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: book.title,
          headerRight: () => (
            <Pressable onPress={handleDelete}>
              <Image source="sf:trash" style={{ width: 20, height: 20 }} tintColor="#EF4444" />
            </Pressable>
          ),
        }}
      />

      <FlatList
        data={book.recipes}
        contentInsetAdjustmentBehavior="automatic"
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View className="px-4 pt-2 pb-4 gap-1">
            <Text className="text-sm text-gray-500">{book.author}</Text>
            <Text className="text-sm text-gray-400">
              {book.recipes.length} {book.recipes.length === 1 ? 'recipe' : 'recipes'}
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 32 }}
        renderItem={({ item }) => (
          <View className="px-4 py-3 flex-row justify-between items-center border-b border-gray-100">
            <Text className="text-base text-gray-900 flex-1" selectable>
              {item.name}
            </Text>
            <Text className="text-sm text-gray-400 ml-3" style={{ fontVariant: ['tabular-nums'] }}>
              p. {item.pageStart}
              {item.pageEnd !== item.pageStart ? `–${item.pageEnd}` : ''}
            </Text>
          </View>
        )}
      />
    </>
  )
}
