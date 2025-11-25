// config/firebaseConfig.js

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// Importa la función de autenticación
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBit_Rt9b2NmHkeIJyxC-6F-abfaKIDDK4",
  authDomain: "citasintegrador10mo.firebaseapp.com",
  projectId: "citasintegrador10mo",
  storageBucket: "citasintegrador10mo.firebasestorage.app",
  messagingSenderId: "193088511866",
  appId: "1:193088511866:web:e9afad3d99dc32110380c3"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa y exporta los servicios
export const db = getFirestore(app);
export const auth = getAuth(app); // <-- NUEVA LÍNEA

export default app;