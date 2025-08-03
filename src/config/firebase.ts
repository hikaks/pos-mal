import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFirebaseConfig, validateEnv } from './env';

// Konfigurasi Firebase menggunakan environment variables
const firebaseConfig = getFirebaseConfig();

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Validate environment variables (but don't throw error)
export const validateFirebaseConfig = () => {
  try {
    return validateEnv();
  } catch (error) {
    console.warn('⚠️ Environment validation failed:', error);
    return false;
  }
};

export default app; 