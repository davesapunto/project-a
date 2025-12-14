"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Skeleton } from '@/components/ui/skeleton'
import Header from '../../components/_header'
import Link from "next/link";

export default function MoviePage() {
  const { id } = useParams(); // get movie id from route
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function loadMovie() {
      try {
        const res = await fetch(`/api/tmdb/movie/${id}`);
        const data = await res.json();
        setMovie(data);
        
      } catch (err) {
        console.error("Error fetching movie:", err);
      } finally {
        setLoading(false);
      }
    }

    loadMovie();
  }, [id]);

  useEffect(() => {
    console.log(movie?.genres);
    console.log(movie)
  })

  if (loading)
    return (
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );

  if (!movie)
    return (
      <div className="w-full h-screen text-white bg-zinc-900 flex items-center justify-center">
        Failed to load movie.
      </div>
    );

  return (
    <div className="min-screen h-auto font-mono">
      <Header/>
      <div className="mt-19 min-w-screen h-[92.25vh]  flex justify-center">
        <div className="w-full h-[70%] flex sm:flex-row 2xs:flex-col items-center justify-center gap-4">
          <img
          src={`https:image.tmdb.org/t/p/w500${movie.poster_path}`}
          className="h-[90%] rounded-lg"
          />
          <div className="w-[30%] h-[90%] flex flex-col gap-4 "> 
            <h1 className="font-semibold text-[2.5rem]">{movie.title || movie.name}</h1>
            <div className="flex gap-2">
              {(movie.genres  as any[]).map((genre, index) => (
                <div key={index}>
                  {genre.name + ','}
                </div>
              ))}
            </div>
            <p className="text-lg">{movie.overview}</p> 
            <p>Rating: {movie.vote_average.toFixed(1)}/10</p>
            <p>Votes: {movie.vote_count}</p>
          </div>
        </div>
      </div>
      <div>

      </div>
    </div>
  );
}
