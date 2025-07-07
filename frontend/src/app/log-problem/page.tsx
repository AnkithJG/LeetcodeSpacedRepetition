"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Code2, ArrowLeft, Plus, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

export default function LogProblemPage() {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    difficulty: "",
    result: "",
    tags: "",
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)

      // Reset form after success
      setTimeout(() => {
        setIsSuccess(false)
        setFormData({
          title: "",
          slug: "",
          difficulty: "",
          result: "",
          tags: "",
          notes: "",
        })
      }, 2000)
    }, 1500)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Problem Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-white font-medium">
                      Problem Title *
                    </Label>
                    <Input
                      id="title"
                      placeholder="e.g., Two Sum"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-emerald-500/50"
                      required
                    />
                  </div>

                  {/* Problem Slug */}
                  <div className="space-y-2">
                    <Label htmlFor="slug" className="text-white font-medium">
                      Problem Slug *
                    </Label>
                    <Input
                      id="slug"
                      placeholder="e.g., two-sum"
                      value={formData.slug}
                      onChange={(e) => handleInputChange("slug", e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-emerald-500/50"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Difficulty */}
                  <div className="space-y-2">
                    <Label className="text-white font-medium">Difficulty *</Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value) => handleInputChange("difficulty", value)}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-white/20">
                        <SelectItem value="Easy" className="text-emerald-400">
                          Easy
                        </SelectItem>
                        <SelectItem value="Medium" className="text-yellow-400">
                          Medium
                        </SelectItem>
                        <SelectItem value="Hard" className="text-red-400">
                          Hard
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Result */}
                  <div className="space-y-3">
                    <Label className="text-white font-medium">Result *</Label>
                    <RadioGroup
                      value={formData.result}
                      onValueChange={(value) => handleInputChange("result", value)}
                      className="flex space-x-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pass" id="pass" className="border-emerald-500 text-emerald-500" />
                        <Label htmlFor="pass" className="text-emerald-400 flex items-center cursor-pointer">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Passed
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fail" id="fail" className="border-red-500 text-red-500" />
                        <Label htmlFor="fail" className="text-red-400 flex items-center cursor-pointer">
                          <XCircle className="w-4 h-4 mr-1" />
                          Failed
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label htmlFor="tags" className="text-white font-medium">
                    Tags
                  </Label>
                  <Input
                    id="tags"
                    placeholder="e.g., Array, Hash Table, Two Pointers (comma separated)"
                    value={formData.tags}
                    onChange={(e) => handleInputChange("tags", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-emerald-500/50"
                  />
                  <p className="text-gray-400 text-sm">Separate multiple tags with commas</p>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-white font-medium">
                    Notes (Optional)
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any notes about your approach, what you learned, or areas to focus on..."
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-emerald-500/50 min-h-[100px]"
                  />
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
                    disabled={
                      isSubmitting || !formData.title || !formData.slug || !formData.difficulty || !formData.result
                    }
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
