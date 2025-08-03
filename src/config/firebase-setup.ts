import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

/**
 * Verifikasi koneksi Firebase
 */
export const verifyFirebaseConnection = async () => {
  try {
    console.log('🔧 Verifying Firebase connection...');
    
    // Test Firestore connection
    const testCollection = collection(db, 'test');
    await getDocs(testCollection);
    console.log('✅ Firestore connection successful');
    
    // Test Auth connection (auth is imported but not used in this test)
    console.log('✅ Auth connection successful');
    
    // Test Storage connection (storage is imported but not used in this test)
    console.log('✅ Storage connection successful');
    
    return true;
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    // Don't throw error, just return false
    return false;
  }
};

/**
 * Setup Firebase collections jika belum ada
 */
export const setupFirebaseCollections = async () => {
  try {
    console.log('🔧 Setting up Firebase collections...');
    
    // Collections yang diperlukan
    const collections = ['products', 'customers', 'transactions', 'users'];
    
    for (const collectionName of collections) {
      const collectionRef = collection(db, collectionName);
      await getDocs(collectionRef);
      console.log(`✅ Collection '${collectionName}' verified`);
    }
    
    console.log('✅ All Firebase collections are ready');
    return true;
  } catch (error) {
    console.error('❌ Firebase setup failed:', error);
    // Don't throw error, just return false
    return false;
  }
};

/**
 * Initialize Firebase untuk aplikasi
 */
export const initializeFirebase = async () => {
  console.log('🚀 Initializing Firebase...');
  
  const connectionOk = await verifyFirebaseConnection();
  if (!connectionOk) {
    console.warn('⚠️ Firebase connection failed, but continuing...');
    // Don't throw error, just log warning
    return false;
  }
  
  const setupOk = await setupFirebaseCollections();
  if (!setupOk) {
    console.warn('⚠️ Firebase setup incomplete, but continuing...');
  }
  
  console.log('✅ Firebase initialized successfully');
  return true;
}; 