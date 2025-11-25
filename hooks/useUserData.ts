// hooks/useUserData.ts
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../config/firebaseConfig';

export interface UserData {
  nombre: string;
  email: string;
  rol: string;
}

export function useUserData(uid: string | null) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        console.log('Hook useUserData: Buscando documento con UID:', uid);
        const userDocRef = doc(db, 'usuarios', uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          console.log('Hook useUserData: Documento encontrado:', userDoc.data());
          setUserData(userDoc.data() as UserData);
        } else {
          console.log('Hook useUserData: Documento NO encontrado.');
          setError('No se encontraron los datos del usuario.');
        }
      } catch (err) {
        console.error('Hook useUserData: Error al cargar los datos:', err);
        setError('Error al cargar los datos del usuario.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [uid]);

  return { userData, loading, error };
}