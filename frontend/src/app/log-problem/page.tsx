"use client"

import React, { useEffect, useState } from "react"
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
import { Input } from "@/components/ui/input" // If you have a UI input component

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
  const [search, setSearch] = useState("")

  // Fetch problem bank on mount
  useEffect(() => {
    async function fetchProblems() {
      const user = auth.currentUser

      if (!user) {
        alert("Please sign in first.")
        return
      }

      try {
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

    const user = auth.currentUser

    if (!user) {
      alert("You're not signed in.")
      setIsSubmitting(false)
      return
    }

    try {
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
    } catch (error) {
      console.error("Error logging problem:", error)
      alert("Something went wrong.")
      setIsSubmitting(false)
    }
  }

  // Filtered problems for dropdown
  const filteredProblems = problemBank.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
  )

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
                    <SelectTrigger className="bg-cyan-900/60 border-cyan-400/40 text-cyan-200 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition">
                      <SelectValue
                        placeholder="Search or select problem"
                        className="text-cyan-200"
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-cyan-950 border-cyan-400/40 max-h-80 overflow-auto text-cyan-100">
                      <div className="sticky top-0 z-10 bg-cyan-950 px-2 py-2">
                        <Input
                          autoFocus
                          placeholder="Type to search..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="bg-cyan-900/60 border-cyan-400/40 text-cyan-200 placeholder-cyan-400 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
                        />
                      </div>
                      {filteredProblems.length === 0 ? (
                        <SelectItem value="loading" disabled className="text-cyan-400">
                          No problems found...
                        </SelectItem>
                      ) : (
                        <>
                          {filteredProblems.slice(0, 50).map((problem) => (
                            <SelectItem
                              key={problem.slug}
                              value={problem.slug}
                              className="hover:bg-cyan-800/60 text-cyan-100 focus:bg-emerald-700/60"
                            >
                              {problem.title} <span className="text-cyan-400">({problem.official_difficulty})</span>
                            </SelectItem>
                          ))}
                          {filteredProblems.length > 50 && (
                            <div className="text-xs text-cyan-400 px-2 py-1">
                              Showing first 50 results. Please refine your search if you don't see desired problem.
                            </div>
                          )}
                        </>
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
                    <SelectTrigger className="bg-cyan-900/60 border-cyan-400/40 text-cyan-200 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition">
                      <SelectValue placeholder="Select difficulty" className="text-cyan-200" />
                    </SelectTrigger>
                    <SelectContent className="bg-cyan-950 border-cyan-400/40 text-cyan-100">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <SelectItem
                          key={num}
                          value={num.toString()}
                          className="hover:bg-cyan-800/60 text-cyan-100 focus:bg-emerald-700/60"
                        >
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
