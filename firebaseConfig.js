// src/firebaseConfig.js (o donde prefieras)
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // Para Autenticación
import { getFirestore } from 'firebase/firestore'; // Para Cloud Firestore
import { getFunctions } from 'firebase/functions'; // Para Cloud Functions (si las usas)

// Tus credenciales de Firebase. Encuéntralas en Project settings > General > Your apps.
const firebaseConfig = {
  apiKey: "AIzaSyBwe350YXRJliDrRzIhF8WiMc5KMrDkg8c",
  authDomain: "yura-5971b.firebaseapp.com",
  projectId: "yura-5971b",
  storageBucket: "yura-5971b.appspot.com", // Asegúrate de incluirlo si lo usas
  messagingSenderId: "TU_SENDER_ID",
  appId: "1:956872186948:android:a87cd7dfe03fd9da7cf011"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta las instancias de los servicios que usarás
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
