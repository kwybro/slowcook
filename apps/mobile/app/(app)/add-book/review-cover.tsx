import { useAddBook } from '@/hooks/use-add-book'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'

export default function ReviewCoverScreen() {
  const { state, setMeta } = useAddBook()

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ padding: 16, gap: 24 }}
      contentInsetAdjustmentBehavior="automatic"
    >
      {state.coverUri ? (
        <Image
          source={{ uri: state.coverUri }}
          style={{ width: '100%', height: 200, borderRadius: 12 }}
          contentFit="cover"
        />
      ) : null}

      <View className="gap-4">
        <View className="gap-2">
          <Text className="text-sm font-medium text-gray-700">Title</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900"
            value={state.title}
            onChangeText={(text) => setMeta(text, state.author)}
            placeholder="Book title"
          />
        </View>

        <View className="gap-2">
          <Text className="text-sm font-medium text-gray-700">Author</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900"
            value={state.author}
            onChangeText={(text) => setMeta(state.title, text)}
            placeholder="Author name"
          />
        </View>
      </View>

      <TouchableOpacity
        className="bg-gray-900 rounded-lg py-3.5 items-center"
        onPress={() => router.push('/(app)/add-book/scan-index')}
        disabled={!state.title || !state.author}
        style={{ opacity: !state.title || !state.author ? 0.5 : 1 }}
      >
        <Text className="text-white font-semibold text-base">Next: Scan Index Pages</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}
