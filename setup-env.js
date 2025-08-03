#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Environment variables template
const envTemplate = `# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyBOyPQ9CuhlFUQseO2lqYXqxFGB2u1kah0
VITE_FIREBASE_AUTH_DOMAIN=pos-4-90fb5.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=pos-4-90fb5
VITE_FIREBASE_STORAGE_BUCKET=pos-4-90fb5.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=599895364431
VITE_FIREBASE_APP_ID=1:599895364431:web:8f5dd5cb8a21234e3a2b3a
VITE_FIREBASE_MEASUREMENT_ID=G-5W4HK9F0RF

# Gemini AI Configuration
VITE_GEMINI_API_KEY=AIzaSyDViIarEP7dc6KghSb4diJQqzcmme1QaAQ

# App Configuration
VITE_APP_NAME=POS System
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=Modern Point of Sale System with AI Integration

# Development Configuration
VITE_DEV_MODE=true
VITE_DEBUG_MODE=true
`;

// Function to create .env file
function createEnvFile() {
  const envPath = path.join(__dirname, '.env');
  
  // Check if .env already exists
  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env file already exists!');
    console.log('📝 Current .env file will be backed up as .env.backup');
    
    // Backup existing .env file
    const backupPath = path.join(__dirname, '.env.backup');
    fs.copyFileSync(envPath, backupPath);
    console.log('✅ Existing .env backed up as .env.backup');
  }
  
  // Create new .env file
  try {
    fs.writeFileSync(envPath, envTemplate);
    console.log('✅ .env file created successfully!');
    console.log('🔧 Environment variables configured:');
    console.log('   - Firebase Configuration');
    console.log('   - Gemini AI Configuration');
    console.log('   - App Configuration');
    console.log('   - Development Configuration');
    console.log('');
    console.log('🚀 You can now run: npm run dev');
  } catch (error) {
    console.error('❌ Error creating .env file:', error.message);
    process.exit(1);
  }
}

// Function to validate environment variables
function validateEnvFile() {
  const envPath = path.join(__dirname, '.env');
  
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env file not found!');
    console.log('💡 Run: node setup-env.js to create it');
    return false;
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_GEMINI_API_KEY'
  ];
  
  const missingVars = requiredVars.filter(varName => 
    !envContent.includes(varName)
  );
  
  if (missingVars.length > 0) {
    console.log('⚠️  Missing environment variables:');
    missingVars.forEach(varName => console.log(`   - ${varName}`));
    return false;
  }
  
  console.log('✅ Environment variables validated successfully!');
  return true;
}

// Main execution
const command = process.argv[2];

switch (command) {
  case 'create':
    createEnvFile();
    break;
  case 'validate':
    validateEnvFile();
    break;
  default:
    console.log('🔧 Environment Setup Script');
    console.log('');
    console.log('Usage:');
    console.log('  node setup-env.js create   - Create .env file');
    console.log('  node setup-env.js validate - Validate .env file');
    console.log('');
    console.log('Examples:');
    console.log('  node setup-env.js create');
    console.log('  node setup-env.js validate');
} 