import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

export async function test() {
    console.log("aqui toy con mis croquetitas")
  const user = await createUserWithEmailAndPassword(auth, "prueba@demo.com", "123456");
  console.log("UID:", user.user.uid);

  await setDoc(doc(db, "users", user.user.uid), { 
    premium: false, 
    createdAt: Date.now() 
});
  console.log("Usuario guardado en Firestore");
}


