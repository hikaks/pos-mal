// Environment Configuration
export const env = {
  // Firebase Configuration
  FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBOyPQ9CuhlFUQseO2lqYXqxFGB2u1kah0",
  FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "pos-4-90fb5.firebaseapp.com",
  FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID || "pos-4-90fb5",
  FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "pos-4-90fb5.firebasestorage.app",
  FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "599895364431",
  FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID || "1:599895364431:web:8f5dd5cb8a21234e3a2b3a",
  FIREBASE_MEASUREMENT_ID: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-5W4HK9F0RF",

  // Gemini AI Configuration
  GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyDViIarEP7dc6KghSb4diJQqzcmme1QaAQ",

  // App Configuration
  APP_NAME: import.meta.env.VITE_APP_NAME || "POS System",
  APP_VERSION: import.meta.env.VITE_APP_VERSION || "1.0.0",
  APP_DESCRIPTION: import.meta.env.VITE_APP_DESCRIPTION || "Modern Point of Sale System with AI Integration",

  // Development Configuration
  DEV_MODE: import.meta.env.VITE_DEV_MODE === 'true' || false,
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true' || false,
} as const;

// Type for environment variables
export type EnvConfig = typeof env;

// Helper function to validate environment variables
export const validateEnv = (): boolean => {
  const requiredVars = [
    'FIREBASE_API_KEY',
    'FIREBASE_AUTH_DOMAIN', 
    'FIREBASE_PROJECT_ID',
    'GEMINI_API_KEY'
  ];

  const missingVars = requiredVars.filter(varName => !env[varName as keyof typeof env]);

  if (missingVars.length > 0) {
    console.warn('⚠️ Missing environment variables:', missingVars);
    return false;
  }

  return true;
};

// Helper function to get Firebase config
export const getFirebaseConfig = () => ({
  apiKey: env.FIREBASE_API_KEY,
  authDomain: env.FIREBASE_AUTH_DOMAIN,
  projectId: env.FIREBASE_PROJECT_ID,
  storageBucket: env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
  appId: env.FIREBASE_APP_ID,
  measurementId: env.FIREBASE_MEASUREMENT_ID,
});

// Helper function to get Gemini config
export const getGeminiConfig = () => ({
  apiKey: env.GEMINI_API_KEY,
}); 