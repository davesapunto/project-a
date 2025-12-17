"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Skeleton } from '@/components/ui/skeleton'
import { useAuthState } from 'react-firebase-hooks/auth'
import {getAuth} from 'firebase/auth';
import Header from '../../components/_header'
import { doc, setDoc, getFirestore} from 'firebase/firestore'; 
import Link from "next/link";

export default function MoviePage() {
  const { id } = useParams(); // get movie id from route
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const [user, loadingUser] = useAuthState(auth);
  const db = getFirestore();
  const [review, setReview] = useState('');

  useEffect(() => {
    if (!id) return;

    {/*   ----- LOAD MOVIE FROM ID ----- */ }
    async function loadMovie() {
      try {
        const res = await fetch(`/api/tmdb/movie/${id}`);
        const data = await res.json();
        setMovie(data);
        console.log(data);
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
      <div className="mt-19 min-w-screen h-[92.25vh] flex justify-center items-center flex-col">
        <div className="w-full h-[70%] flex sm:flex-row 2xs:flex-col items-center justify-center gap-6">
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
        <div className="w-[50%] h-auto">
              <div className="w-full h-[10vh] flex items-center justify-center gap-8">
                {user ? <UserIconSVG/> : 'No Icon'}
                <input type='text' 
                className="border h-[50%] w-[100%]"
                placeholder='Write your review here'
                value={review}
                onChange={(e) => setReview(e.target.value)}
                onKeyDown={(e) => EventChange}>
                </input>
              </div>
              <div>

              </div>
        </div>
      </div>
    </div>
  );
}



const UserIconSVG = () => {
  return(
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  )
}