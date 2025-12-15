'use client'

import Header from '../components/_header'
import { useState, useEffect, useRef } from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { useAuthState } from 'react-firebase-hooks/auth'
import {getAuth} from 'firebase/auth'

export default function Explore() {
  const [movies, setMovies] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const auth = getAuth();
  const [user, load] = useAuthState(auth)

  const observerRef = useRef<HTMLDivElement | null>(null)


    useEffect(() => {
    async function loadMovies() {
        setLoading(true)

        try {
        const res = await fetch(`/api/tmdb/popular_movies?page=${page}`)
        const data = await res.json()

        setMovies(prev => {
            const map = new Map()
            prev.forEach(m => map.set(m.id, m))
            data.results.forEach(m => map.set(m.id, m))
            return Array.from(map.values())
        })

        if (page >= data.total_pages) {
            setHasMore(false)
        }
        } catch (err) {
        console.error(err)
        } finally {
        setLoading(false)
        }
    }

    loadMovies()
    }, [page]) // ✅ ONLY page


  /* ---------------- INTERSECTION OBSERVER ---------------- */
  useEffect(() => {
    if (!observerRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading) {
          setPage(prev => prev + 1)
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(observerRef.current)

    return () => observer.disconnect()
  }, [hasMore, loading])

  /* ---------------- INITIAL LOADING ---------------- */
  if (movies.length === 0 && loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-w-screen h-auto flex justify-center font-mono">
      <Header />
        
        {}
      <div className="mt-28 sm:[100%] xl:w-[80%] h-[92vh]  flex flex-col">
        <div className="flex flex-col justify-center text-3xl font-semibold w-full h-[15%]">
          <h1>More Popular Movies</h1>
          <Link href="/" className="text-lg flex items-center gap-1 underline">
            <BackSVG /> Back
          </Link>
        </div>

        {/* SCROLLABLE CONTAINER */}
        <div className="w-full h-full ">
          <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 items-center justify-items-center gap-4 2xl:gap-0">
            {movies.map(movie => (
              <Card key={movie.id} className="w-56 h-[26rem] rounded-xl">
                <CardContent className="p-2">
                    <Link href={user ? `/movie/${movie.id}` : '/login'}>
                    <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="rounded"
                    />
                    </Link>
                  <p className="text-sm font-semibold mt-2">
                    {movie.title}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* LOADING INDICATOR */}
          {loading && (
            <div className="flex justify-center py-4">
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
          )}

          {/* OBSERVER TARGET */}
          <div ref={observerRef} className="h-10 w-full" />
        </div>
      </div>
    </div>
  )
}

/* ---------------- BACK ICON ---------------- */
const BackSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
    />
  </svg>
)
