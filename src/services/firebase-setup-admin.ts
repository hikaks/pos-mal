import { 
  collection, 
  doc, 
  setDoc, 
  getDocs,
  query,
  where 
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut 
} from 'firebase/auth';
import { db, auth } from '../config/firebase';

/**
 * Setup admin user untuk testing
 */
export const setupAdminUser = async () => {
  try {
    console.log('🔧 Setting up admin user...');
    
    const adminEmail = 'admin@pos.com';
    const adminPassword = 'admin123456';
    
    // Cek apakah admin sudah ada
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', adminEmail));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      console.log('✅ Admin user already exists');
      return { success: true, message: 'Admin user already exists' };
    }
    
    // Buat user di Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
    const user = userCredential.user;
    
    // Buat document user di Firestore
    const userData = {
      id: user.uid,
      email: adminEmail,
      name: 'Admin POS',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await setDoc(doc(db, 'users', user.uid), userData);
    
    console.log('✅ Admin user created successfully:', userData);
    
    // Sign out setelah setup
    await signOut(auth);
    
    return { 
      success: true, 
      message: 'Admin user created successfully',
      credentials: { email: adminEmail, password: adminPassword }
    };
  } catch (error) {
    console.error('❌ Error setting up admin user:', error);
    return { 
      success: false, 
      message: 'Failed to setup admin user',
      error: error 
    };
  }
};

/**
 * Login sebagai admin
 */
export const loginAsAdmin = async () => {
  try {
    console.log('🔧 Logging in as admin...');
    
    const adminEmail = 'admin@pos.com';
    const adminPassword = 'admin123456';
    
    const userCredential = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
    const user = userCredential.user;
    
    console.log('✅ Logged in as admin:', user.email);
    
    return { 
      success: true, 
      message: 'Logged in as admin',
      user: user 
    };
  } catch (error) {
    console.error('❌ Error logging in as admin:', error);
    return { 
      success: false, 
      message: 'Failed to login as admin',
      error: error 
    };
  }
};

/**
 * Test Firebase connection dan permissions
 */
export const testFirebasePermissions = async () => {
  try {
    console.log('🔧 Testing Firebase permissions...');
    
    // Test read products
    const productsRef = collection(db, 'products');
    const productsSnapshot = await getDocs(productsRef);
    console.log('✅ Read products successful:', productsSnapshot.size, 'products');
    
    // Test write product (harus sebagai admin)
    const testProduct = {
      name: 'Test Product',
      price: 10000,
      stock: 10,
      category: 'Test',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const testDocRef = doc(collection(db, 'products'));
    await setDoc(testDocRef, testProduct);
    console.log('✅ Write product successful');
    
    // Hapus test product
    await setDoc(testDocRef, { deleted: true });
    console.log('✅ Delete product successful');
    
    return { 
      success: true, 
      message: 'Firebase permissions test passed' 
    };
  } catch (error) {
    console.error('❌ Firebase permissions test failed:', error);
    return { 
      success: false, 
      message: 'Firebase permissions test failed',
      error: error 
    };
  }
};

/**
 * Setup lengkap Firebase untuk testing
 */
export const setupFirebaseForTesting = async () => {
  console.log('🚀 Setting up Firebase for testing...');
  
  // 1. Setup admin user
  const adminResult = await setupAdminUser();
  if (!adminResult.success) {
    console.error('❌ Failed to setup admin user');
    return adminResult;
  }
  
  // 2. Login sebagai admin
  const loginResult = await loginAsAdmin();
  if (!loginResult.success) {
    console.error('❌ Failed to login as admin');
    return loginResult;
  }
  
  // 3. Test permissions
  const testResult = await testFirebasePermissions();
  if (!testResult.success) {
    console.error('❌ Failed to test permissions');
    return testResult;
  }
  
  console.log('✅ Firebase setup completed successfully');
  return { 
    success: true, 
    message: 'Firebase setup completed successfully',
    adminCredentials: { email: 'admin@pos.com', password: 'admin123456' }
  };
}; 