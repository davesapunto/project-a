import getApp from "./_firebase";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"

{/* Sign in with Popup*/}
export default async function _googleLogin(){
    const app = getApp();
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
}


