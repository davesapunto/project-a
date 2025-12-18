"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Skeleton } from '@/components/ui/skeleton'
import { useAuthState } from 'react-firebase-hooks/auth'
import {getAuth} from 'firebase/auth';
import Header from '../../components/_header'
import { getDocs, addDoc, collection, getFirestore} from 'firebase/firestore'; 
import Link from "next/link";

export default function MoviePage() {
  const { id } = useParams(); // get movie id from route
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const [user, loadingUser] = useAuthState(auth);
  const db = getFirestore();
  const [review, setReview] = useState("");
  const [documents, setDocuments] = useState<any[]>([])

  useEffect(() => {
    if (!id) return;

    {/*   ----- LOAD MOVIE FROM ID ----- */ }
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


  {/*     ----- LOAD USER REVIEW FROM MOVIE -----     */}
  useEffect(() => {
    if(!movie || !movie.title ) return;
    async function fetchDocs() {
      try {
        const querySnapshot = await getDocs(
          collection(db, 'movie', movie?.title, 'movie_reviews')
        );

        const docsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDocuments(docsArray);
        console.log(documents)
      } catch (err) {
        console.error('Error fetching Docs', err);
      }
    }

    fetchDocs();
  }, [movie?.title, db]);


  const handleSubmitReview = async () => {
    if (!review.trim()) return;
    try {

      {/* ----- MOVIE REVIEW ----- */}
      await addDoc(collection(db, "movie", movie.title, "movie_reviews"), {
        user_id: user?.uid,
        review: review,
      })

      {/* ----- USER REVIEW ----- */}
      await addDoc(collection(db, "user", "user_review", movie.title,), {
        user_id: user?.uid,
        review: review,
      })

      setReview("");
      console.log("Review saved");

      const querySnapshot = await getDocs(
        collection(db, 'movie', movie.title, 'movie_reviews')
      );
      const docsArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDocuments(docsArray);

    } catch (err) {
      console.error("Error saving review:", err);
    }
  };



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
      <div className="mt-40 min-w-screen h-auto flex justify-center items-center flex-col">
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSubmitReview();
                  }
                }}
                >
                </input>
              </div>
              <div className= "h-auto flex flex-col gap-4">
                {documents.length > 0 ? (
                  documents.map((doc) => (
                    <div key={doc.id} className="flex items-center border h-[10vh] border-zinc-600 rounded-xl bg-zinc-900">
                      {user ? <UserIconSVG/> : 'No Icon'}
                      <div key={doc.id} className="ml-12 w-80%">
                        <p>{doc.review}</p>
                      </div>
                    </div>
                  ))
                ) : (
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
                )}
              </div>
        </div>
      </div>
    </div>
  );
}



const UserIconSVG = () => {
  return(
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8 ml-8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  )
}