"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Skeleton } from '@/components/ui/skeleton'
import Header from '../../components/_header'
import Link from "next/link";

export default function TvPage() {
  const { id } = useParams(); // get movie id from route
  const [tv, setTv] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function loadTv() {
      try {
        const res = await fetch(`/api/tmdb/tv/${id}`);
        const data = await res.json();
        setTv(data);
        
      } catch (err) {
        console.error("Error fetching movie:", err);
      } finally {
        setLoading(false);
      }
    }

    loadTv();
  }, [id]);

  useEffect(() => {
    console.log(tv?.genres);
    console.log(tv)
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

  if (!tv)
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
          src={`https:image.tmdb.org/t/p/w500${tv.poster_path}`}
          className="h-[90%] rounded-lg"
          />
          <div className="w-[30%] h-[90%] flex flex-col gap-4 "> 
            <h1 className="font-semibold text-[2.5rem]">{tv.title || tv.name}</h1>
            <div className="flex gap-2">
              {(tv.genres  as any[]).map((genre, index) => (
                <div key={index}>
                  {genre.name + ','}
                </div>
              ))}
            </div>
            <p className="text-lg">{tv.overview}</p> 
            <p>Rating: {tv.vote_average.toFixed(1)}/10</p>
            <p>Votes: {tv.vote_count}</p>
          </div>
        </div>
      </div>
      <div>
        
      </div>
    </div>
  );
}
