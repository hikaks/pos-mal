import React, { useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Transaction from './pages/Transaction';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Reports from './pages/Reports';
import ErrorBoundary from './components/ErrorBoundary';
import { sampleCustomers, sampleTransactions } from './test/sampleData';
import { initializeFirebase } from './config/firebase-setup';
import { testGeminiConnection } from './services/gemini-test';
import { setupFirebaseForTesting } from './services/firebase-setup-admin';
import { useStore } from './store/useStore';

// Sample data untuk demo sudah diimport dari test/sampleData.ts

function App() {
  const { 
    customers, 
    transactions,
    setCustomers, 
    setTransactions 
  } = useStore();

  // Initialize Firebase and load sample data on first load
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 Initializing application...');
        
        // Initialize Firebase
        await initializeFirebase();
        console.log('✅ Firebase initialized successfully');
        
        // Setup Firebase untuk testing (admin user, permissions)
        const setupResult = await setupFirebaseForTesting();
        if (setupResult.success) {
          console.log('✅ Firebase setup completed');
        } else {
          console.warn('⚠️ Firebase setup incomplete:', setupResult.message);
        }
        
        // Test Gemini AI connection
        await testGeminiConnection();
        console.log('✅ Gemini AI connection tested');
        
        // Load sample data if empty (only customers and transactions)
        if (customers.length === 0) {
          setCustomers(sampleCustomers);
          console.log('✅ Sample customers loaded');
        }
        if (transactions.length === 0) {
          setTransactions(sampleTransactions);
          console.log('✅ Sample transactions loaded');
        }
        
        console.log('✅ Application initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize application:', error);
        // Fallback to sample data
        if (customers.length === 0) {
          setCustomers(sampleCustomers);
        }
        if (transactions.length === 0) {
          setTransactions(sampleTransactions);
        }
      }
    };

    initializeApp();
  }, [customers.length, transactions.length, setCustomers, setTransactions]);
  
  // Simple routing based on URL
  const getCurrentPage = () => {
    switch (window.location.pathname) {
      case '/':
        return <Dashboard />;
      case '/transactions':
        return <Transaction />;
      case '/products':
        return <Products />;
      case '/customers':
        return <Customers />;
      case '/reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ErrorBoundary>
      <Layout>
        {getCurrentPage()}
      </Layout>
    </ErrorBoundary>
  );
}

export default App;
