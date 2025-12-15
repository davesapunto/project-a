'use client'
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import {getAuth, signOut} from 'firebase/auth';
import getApp from './components/_firebase';
import Header from './components/_header';
import{ Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton"



export default function Home(){
  const app = getApp();
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);
  const [popularMovies, setPopularMovies] = useState({
    page:0,
    results: [],
    total_pages: 0,
    total_results: 0,
  });
  const[popularTv, setPopularTv] = useState({
    page: 0,
    results: [],
    total_pages: 0,
    total_results: 0,
  });
  const [loadingElemetents, setLoadingElements] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/tmdb/popular_movies");
        const data = await res.json();
        setPopularMovies(data);
        console.log(data)
      } catch (err) {
        console.error(err);
      } finally{
        setLoadingElements(false);
      }
    }
    load();
  }, []);


  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/tmdb/popular_tv");
        const data = await res.json();
        setPopularTv(data);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);


  if(loading){
    return(
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    )
  }

  return(
    <div className="min-w-screen h-auto bg-zinc-900 font-mono ">

      <Header/>

      {/* POPULAR MOVIE */}
      <div className="h-[65vh] flex justify-center items-center">
        <div className="w-[85vw] xl:h-[50vh] self-end">
          <div className="font-semibold flex w-[97.5%] place-self-center text-2xl">
            Popular Movies
            <Link className= " font-semibold ml-auto underline underline-offset-4" href="/">
              See All
            </Link>
          </div>
          <Carousel
            className="w-full h-full "
            opts={{
              align: "start",
              slidesToScroll: 1,
              skipSnaps: true,
            }}
          >
            <CarouselContent>
              {(popularMovies.results as any[]).map((movie, index) => (
                <CarouselItem
                  key={index}
                  className="xl:basis-1/5 lg:basis-1/4 md:basis-1/3 xs:basis-1/2 2xs:basis-1/1" 
                >
                  <Card className="h-[45vh]">
                    <CardContent className="place-self-center 2xs:w-[75%] 2xs:w-[75%] xs:w-full h-[90%]">
                      <Link href={user ? `/movie/${movie.id}` : '/login'}>
                        <img 
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        className="w-full h-full object-cover rounded-xl"
                        />
                      </Link>
                      <p className="mt-2">{movie.title || movie.name}</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="2xs:ml-10 xs:ml-4 sm:ml-0"/>
            <CarouselNext className="2xs:mr-10 xs:mr-4 sm:mr-0"/>
          </Carousel>
        </div>
      </div>
    {/* END OF POPULAR MOVIE */}

    {/* POPULAR TV */}
      <div className="h-[60vh] flex justify-center items-center">
        <div className="w-[85vw] xl:h-[50vh]">
          <div className="font-semibold flex w-[97.5%] place-self-center text-2xl">
            Popular TV Shows
            <Link className= " font-semibold ml-auto underline underline-offset-4" href="/">
              See All
            </Link>
          </div>
          <Carousel
            className="w-full h-full"
            opts={{
              align: "start",
              slidesToScroll: 1,
              skipSnaps: true,
            }}
          >
            <CarouselContent>
              {(popularTv.results as any[]).map((tv, index) => (
                <CarouselItem
                  key={index}
                  className="xl:basis-1/5 lg:basis-1/4 md:basis-1/3 xs:basis-1/2 2xs:basis-1/1" 
                >
                  <Card className="h-[45vh] ">
                    <CardContent className="place-self-center 2xs:w-[75%] 2xs:w-[75%] xs:w-full h-[90%]">
                      <Link href={user ? `/tv/${tv.id}` : '/login'}>
                        <img 
                        src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
                        className="w-full h-full object-cover rounded-xl"
                        />
                      </Link>
                      <p className="mt-2">{tv.title || tv.name}</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="2xs:ml-10 xs:ml-4 sm:ml-0"/>
            <CarouselNext className="2xs:mr-10 xs:mr-4 sm:mr-0"/>
          </Carousel>
        </div>
      </div>
      {/* END OF POPULAR TV*/}
    </div>
  )
} 