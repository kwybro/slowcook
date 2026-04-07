import { useAddBook } from '@/hooks/use-add-book'
import { useScanIndex } from '@/hooks/use-scans'
import { CameraView, useCameraPermissions } from 'expo-camera'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { useRef, useState } from 'react'
import { ActivityIndicator, FlatList, Pressable, Text, TouchableOpacity, View } from 'react-native'

export default function ScanIndexScreen() {
  const [permission] = useCameraPermissions()
  const cameraRef = useRef<CameraView>(null)
  const { setIndexUris, setRecipes } = useAddBook()
  const [capturedUris, setCapturedUris] = useState<string[]>([])
  const scanIndex = useScanIndex()

  if (!permission?.granted) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500">Camera permission required</Text>
      </View>
    )
  }

  const handleCapture = async () => {
    const photo = await cameraRef.current?.takePictureAsync({ quality: 0.8 })
    if (photo) {
      setCapturedUris((prev) => [...prev, photo.uri])
    }
  }

  const handleRemove = (index: number) => {
    setCapturedUris((prev) => prev.filter((_, i) => i !== index))
  }

  const handleDone = () => {
    setIndexUris(capturedUris)
    scanIndex.mutate(capturedUris, {
      onSuccess: (result) => {
        setRecipes(result)
        router.push('/(app)/add-book/review-recipes')
      },
    })
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back">
        <View className="flex-1 justify-end">
          {/* Thumbnail strip */}
          {capturedUris.length > 0 ? (
            <FlatList
              horizontal
              data={capturedUris}
              keyExtractor={(_, i) => String(i)}
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 12, gap: 8 }}
              renderItem={({ item, index }) => (
                <View>
                  <Image
                    source={{ uri: item }}
                    style={{ width: 60, height: 80, borderRadius: 6 }}
                    contentFit="cover"
                  />
                  <Pressable
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 items-center justify-center"
                    onPress={() => handleRemove(index)}
                  >
                    <Text className="text-white text-xs font-bold">×</Text>
                  </Pressable>
                </View>
              )}
            />
          ) : null}

          <View className="items-center pb-12 gap-3">
            {scanIndex.isPending ? (
              <View className="bg-white/90 rounded-full p-5">
                <ActivityIndicator size="large" />
              </View>
            ) : (
              <>
                <Text className="text-white text-sm text-center">
                  {capturedUris.length === 0
                    ? 'Take photos of the index / table of contents'
                    : `${capturedUris.length} page${capturedUris.length === 1 ? '' : 's'} captured`}
                </Text>
                <View className="flex-row gap-4">
                  <TouchableOpacity
                    className="w-20 h-20 rounded-full border-4 border-white bg-white/30 items-center justify-center"
                    onPress={handleCapture}
                  >
                    <View className="w-16 h-16 rounded-full bg-white" />
                  </TouchableOpacity>
                </View>
                {capturedUris.length > 0 ? (
                  <TouchableOpacity
                    className="bg-blue-500 rounded-full px-6 py-2.5"
                    onPress={handleDone}
                  >
                    <Text className="text-white font-semibold">Extract Recipes</Text>
                  </TouchableOpacity>
                ) : null}
              </>
            )}
            {scanIndex.isError ? (
              <Text className="text-red-400 text-sm">Failed to extract — try again</Text>
            ) : null}
          </View>
        </View>
      </CameraView>
    </View>
  )
}
