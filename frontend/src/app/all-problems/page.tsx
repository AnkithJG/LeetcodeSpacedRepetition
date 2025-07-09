"use client"

import { useEffect, useState, useRef } from "react"
import { getIdToken } from "firebase/auth"
import { auth } from "@/lib/firebase_init"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Code2, Search, Filter, ArrowLeft, Calendar, Tag, ArrowRight, X } from "lucide-react"
import Link from "next/link"

export default function AllProblemsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterOpen, setFilterOpen] = useState(false)
  const [sortBy, setSortBy] = useState<"due_date" | "alphabetical">("due_date")
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [problems, setProblems] = useState<any[]>([])

  // Ref for detecting clicks outside the filter panel
  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchProblems = async () => {
      const user = auth.currentUser
      if (!user) return
      const token = await getIdToken(user)
      try {
        const res = await fetch("https://repeetcodebackend.onrender.com/all_problems", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!res.ok) throw new Error("Failed to fetch problems")
        const data = await res.json()

        setProblems(data.all_problems || [])
      } catch (error) {
        console.error("Error fetching problems:", error)
        setProblems([])
      }
    }

    fetchProblems()
  }, [])

  // Close filter panel if clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setFilterOpen(false)
      }
    }
    if (filterOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [filterOpen])

  // Filter by search term
  const filteredProblems = problems.filter((problem) => {
    const term = searchTerm.toLowerCase()
    return (
      problem.title.toLowerCase().includes(term) ||
      (problem.tags || []).some((tag: string) => tag.toLowerCase().includes(term))
    )
  })

  // Sort filtered problems by chosen method
  const sortedProblems = filteredProblems.slice().sort((a, b) => {
    if (sortBy === "due_date") {
      const dateA = new Date(a.next_review_date).getTime()
      const dateB = new Date(b.next_review_date).getTime()
      return dateA - dateB
    } else {
      return a.title.localeCompare(b.title)
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
            <div className="flex items-center space-x-4 w-full sm:w-auto">
              <Link href="/dashboard" className="flex-shrink-0">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-xl font-bold text-white truncate">All Problems</h1>
                  <p className="text-sm text-gray-400 truncate">{problems.length} problems tracked</p>
                </div>
              </div>
            </div>
            <Link href="/log-problem" className="flex-shrink-0 w-full sm:w-auto">
              <Button
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold px-3 sm:px-4 py-2 rounded-lg shadow-lg w-full sm:w-auto text-sm sm:text-base"
              >
                Log New Problem
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Search and Filter */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 mb-8 relative">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search problems or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-emerald-500/50"
                />
              </div>
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 bg-transparent flex items-center justify-center"
                onClick={() => setFilterOpen(!filterOpen)}
                aria-expanded={filterOpen}
                aria-controls="filter-panel"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>

            {/* Filter Panel */}
            {filterOpen && (
              <div
                id="filter-panel"
                ref={filterRef}
                className="
                  mt-4 p-4 bg-black/80 rounded-lg border border-white/20 max-w-xs text-white shadow-lg z-50
                  absolute sm:relative sm:mt-6 right-0 left-auto sm:max-w-none sm:w-auto
                  w-full
                "
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Sort By</h3>
                  <button
                    onClick={() => setFilterOpen(false)}
                    aria-label="Close filter panel"
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <fieldset>
                  <label className="flex items-center space-x-2 mb-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sort"
                      value="due_date"
                      checked={sortBy === "due_date"}
                      onChange={() => setSortBy("due_date")}
                      className="cursor-pointer"
                    />
                    <span>Due Date (default)</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sort"
                      value="alphabetical"
                      checked={sortBy === "alphabetical"}
                      onChange={() => setSortBy("alphabetical")}
                      className="cursor-pointer"
                    />
                    <span>Alphabetical</span>
                  </label>
                </fieldset>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Problems List */}
        <div className="space-y-4">
          {sortedProblems.map((problem) => (
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
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-3 overflow-hidden">
                        <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors truncate">
                          {problem.title}
                        </h3>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3 max-w-full">
                        {(problem.tags || []).map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs border-gray-600 text-gray-300 truncate max-w-max">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center space-x-6 text-sm text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Next: {new Date(problem.next_review_date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Arrow icon aligned right */}
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-400 transition-colors ml-4 flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>

        {sortedProblems.length === 0 && (
          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-400 text-lg mb-2">No problems found</p>
              <p className="text-gray-500 text-sm">Try adjusting your search terms or filters</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
