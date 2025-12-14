"use client"
import { useState, useEffect } from "react";
import _googleLogin from "../components/_login"
import {useAuthState} from "react-firebase-hooks/auth"
import {getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import getApp from '../components/_firebase'
import {
  Alert, AlertTitle, AlertDescription
} from '@/components/ui/alert'
import {
  AlertCircleIcon
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const auth = getAuth();
  const app = getApp();
  const router = useRouter();
  const [user, loading] = useAuthState(auth);

  const GoogleSVG = () => {
    return(
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-google" viewBox="0 0 16 16">
      <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7
       7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893
        2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z"/>
      </svg>
    )
  }

  const login = () => {
    return signInWithEmailAndPassword(auth, email, password)
  }
  
   const signUp =() => {
    return createUserWithEmailAndPassword(auth, email, password)
   }
  
  useEffect(() => {
    if(user){
      router.push('/');
    }
  },[user])

  {/* FRONT PAGE */}
  return (
    <div className="flex min-h-screen min-w-screen items-center justify-center font-mono bg-zinc-900">
      <div className="absolute self-center z-0 xl:w-[30%] xl:h-[60%] bg-slate-500/10 rounded-full blur-3xl "></div>
        {error && (
          <Alert className="absolute z-2 h-[60vh] 2xs:w-[70vw] sm:w-[65vw]  lg:w-[50vw] 2xl:w-[25vw] 2xs:text-sm md:text-md lg:text-lg rounded-lg backdrop-blur-sm border-rose-500 text-rose-200">
            <AlertCircleIcon color="oklch(64.5% 0.246 16.439)"/>
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
            <AlertDescription>Please try again.</AlertDescription>
            <button onClick={() => setError("")}className="ml-7 w-[800%] h-[30%] border hover:bg-neutral-700 active:bg-neutral-900">OK</button>
          </Alert>
        )}
      <main className="z-1 border border-neutral-500  h-[60vh] 2xs:w-[70vw] sm:w-[65vw] lg:w-[50vw] 2xl:w-[25vw] 2xs:text-sm md:text-md lg:text-lg rounded-lg grid grid-rows-[1fr_4fr_1fr_1fr_1fr] justify-items-center bg-neutral-900 ">
        {/* Login Button & Signup Button */}
        
        <div className="h-[80%] w-[80%] flex justify-center items-center gap-2 mt-[4vh] ">
          <button 
          className={`border border-1 border-gray-300 rounded-sm h-[90%] w-[47.5%] ${isLogin ? 'shadow-md bg-neutral-950 shadow-neutral-400 ' : 'text-white'}`}
          onClick = {() => {setIsLogin(true)}}
          >Login
          </button>
          <button 
          onClick = {() => {setIsLogin(false)}}
          className={`border border-1 border-gray-300 rounded-sm h-[90%] w-[47.5%] ${!isLogin ? 'shadow-md bg-neutral-950 shadow-neutral-400' : 'text-white'}`}
          > Signup
          </button>
        </div>
        {/* Login Input Form */}
        <div className="h-[75%] w-[80%] grid grid-rows-4 items-center self-center">
          <span className="self-end">Email: </span>
          <input 
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border h-[70%] w-[100%] rounded-sm  "></input>
          <span className="self-end">Password: </span>
          <input 
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border h-[70%] w-[100%] rounded-sm "></input>
        </div>
        {/* Login Function Button */}
          <button 
          className="border rounded-sm h-[50%] w-[80%] flex justify-center items-center self-center hover:bg-neutral-800 active:bg-neutral-950 active:bg-neutral-950 hover:shadow-md hover:shadow-slate-400"
          onClick={async () => {
            
            try{
              await (isLogin ? login() : signUp())
            }catch(error){
              setError((error as Error).message);
            }
          }}>{isLogin ? 'Login' : 'Create Account'}</button>
        {/* Divider */}
        <div className="h-[40%] w-[80%] flex justify-center items-center self-center">
          <div className="border border-t-1 w-[40%]" />
          <span className="sm:h-[60%] xl:h-[100%] 2xs:mx-2 lg:mx-4 text-center">or</span>
          <div className="border border-t-1 w-[40%]" />
        </div>
        {/* Google button */}
        <div className="h-[60%] w-[80%] flex justify-center items-center">
          <button 
            onClick={async () => {
              setIsGoogleLoading(true);
              try {
                await _googleLogin();
              } catch(err) {
                setError((err as Error).message);
              } finally {
                setIsGoogleLoading(false);
              }
            }}
            disabled={isGoogleLoading}
            className={`border h-[100%] w-[60%] flex justify-center items-center gap-2 rounded-sm ${
              isGoogleLoading 
                ? 'opacity-50 cursor-not-allowed bg-neutral-800' 
                : 'hover:bg-neutral-800 active:bg-neutral-950 hover:shadow-md hover:shadow-slate-400'
            }`}
          >
            <GoogleSVG/> {isGoogleLoading ? 'Google...' : 'Google'}
          </button>
        </div>
      </main>
    </div>
  );
}
