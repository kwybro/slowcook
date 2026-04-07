import { router } from 'expo-router'
import { useState } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function SignInScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    try {
      const endpoint = isSignUp ? '/api/auth/sign-up/email' : '/api/auth/sign-in/email'
      const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8787'

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name: email.split('@')[0] }),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error((body as Record<string, string>).message ?? 'Auth failed')
      }

      // TODO: store session token from response
      router.replace('/(app)')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center px-8 gap-6">
        <View className="gap-2">
          <Text className="text-3xl font-bold text-gray-900">Slowcook</Text>
          <Text className="text-lg text-gray-500">
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </Text>
        </View>

        {error ? (
          <View className="bg-red-50 p-3 rounded-lg">
            <Text className="text-red-700 text-sm">{error}</Text>
          </View>
        ) : null}

        <View className="gap-4">
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          className="bg-gray-900 rounded-lg py-3.5 items-center"
          onPress={handleSubmit}
          disabled={loading || !email || !password}
          style={{ opacity: loading || !email || !password ? 0.5 : 1 }}
        >
          <Text className="text-white font-semibold text-base">
            {loading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsSignUp((prev) => !prev)}>
          <Text className="text-gray-500 text-center text-sm">
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
