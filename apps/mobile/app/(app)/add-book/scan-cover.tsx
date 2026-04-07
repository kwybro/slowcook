import { useAddBook } from '@/hooks/use-add-book'
import { useScanCover } from '@/hooks/use-scans'
import { CameraView, useCameraPermissions } from 'expo-camera'
import { router } from 'expo-router'
import { useRef } from 'react'
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'

export default function ScanCoverScreen() {
  const [permission, requestPermission] = useCameraPermissions()
  const cameraRef = useRef<CameraView>(null)
  const { setCover, setMeta } = useAddBook()
  const scanCover = useScanCover()

  if (!permission) {
    return <View className="flex-1 bg-black" />
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center px-8 gap-4">
        <Text className="text-center text-gray-700">Camera access is needed to scan cookbooks</Text>
        <TouchableOpacity className="bg-blue-500 rounded-lg px-6 py-3" onPress={requestPermission}>
          <Text className="text-white font-semibold">Grant Access</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const handleCapture = async () => {
    const photo = await cameraRef.current?.takePictureAsync({ quality: 0.8 })
    if (!photo) return

    setCover(photo.uri)
    scanCover.mutate(photo.uri, {
      onSuccess: (result) => {
        setMeta(result.title, result.author)
        router.push('/(app)/add-book/review-cover')
      },
    })
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back">
        <View className="flex-1 justify-end items-center pb-12">
          {scanCover.isPending ? (
            <View className="bg-white/90 rounded-full p-5">
              <ActivityIndicator size="large" />
            </View>
          ) : (
            <>
              <Text className="text-white text-sm mb-4 text-center">
                Position the cookbook cover in frame
              </Text>
              <TouchableOpacity
                className="w-20 h-20 rounded-full border-4 border-white bg-white/30 items-center justify-center"
                onPress={handleCapture}
              >
                <View className="w-16 h-16 rounded-full bg-white" />
              </TouchableOpacity>
            </>
          )}
          {scanCover.isError ? (
            <Text className="text-red-400 text-sm mt-3">Failed to extract — try again</Text>
          ) : null}
        </View>
      </CameraView>
    </View>
  )
}
