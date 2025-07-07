"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "@/lib/firebase_init"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Chrome, Code2, Brain, Zap } from "lucide-react"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)

      const token = await result.user.getIdToken()
      localStorage.setItem("token", token) 
      router.push("/dashboard")
    } catch (err) {
      console.error("Login error:", err)
      alert("Failed to sign in")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%239C92AC' fillOpacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <Card className="w-full max-w-md bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
        <CardContent className="p-8 text-center">
          <div className="mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg">
                  <Code2 className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <Brain className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
              RepeetCode: Spaced Repetition
            </h1>
            <p className="text-gray-300 text-sm">
              Master coding interviews with intelligent review scheduling
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <Feature icon={<Code2 className="w-6 h-6 text-blue-400" />} label="Track Problems" bg="from-blue-500/20 to-cyan-500/20" border="border-blue-500/30" />
            <Feature icon={<Brain className="w-6 h-6 text-purple-400" />} label="Smart Reviews" bg="from-purple-500/20 to-pink-500/20" border="border-purple-500/30" />
            <Feature icon={<Zap className="w-6 h-6 text-emerald-400" />} label="Boost Retention" bg="from-emerald-500/20 to-teal-500/20" border="border-emerald-500/30" />
          </div>

          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full bg-white text-gray-900 hover:bg-gray-100 font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                Signing in...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Chrome className="w-5 h-5 mr-2" />
                Continue with Google
              </div>
            )}
          </Button>

          <p className="text-gray-400 text-xs mt-6">Secure authentication powered by Firebase</p>
        </CardContent>
      </Card>
    </div>
  )
}

function Feature({ icon, label, bg, border }: any) {
  return (
    <div className="text-center">
      <div className={`w-12 h-12 bg-gradient-to-r ${bg} rounded-xl flex items-center justify-center mx-auto mb-2 border ${border}`}>
        {icon}
      </div>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  )
}
