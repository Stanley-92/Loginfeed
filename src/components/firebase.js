// src/firebase.js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { db } from '@/firebase'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAJGSqJ4rQu39U5UkO1Qv0GgwWYEk1niiE",
  authDomain: "createaccount-ifeed1.firebaseapp.com",
  projectId: "createaccount-ifeed1",
  storageBucket: "createaccount-ifeed1.appspot.com", // ✅ Corrected
  messagingSenderId: "362037626035",
  appId: "1:362037626035:web:602285d7ece472d3a1dcc6",
  measurementId: "G-SKYBLBFBQX"

}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

const userCredential = await createUserWithEmailAndPassword(
  auth,
  form.contact,
  form.password
)

const user = userCredential.user

//  Save user profile to Firestore
await setDoc(doc(db, 'users', user.uid), {
  uid: user.uid,
  firstName: form.firstName,
  lastName: form.lastName,
  fullName: `${form.firstName} ${form.lastName}`,
  email: form.contact,
  gender: form.gender,
  dob: `${form.dobYear}-${form.dobMonth}-${form.dobDay}`,
  createdAt: serverTimestamp(),
  photoURL: '',// future profile image
  bio: '',
})
