# Environment Setup - POS System

## 🔧 Environment Variables Configuration

### File `.env` (Buat file ini di root project)

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

# App Configuration
VITE_APP_NAME=POS System
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=Modern Point of Sale System with AI Integration

# Development Configuration
VITE_DEV_MODE=true
VITE_DEBUG_MODE=true
```

## 📋 Environment Variables Breakdown

### Firebase Configuration
| Variable | Description | Default Value |
|----------|-------------|---------------|
| `VITE_FIREBASE_API_KEY` | Firebase API Key | `AIzaSyBOyPQ9CuhlFUQseO2lqYXqxFGB2u1kah0` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | `pos-4-90fb5.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID | `pos-4-90fb5` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket | `pos-4-90fb5.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID | `599895364431` |
| `VITE_FIREBASE_APP_ID` | Firebase App ID | `1:599895364431:web:8f5dd5cb8a21234e3a2b3a` |
| `VITE_FIREBASE_MEASUREMENT_ID` | Firebase Analytics ID | `G-5W4HK9F0RF` |

### Gemini AI Configuration
| Variable | Description | Default Value |
|----------|-------------|---------------|
| `VITE_GEMINI_API_KEY` | Gemini AI API Key | `AIzaSyDViIarEP7dc6KghSb4diJQqzcmme1QaAQ` |

### App Configuration
| Variable | Description | Default Value |
|----------|-------------|---------------|
| `VITE_APP_NAME` | Application Name | `POS System` |
| `VITE_APP_VERSION` | Application Version | `1.0.0` |
| `VITE_APP_DESCRIPTION` | Application Description | `Modern Point of Sale System with AI Integration` |

### Development Configuration
| Variable | Description | Default Value |
|----------|-------------|---------------|
| `VITE_DEV_MODE` | Development Mode | `true` |
| `VITE_DEBUG_MODE` | Debug Mode | `true` |

## 🚀 Setup Instructions

### 1. Create Environment File
```bash
# Di root project (pos-app/)
touch .env
```

### 2. Add Environment Variables
Copy dan paste isi dari file `.env` di atas ke file `.env` yang baru dibuat.

### 3. Verify Configuration
```bash
# Jalankan aplikasi
npm run dev

# Check console untuk validasi environment variables
```

## 🔒 Security Best Practices

### 1. Never Commit .env File
```bash
# Pastikan .env ada di .gitignore
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
echo ".env.production" >> .gitignore
```

### 2. Use Different Keys for Different Environments
```env
# Development
VITE_FIREBASE_API_KEY=dev_api_key_here

# Production  
VITE_FIREBASE_API_KEY=prod_api_key_here
```

### 3. Rotate API Keys Regularly
- Firebase API keys: Setiap 6 bulan
- Gemini API keys: Setiap 3 bulan

## 📊 Environment Validation

Aplikasi akan memvalidasi environment variables saat startup:

```typescript
// src/config/env.ts
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
```

## 🌐 Deployment Configuration

### Vercel
```bash
# Set environment variables di Vercel Dashboard
vercel env add VITE_FIREBASE_API_KEY
vercel env add VITE_GEMINI_API_KEY
# ... tambahkan semua environment variables
```

### Netlify
```bash
# Set environment variables di Netlify Dashboard
# Build settings > Environment variables
```

### Firebase Hosting
```bash
# Gunakan .env file untuk local development
# Untuk production, set di Firebase Console
```

## 🔍 Troubleshooting

### Common Issues:

1. **Missing Environment Variables**
   ```
   ⚠️ Missing environment variables: ['FIREBASE_API_KEY']
   ```
   **Solution**: Pastikan file `.env` ada dan berisi semua required variables.

2. **Invalid API Keys**
   ```
   ❌ Firebase connection failed
   ```
   **Solution**: Verifikasi API keys di Firebase Console.

3. **CORS Issues**
   ```
   ❌ Gemini AI connection failed
   ```
   **Solution**: Check API key permissions dan CORS settings.

## 📝 Notes

- ✅ Environment variables dimulai dengan `VITE_` untuk Vite
- ✅ Default values tersedia sebagai fallback
- ✅ Validation otomatis saat startup
- ✅ Type-safe environment configuration
- ✅ Centralized configuration management

---

**Status**: ✅ Environment configuration siap untuk digunakan! 