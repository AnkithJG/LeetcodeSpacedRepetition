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
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CheckCircle, ArrowLeft, Plus, Code2, Info } from "lucide-react"
import Link from "next/link"

interface Problem {
  slug: string
  title: string
  tags: string[]
  official_difficulty: string
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

  // Popover open state for hover + click behavior on info icon
  const [popoverOpen, setPopoverOpen] = useState(false)

  useEffect(() => {
    async function fetchProblems() {
      const user = auth.currentUser
      if (!user) {
        alert("Please sign in first.")
        return
      }

      try {
        const token = await user.getIdToken(true)
        const res = await fetch("https://repeetcode-backend-production.up.railway.app/problem_bank", {
          headers: { Authorization: `Bearer ${token}` },
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

      const response = await fetch("https://repeetcode-backend-production.up.railway.app/log", {
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

  const filteredProblems = problemBank.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
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
                    <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 transition-none duration-0">
                      Go to Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 bg-transparent transition-none duration-0"
                    onClick={() => setIsSuccess(false)}
                  >
                    Log Another
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Row: Problem + Difficulty */}
                <div className="flex flex-col md:flex-row md:space-x-8 space-y-6 md:space-y-0">
                  {/* Problem Selector */}
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="problemSelect" className="text-white font-semibold text-md">
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
                      <SelectTrigger className="h-14 text-base px-4 bg-cyan-900/60 border-cyan-400/40 text-cyan-200 transition-none duration-0">
                        <SelectValue placeholder="Search or select problem" />
                      </SelectTrigger>
                      <SelectContent className="bg-cyan-950 border-cyan-400/40 max-h-80 overflow-auto text-cyan-100 transition-none duration-0">
                        <div className="sticky top-0 z-10 bg-cyan-950 px-2 py-2">
                          <Input
                            autoFocus
                            placeholder="Type to search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-cyan-900/60 border-cyan-400/40 text-cyan-200 placeholder-cyan-400 transition-none duration-0"
                          />
                        </div>
                        {filteredProblems.length === 0 ? (
                          <SelectItem value="loading" disabled className="text-cyan-400 transition-none duration-0">
                            No problems found...
                          </SelectItem>
                        ) : (
                          <>
                            {filteredProblems.slice(0, 50).map((problem) => (
                              <SelectItem
                                key={problem.slug}
                                value={problem.slug}
                                className="hover:bg-cyan-800/60 text-cyan-100 focus:bg-emerald-700/60 transition-none duration-0"
                              >
                                {problem.title}{" "}
                                <span className="text-cyan-400">({problem.official_difficulty})</span>
                              </SelectItem>
                            ))}
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Personal Difficulty */}
                  <div className="w-full md:w-64 space-y-2 relative">
                    <div className="flex items-center space-x-2 -mt-3 -ml-4">
                      <Label className="text-white font-semibold text-md">Personal Difficulty (1-5) *</Label>

                      <Popover
                        open={popoverOpen}
                        onOpenChange={setPopoverOpen}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-cyan-300 hover:text-white cursor-pointer transition-none duration-0"
                            onMouseEnter={() => setPopoverOpen(true)}
                            onMouseLeave={() => setPopoverOpen(false)}
                            onClick={(e) => {
                              e.stopPropagation()
                              setPopoverOpen((open) => !open)
                            }}
                          >
                            <Info className="w-4 h-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          onMouseEnter={() => setPopoverOpen(true)}
                          onMouseLeave={() => setPopoverOpen(false)}
                          className="bg-cyan-950 text-cyan-100 text-sm max-w-xs border border-cyan-400/30 transition-none duration-0"
                        >
                          Rate how difficult this problem felt <strong>after solving it</strong>.
                          <br />
                          <strong>1 = Easiest</strong>, <strong>5 = Hardest</strong>.
                          <br />
                          Harder problems will be shown to you more frequently.
                        </PopoverContent>
                      </Popover>
                    </div>
                    <Select
                      value={formData.personalDifficulty}
                      onValueChange={(value) => handleInputChange("personalDifficulty", value)}
                    >
                      <SelectTrigger className="h-14 text-base px-4 bg-cyan-900/60 border-cyan-400/40 text-cyan-200 transition-none duration-0">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent className="bg-cyan-950 border-cyan-400/40 text-cyan-100 transition-none duration-0">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <SelectItem
                            key={num}
                            value={num.toString()}
                            className="hover:bg-cyan-800/60 text-cyan-100 focus:bg-emerald-700/60 transition-none duration-0"
                          >
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end space-x-4 pt-8">
                  <Link href="/dashboard">
                    <Button
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10 bg-transparent transition-none duration-0"
                    >
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    disabled={!formData.slug || !formData.personalDifficulty || isSubmitting}
                    className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold px-10 py-3 text-lg rounded-lg shadow-lg hover:shadow-xl transition-none duration-0 disabled:opacity-50 disabled:cursor-not-allowed"
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
