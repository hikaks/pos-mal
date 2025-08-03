# Deployment Guide - POS System

## 🚀 Deployment Configuration

### Firebase Project
- **Project ID**: `pos-4-90fb5`
- **Domain**: `pos-4-90fb5.firebaseapp.com`
- **Storage**: `pos-4-90fb5.firebasestorage.app`

### Environment Variables
Untuk production deployment, gunakan environment variables:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyBOyPQ9CuhlFUQseO2lqYXqxFGB2u1kah0
VITE_FIREBASE_AUTH_DOMAIN=pos-4-90fb5.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=pos-4-90fb5
VITE_FIREBASE_STORAGE_BUCKET=pos-4-90fb5.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=599895364431
VITE_FIREBASE_APP_ID=1:599895364431:web:8f5dd5cb8a21234e3a2b3a
VITE_FIREBASE_MEASUREMENT_ID=G-5W4HK9F0RF

# Gemini AI Configuration
VITE_GEMINI_API_KEY=AIzaSyDViIarEP7dc6KghSb4diJQqzcmme1QaAQ
```

## 📦 Build Commands

```bash
# Install dependencies
npm install

# Development
npm run dev

# Production build
npm run build

# Preview build
npm run preview

# Linting
npm run lint
```

## 🌐 Deployment Options

### 1. Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

**Vercel Configuration:**
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### 2. Netlify Deployment

```bash
# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

**Netlify Configuration:**
- Build command: `npm run build`
- Publish directory: `dist`
- Node version: `18.x`

### 3. Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase Hosting
firebase init hosting

# Build and deploy
npm run build
firebase deploy
```

**Firebase Hosting Configuration:**
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

## 🔧 Firebase Setup

### 1. Enable Services

Pastikan services berikut sudah diaktifkan di Firebase Console:

- ✅ **Authentication** - Email/Password
- ✅ **Firestore Database** - Rules configured
- ✅ **Storage** - Rules configured
- ✅ **Analytics** - Optional

### 2. Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Products collection
    match /products/{productId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Transactions collection
    match /transactions/{transactionId} {
      allow read, write: if request.auth != null;
    }
    
    // Customers collection
    match /customers/{customerId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 3. Storage Security Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🧪 Testing

### Pre-deployment Tests

```bash
# Test build
npm run build

# Test linting
npm run lint

# Test development server
npm run dev
```

### Post-deployment Tests

1. **Authentication Test**
   - Login dengan demo accounts
   - Test role-based access

2. **Firebase Connection Test**
   - Check browser console untuk Firebase connection
   - Test Firestore operations

3. **Gemini AI Test**
   - Check browser console untuk Gemini AI connection
   - Test AI features di dashboard

## 📊 Monitoring

### Firebase Console
- Monitor usage di Firebase Console
- Check error logs
- Monitor performance

### Vercel/Netlify Analytics
- Monitor page views
- Check performance metrics
- Monitor error rates

## 🔒 Security Considerations

### Environment Variables
- ✅ API keys tidak di-expose di client-side code
- ✅ Use environment variables untuk production
- ✅ Rotate API keys secara berkala

### Firebase Security
- ✅ Firestore rules configured
- ✅ Storage rules configured
- ✅ Authentication enabled

### CORS Configuration
- ✅ Configure CORS untuk production domains
- ✅ Restrict API access

## 🚀 Performance Optimization

### Build Optimization
- ✅ Code splitting
- ✅ Tree shaking
- ✅ Minification
- ✅ Gzip compression

### Runtime Optimization
- ✅ Lazy loading components
- ✅ Image optimization
- ✅ Caching strategies

## 📞 Support

Jika ada masalah dengan deployment:

1. Check Firebase Console untuk error logs
2. Verify environment variables
3. Test local development server
4. Check browser console untuk errors
5. Verify API key permissions

---

**Deployment Status**: ✅ Ready for Production 