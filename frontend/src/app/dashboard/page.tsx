"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code2, Brain, Calendar, Plus, ArrowRight, Clock, Target } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const todayProblems = [
    {
      id: 1,
      title: "Two Sum",
      difficulty: "Easy",
      tags: ["Array", "Hash Table"],
      lastResult: "pass",
      reviewDate: "Today",
    },
    {
      id: 2,
      title: "Longest Substring Without Repeating Characters",
      difficulty: "Medium",
      tags: ["Hash Table", "String", "Sliding Window"],
      lastResult: "fail",
      reviewDate: "Today",
    },
    {
      id: 3,
      title: "Median of Two Sorted Arrays",
      difficulty: "Hard",
      tags: ["Array", "Binary Search", "Divide and Conquer"],
      lastResult: "pass",
      reviewDate: "Today",
    },
  ]

  const upcomingProblems = [
    {
      id: 4,
      title: "Add Two Numbers",
      difficulty: "Medium",
      tags: ["Linked List", "Math", "Recursion"],
      reviewDate: "Tomorrow",
    },
    {
      id: 5,
      title: "Longest Palindromic Substring",
      difficulty: "Medium",
      tags: ["String", "Dynamic Programming"],
      reviewDate: "In 2 days",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">LeetCode SR</h1>
                <p className="text-sm text-gray-400">Spaced Repetition</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/log-problem">
                <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
                  <Plus className="w-4 h-4 mr-2" />
                  Log Problem
                </Button>
              </Link>
              <Link href="/all-problems">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                  View All
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border-emerald-500/20 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-400 text-sm font-medium">Due Today</p>
                  <p className="text-3xl font-bold text-white">{todayProblems.length}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-400 text-sm font-medium">Total Problems</p>
                  <p className="text-3xl font-bold text-white">47</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-blue-500/20 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-400 text-sm font-medium">Success Rate</p>
                  <p className="text-3xl font-bold text-white">73%</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Review */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white flex items-center">
              <Calendar className="w-6 h-6 mr-3 text-emerald-400" />
              Today's Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayProblems.length > 0 ? (
              <div className="space-y-4">
                {todayProblems.map((problem) => (
                  <div
                    key={problem.id}
                    className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
                            {problem.title}
                          </h3>
                          <Badge className={`${getDifficultyColor(problem.difficulty)} border`}>
                            {problem.difficulty}
                          </Badge>
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
                        <div className="flex flex-wrap gap-2">
                          {problem.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs border-gray-600 text-gray-300">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-400 text-lg mb-2">No problems due today!</p>
                <p className="text-gray-500 text-sm">Great job staying on top of your reviews</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Next Up */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white flex items-center">
              <Clock className="w-5 h-5 mr-3 text-blue-400" />
              Coming Up Next
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingProblems.slice(0, 2).map((problem) => (
                <div key={problem.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-white font-medium">{problem.title}</h4>
                        <Badge className={`${getDifficultyColor(problem.difficulty)} border text-xs`}>
                          {problem.difficulty}
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-sm">{problem.reviewDate}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
