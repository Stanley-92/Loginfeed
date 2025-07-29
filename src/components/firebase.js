// firebase.js
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, onSnapshot, serverTimestamp, query, orderBy } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
}





const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export { db, collection, addDoc, onSnapshot, serverTimestamp, query, orderBy }
  import { onMounted } from 'vue'
import {
  db, collection, addDoc, onSnapshot, serverTimestamp, query, orderBy
} from './firebase'

const messages = ref([])

onMounted(() => {
  const q = query(collection(db, 'messages'), orderBy('timestamp'))
  onSnapshot(q, (snapshot) => {
    messages.value = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      time: new Date(doc.data().timestamp?.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }))
  })
})

const sendMessage = async () => {
  if (newMessage.value.trim()) {
    await addDoc(collection(db, 'messages'), {
      from: 'me',
      text: newMessage.value,
      timestamp: serverTimestamp()
    })
    newMessage.value = ''
  }
}
