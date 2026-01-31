import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAZ4NSefUiVgcje8Rj77LSUGhdgJ2OcsXE",
    authDomain: "solana-verse.firebaseapp.com",
    projectId: "solana-verse",
    storageBucket: "solana-verse.firebasestorage.app",
    messagingSenderId: "374205835098",
    appId: "1:374205835098:web:7bc7060142b079c9dc7563"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize services
export const db = getFirestore(app)
export const storage = getStorage(app)
export default app
