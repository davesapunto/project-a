import Link from 'next/link'
import {getAuth, signOut} from 'firebase/auth'
import {useAuthState} from 'react-firebase-hooks/auth'
import {useRouter} from 'next/navigation'
import { useState } from 'react'
import getApp  from './_firebase'

const Header = () => {
    const app = getApp()
    const auth = getAuth(app);
    const [user, loading] = useAuthState(auth);
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const logout = () => {
        signOut(auth);
        router.push("/");
    }
    if(loading){
    }
    return(
        <div className="shadow-xl shadow-zinc-800 backdrop-blur-sm bg-zinc-800/10 min-w-screen h-[8vh] 2xs:h-[10vh] xs:h-[10vh] md:h-[10%] xl:h-[7.5%] flex items-center font-mono fixed top-0 left-0 right-0 z-50 px-4">
            {/* Desktop Menu - Hidden on xs and below */}
            <div className="hidden md:flex md:w-[25%] md:justify-center md:items-center md:gap-6">
                <Link href="/" className="text-lg font-semibold">title</Link>
                <ul className="hidden lg:flex gap-6">
                    <li><Link href="/">Link</Link></li>
                    <li><Link href="/">Link</Link></li>
                    <li><Link href="/">Link</Link></li>
                </ul>
            </div>
            
            {/* Mobile Hamburger Button - Visible on xs and below */}
            <button 
                className="md:hidden flex flex-col gap-1 cursor-pointer"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
                <div className="w-6 h-0.5 bg-white"></div>
                <div className="w-6 h-0.5 bg-white"></div>
                <div className="w-6 h-0.5 bg-white"></div>
            </button>
            
            {/* Mobile Title - Visible on xs and below */}
            <span className="md:hidden text-lg font-semibold ml-4">title</span>
            
            {/* Search Bar - Hidden on xs and below */}
            <input
                className="hidden md:block border md:w-[50%] md:h-[60%] rounded-sm ml-auto mr-auto"
                placeholder="What do you want to review?"
            />
            
            {/* Desktop Auth Section */}
            <div className="hidden md:flex h-[100%] md:w-[25%] ml-auto">
                <div className="xl:w-[40%] flex items-center ml-auto mr-auto justify-center gap-8 ">
                    <div>
                        <Link href={!user ?  "/login" : "/profile"}>AVATAR</Link >
                    </div>
                    <div className="">
                        {!user ? <Link href="/login">SIGN IN</Link> : <button onClick={() => logout()}>LOGOUT</button>}
                    </div>
                </div>
            </div>
            
            {/* Mobile Auth Section */}
            <div className="md:hidden ml-auto flex gap-4">
                <div>
                    <Link href={!user ?  "/login" : "/profile"}>AVATAR</Link >
                </div>
                <div className="">
                    {!user ? <Link href="/login">SIGN IN</Link> : <button onClick={() => logout()}>LOGOUT</button>}
                </div>
            </div>
            
            {/* Mobile Dropdown Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-zinc-800 border border-zinc-400 p-4 flex flex-col gap-4 mt-2">
                    <ul className="flex flex-col gap-2">
                        <li><Link href="/" onClick={() => setIsMenuOpen(false)}>Link</Link></li>
                        <li><Link href="/" onClick={() => setIsMenuOpen(false)}>Link</Link></li>
                        <li><Link href="/" onClick={() => setIsMenuOpen(false)}>Link</Link></li>
                    </ul>
                    <input
                        className="border rounded-sm p-2 text-black w-full"
                        placeholder="What do you want to review?"
                    />
                </div>
            )}
        </div>
    )
}

export default Header;