'use client'
import { Card, CardContent } from '@/components/ui/card'
import { Award, Film, Edit3, Flame} from 'lucide-react'
import { getAuth } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import getApp from '../components/_firebase'
import Header from '../components/_header'

export default function Profile(){

    const app = getApp()
    const auth = getAuth(app);
    const [user, loading] = useAuthState(auth);

    return(
        <div className="bg-zinc-900 min-w-screen h-[92vh] font-mono">
            <Header/>
            <div className="mt-20 min-w-screen h-[30vh] flex items-center justify-center">
                <Card className="flex justify-center bg-transparent w-[50vw] h-[75%] border border-neutral-400">
                    <CardContent className="w-full h-full flex justify-center ">
                        <div className="h-full w-[50%]  flex items-center justify-center gap-10">
                            <div className="border w-[30%] h-[80%] rounded-full">
                                <img className="rounded-full h-full w-full bg-black" src={user?.train || 'secret'}/>
                            </div>
                            <div>
                                <p className="font-semibold text-2xl">{user?.displayName || 0}</p>
                                <p className="text-sm text-gray-400">{user?.trait || 'placeholder'}</p>
                            </div>
                        </div>
                        <div className="h-full w-[50%] flex items-center justify-center gap-4">
                            <StatCard icon={<Film size={20} />} value={user?.moviesWatched || 0} label="Watched" color="text-blue-400" />
                            <StatCard icon={<Edit3 size={20} />} value={user?.reviewsCount || 0} label="Reviews" color="text-green-400" />
                            <StatCard icon={<Flame size={20} />} value={user?.missionStreak || 0} label="Streak" color="text-orange-400" />
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="min-w-screen h-[62.5%] flex flex-col gap-6">
                {Array.from({length: 5}).map((_, index) => (
                    <div className="h-[15%] w-[50%] border  rounded-xl ml-auto mr-auto flex items-center justify-center" key={index}>
                        Placeholder
                    </div>
                ))}
            </div>
        </div>
    )
}

const StatCard = ({ icon, value, label, color }: { icon: React.ReactNode, value: number, label: string, color: string }) => (
  <div className="text-center p-3 rounded-xl border border-gray-400 w-[30%] h-[80%] grid grid-rows-3 items-center">
    <div className={`mb-1 flex justify-center ${color}`}>{icon}</div>
    <div className="font-bold text-xl text-white">{value}</div>
    <div className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</div>
  </div>
);
