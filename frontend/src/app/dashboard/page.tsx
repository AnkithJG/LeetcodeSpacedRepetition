"use client"

import { useEffect, useState } from "react"
import { getIdToken } from "firebase/auth"
import { auth } from "@/lib/firebase_init"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Calendar, Plus, ArrowRight, Clock, Target, Repeat } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [todayProblems, setTodayProblems] = useState<any[]>([])
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [nextUp, setNextUp] = useState<any | null>(null)
  const [totalProblems, setTotalProblems] = useState(0)
  const [streak, setStreak] = useState<number>(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser
        if (!user) return
        const token = await getIdToken(user, /* forceRefresh */ true)

        // Fetch today's reviews and next up
        const res1 = await fetch("https://repeetcode-backend-production.up.railway.app/reviews", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res1.ok) throw new Error("Failed to fetch /reviews")

        const reviewData = await res1.json()
        setTodayProblems(reviewData.reviews_due || [])
        setNextUp(reviewData.next_up || null)

        // Fetch all problems
        const res2 = await fetch("https://repeetcode-backend-production.up.railway.app/all_problems", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res2.ok) throw new Error("Failed to fetch /all_problems")

        const allData = await res2.json()
        setTotalProblems(allData.all_problems?.length || 0)

        // Fetch streak
        const res3 = await fetch("https://repeetcode-backend-production.up.railway.app/dashboard_stats", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res3.ok) throw new Error("Failed to fetch /dashboard_stats")

        const statsData = await res3.json()
        setStreak(statsData.current_streak || 0)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setTodayProblems([])
        setNextUp(null)
        setTotalProblems(0)
        setStreak(0)
      }
    }

    fetchData()

    // Re-fetch when page/tab becomes visible
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchData()
      }
    }
    document.addEventListener("visibilitychange", handleVisibility)
    return () => document.removeEventListener("visibilitychange", handleVisibility)
  }, [])

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatDate = (dateField: any) => {
    if (!dateField) return "No date"
    if (dateField._seconds) {
      return new Date(dateField._seconds * 1000).toLocaleDateString()
    }
    return new Date(dateField).toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center">
                <Repeat className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">RepeetCode</h1>
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
                <Button
                  variant="outline"
                  className="border-cyan-500/50 text-white hover:bg-cyan-600 hover:text-white bg-transparent transition-all duration-200"
                >
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
                  <p className="text-3xl font-bold text-white">{totalProblems}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border-cyan-500/20 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-400 text-sm font-medium">Current Streak</p>
                  <p className="text-3xl font-bold text-white">{streak}</p>
                </div>
                <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-cyan-400" />
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
              Today&apos;s Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayProblems.length > 0 ? (
              <div className="space-y-4">
                {todayProblems.map((problem, idx) => (
                  <a
                    key={idx}
                    href={`https://leetcode.com/problems/${problem.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
                            {problem.title}
                          </h3>
                          <div className="flex items-center">
                            {problem.last_result === "pass" ? (
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
                          {problem.tags?.map((tag: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-xs border-gray-600 text-gray-300">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                    </div>
                  </a>
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
            {nextUp ? (
              <a
                href={`https://leetcode.com/problems/${nextUp.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white/5 rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-white font-medium">{nextUp.title}</h4>
                    </div>
                    <p className="text-gray-400 text-sm">{formatDate(nextUp.next_review_date)}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 hover:text-blue-400 transition-colors" />
                </div>
              </a>
            ) : (
              <p className="text-gray-500 text-sm">No upcoming problems!</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
