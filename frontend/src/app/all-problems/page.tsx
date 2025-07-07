"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Code2, Search, Filter, ArrowLeft, Calendar, Tag } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function AllProblemsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const allProblems = [
    {
      id: 1,
      title: "Two Sum",
      slug: "two-sum",
      difficulty: "Easy",
      tags: ["Array", "Hash Table"],
      lastResult: "pass",
      nextReview: "Today",
      attempts: 3,
      successRate: 100,
    },
    {
      id: 2,
      title: "Add Two Numbers",
      slug: "add-two-numbers",
      difficulty: "Medium",
      tags: ["Linked List", "Math", "Recursion"],
      lastResult: "pass",
      nextReview: "Tomorrow",
      attempts: 2,
      successRate: 100,
    },
    {
      id: 3,
      title: "Longest Substring Without Repeating Characters",
      slug: "longest-substring-without-repeating-characters",
      difficulty: "Medium",
      tags: ["Hash Table", "String", "Sliding Window"],
      lastResult: "fail",
      nextReview: "Today",
      attempts: 4,
      successRate: 75,
    },
    {
      id: 4,
      title: "Median of Two Sorted Arrays",
      slug: "median-of-two-sorted-arrays",
      difficulty: "Hard",
      tags: ["Array", "Binary Search", "Divide and Conquer"],
      lastResult: "pass",
      nextReview: "Today",
      attempts: 5,
      successRate: 60,
    },
    {
      id: 5,
      title: "Longest Palindromic Substring",
      slug: "longest-palindromic-substring",
      difficulty: "Medium",
      tags: ["String", "Dynamic Programming"],
      lastResult: "pass",
      nextReview: "In 2 days",
      attempts: 3,
      successRate: 67,
    },
    {
      id: 6,
      title: "ZigZag Conversion",
      slug: "zigzag-conversion",
      difficulty: "Medium",
      tags: ["String"],
      lastResult: "pass",
      nextReview: "In 3 days",
      attempts: 2,
      successRate: 100,
    },
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      case "Medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "Hard":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 80) return "text-emerald-400"
    if (rate >= 60) return "text-yellow-400"
    return "text-red-400"
  }

  const filteredProblems = allProblems.filter(
    (problem) =>
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">All Problems</h1>
                  <p className="text-sm text-gray-400">{allProblems.length} problems tracked</p>
                </div>
              </div>
            </div>
            <Link href="/log-problem">
              <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold px-4 py-2 rounded-lg shadow-lg">
                Log New Problem
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Search and Filter */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search problems or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-emerald-500/50"
                />
              </div>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Problems List */}
        <div className="space-y-4">
          {filteredProblems.map((problem) => (
            <Card
              key={problem.id}
              className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer group"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
                        {problem.title}
                      </h3>
                      <Badge className={`${getDifficultyColor(problem.difficulty)} border`}>{problem.difficulty}</Badge>
                      <div className="flex items-center">
                        {problem.lastResult === "pass" ? (
                          <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        ) : (
                          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✗</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {problem.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs border-gray-600 text-gray-300">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center space-x-6 text-sm">
                      <div className="flex items-center text-gray-400">
                        <Calendar className="w-4 h-4 mr-1" />
                        Next: {problem.nextReview}
                      </div>
                      <div className="text-gray-400">Attempts: {problem.attempts}</div>
                      <div className={`font-medium ${getSuccessRateColor(problem.successRate)}`}>
                        Success: {problem.successRate}%
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                    >
                      Review
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProblems.length === 0 && (
          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-400 text-lg mb-2">No problems found</p>
              <p className="text-gray-500 text-sm">Try adjusting your search terms</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
