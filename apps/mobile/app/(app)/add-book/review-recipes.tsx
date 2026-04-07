import { useAddBook } from '@/hooks/use-add-book'
import { useCreateBook } from '@/hooks/use-books'
import type { ExtractedRecipe } from '@slowcook/shared'
import { router } from 'expo-router'
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native'

export default function ReviewRecipesScreen() {
  const { state, dispatch } = useAddBook()
  const createBook = useCreateBook()

  const handleUpdateRecipe = (index: number, updates: Partial<ExtractedRecipe>) => {
    const current = state.recipes[index]
    if (!current) return
    dispatch({
      type: 'UPDATE_RECIPE',
      index,
      recipe: { ...current, ...updates },
    })
  }

  const handleSave = () => {
    createBook.mutate(
      {
        title: state.title,
        author: state.author,
        recipes: state.recipes.map((r) => ({
          name: r.name,
          pageStart: r.pageStart,
          pageEnd: r.pageEnd,
        })),
      },
      {
        onSuccess: () => {
          router.dismissAll()
          router.back()
        },
      },
    )
  }

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={state.recipes}
        contentInsetAdjustmentBehavior="automatic"
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListHeaderComponent={
          <View className="pb-2">
            <Text className="text-sm text-gray-500">
              {state.recipes.length} recipe{state.recipes.length === 1 ? '' : 's'} found in "
              {state.title}"
            </Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <View
            className="border border-gray-200 rounded-lg p-3 gap-2"
            style={{ borderCurve: 'continuous' }}
          >
            <TextInput
              className="text-base font-medium text-gray-900"
              value={item.name}
              onChangeText={(text) => handleUpdateRecipe(index, { name: text })}
            />
            <View className="flex-row gap-3 items-center">
              <Text className="text-sm text-gray-500">Pages:</Text>
              <TextInput
                className="border border-gray-200 rounded px-2 py-1 text-sm w-16 text-center"
                value={String(item.pageStart)}
                onChangeText={(text) => {
                  const n = Number.parseInt(text, 10)
                  if (!Number.isNaN(n)) handleUpdateRecipe(index, { pageStart: n })
                }}
                keyboardType="number-pad"
              />
              <Text className="text-gray-400">–</Text>
              <TextInput
                className="border border-gray-200 rounded px-2 py-1 text-sm w-16 text-center"
                value={String(item.pageEnd)}
                onChangeText={(text) => {
                  const n = Number.parseInt(text, 10)
                  if (!Number.isNaN(n)) handleUpdateRecipe(index, { pageEnd: n })
                }}
                keyboardType="number-pad"
              />
              <View className="flex-1" />
              <TouchableOpacity onPress={() => dispatch({ type: 'REMOVE_RECIPE', index })}>
                <Text className="text-red-500 text-sm">Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListFooterComponent={
          <TouchableOpacity
            className="bg-gray-900 rounded-lg py-3.5 items-center mt-4"
            onPress={handleSave}
            disabled={createBook.isPending || state.recipes.length === 0}
            style={{
              opacity: createBook.isPending || state.recipes.length === 0 ? 0.5 : 1,
            }}
          >
            <Text className="text-white font-semibold text-base">
              {createBook.isPending ? 'Saving...' : 'Save Cookbook'}
            </Text>
          </TouchableOpacity>
        }
      />
    </View>
  )
}
