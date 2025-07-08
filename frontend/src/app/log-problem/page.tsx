"use client"

import React, { useEffect, useState } from "react"
import { getAuth } from "firebase/auth"  // <-- import firebase auth
import { auth } from "@/lib/firebase_init"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CheckCircle, ArrowLeft, Plus, Code2 } from "lucide-react"
import Link from "next/link"

interface Problem {
  slug: string
  title: string
  tags: string[]
  official_difficulty: string // from backend
}

export default function LogProblemPage() {
  const [problemBank, setProblemBank] = useState<Problem[]>([])
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    personalDifficulty: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Fetch problem bank on mount
  useEffect(() => {
    async function fetchProblems() {
      const auth = getAuth()
      const user = auth.currentUser

      if (!user) {
        alert("Please sign in first.")
        return
      }

      try {
        // Force refresh token to ensure it's valid
        const token = await user.getIdToken(true)

        const res = await fetch("http://localhost:8000/problem_bank", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) throw new Error("Failed to fetch problem bank")

        const data = await res.json()
        setProblemBank(data.problems || [])
      } catch (error) {
        console.error("Error fetching problems:", error)
        setProblemBank([])
      }
    }
    fetchProblems()
  }, [])

  // When user selects a problem from dropdown, auto-fill title and slug
  function onProblemSelect(slug: string) {
    const prob = problemBank.find((p) => p.slug === slug)
    if (prob) {
      setFormData((prev) => ({
        ...prev,
        title: prob.title,
        slug: prob.slug,
      }))
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const auth = getAuth()
    const user = auth.currentUser

    if (!user) {
      alert("You're not signed in.")
      setIsSubmitting(false)
      return
    }

    try {
      // Force refresh token before POST
      const token = await user.getIdToken(true)

      const payload = {
        slug: formData.slug,
        title: formData.title,
        difficulty: Number(formData.personalDifficulty),
      }

      const response = await fetch("http://localhost:8000/log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error("Failed to log problem")

      setIsSubmitting(false)
      setIsSuccess(true)
      setFormData({ title: "", slug: "", personalDifficulty: "" })

      setTimeout(() => setIsSuccess(false), 2000)
    } catch (error) {
      console.error("Error logging problem:", error)
      alert("Something went wrong.")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center space-x-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Log New Problem</h1>
              <p className="text-sm text-gray-400">Add a LeetCode problem to your spaced repetition system</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <Card className="bg-white/5 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white flex items-center">
              <Code2 className="w-6 h-6 mr-3 text-emerald-400" />
              Problem Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isSuccess ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Problem Logged Successfully!</h3>
                <p className="text-gray-400 mb-6">Your problem has been added to the spaced repetition system</p>
                <div className="flex justify-center space-x-4">
                  <Link href="/dashboard">
                    <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600">
                      Go to Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                    onClick={() => setIsSuccess(false)}
                  >
                    Log Another
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Problem Selector */}
                <div className="space-y-2">
                  <Label htmlFor="problemSelect" className="text-white font-medium">
                    Select Problem *
                  </Label>
                  <Select
                    value={formData.slug}
                    onValueChange={(value) => {
                      handleInputChange("slug", value)
                      onProblemSelect(value)
                    }}
                    name="problemSelect"
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Search or select problem" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-white/20 max-h-60 overflow-auto">
                      {problemBank.length === 0 ? (
                        <SelectItem value="loading" disabled>
                          Loading problems...
                        </SelectItem>
                      ) : (
                        problemBank.map((problem) => (
                          <SelectItem key={problem.slug} value={problem.slug}>
                            {problem.title} ({problem.official_difficulty})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Personal Difficulty */}
                <div className="space-y-2">
                  <Label className="text-white font-medium">Personal Difficulty (1-5) *</Label>
                  <Select
                    value={formData.personalDifficulty}
                    onValueChange={(value) => handleInputChange("personalDifficulty", value)}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-white/20">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-6">
                  <Link href="/dashboard">
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    disabled={!formData.slug || !formData.personalDifficulty || isSubmitting}
                    className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold px-8 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Logging Problem...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Plus className="w-4 h-4 mr-2" />
                        Log Problem
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
