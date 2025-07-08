"use client"

import { useEffect, useState } from "react"
import { getIdToken } from "firebase/auth"
import { auth } from "@/lib/firebase_init"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Code2, Search, Filter, ArrowLeft, Calendar, Tag, ArrowRight } from "lucide-react"
import Link from "next/link"


export default function AllProblemsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [problems, setProblems] = useState<any[]>([])

  useEffect(() => {
    const fetchProblems = async () => {
      const user = auth.currentUser
      if (!user) return
      const token = await getIdToken(user)
      try {
        const res = await fetch("http://localhost:8000/all_problems", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!res.ok) throw new Error("Failed to fetch problems")
        const data = await res.json()

        // Sort problems by next_review_date ascending (earliest first)
        const sortedProblems = (data.all_problems || []).slice().sort((a: { next_review_date: string | number | Date }, b: { next_review_date: string | number | Date }) => {
          const dateA = new Date(a.next_review_date).getTime()
          const dateB = new Date(b.next_review_date).getTime()
          return dateA - dateB
        })

        setProblems(sortedProblems)
      } catch (error) {
        console.error("Error fetching problems:", error)
        setProblems([])
      }
    }

    fetchProblems()
  }, [])

  const filteredProblems = problems.filter(
    (problem) =>
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (problem.tags || []).some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
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
                  <p className="text-sm text-gray-400">{problems.length} problems tracked</p>
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

        <div className="space-y-4">
        {filteredProblems.map((problem) => (
          <a
            key={problem.slug}
            href={`https://leetcode.com/problems/${problem.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Card
              className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer group"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
                        {problem.title}
                      </h3>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {(problem.tags || []).map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs border-gray-600 text-gray-300">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center space-x-6 text-sm">
                      <div className="flex items-center text-gray-400">
                        <Calendar className="w-4 h-4 mr-1" />
                        Next: {new Date(problem.next_review_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Arrow icon aligned right */}
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                </div>
              </CardContent>
            </Card>
          </a>
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
