import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import type { Product } from '../store/useStore';

export class FirebaseService {
  // Products Collection
  private productsCollection = collection(db, 'products');

  /**
   * Get all products from Firebase
   */
  async getProducts(): Promise<Product[]> {
    try {
      const q = query(this.productsCollection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const products: Product[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        products.push({
          id: doc.id,
          name: data.name,
          price: data.price,
          stock: data.stock,
          category: data.category,
          barcode: data.barcode,
          image: data.image,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        });
      });
      
      console.log('✅ Products loaded from Firebase:', products.length);
      return products;
    } catch (error) {
      console.error('❌ Error loading products from Firebase:', error);
      throw error;
    }
  }

  /**
   * Add new product to Firebase
   */
  async addProduct(product: Omit<Product, 'id'>): Promise<Product> {
    try {
      const productData = {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(this.productsCollection, productData);
      
      const newProduct: Product = {
        id: docRef.id,
        ...product,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('✅ Product added to Firebase:', newProduct);
      return newProduct;
    } catch (error) {
      console.error('❌ Error adding product to Firebase:', error);
      throw error;
    }
  }

  /**
   * Update product in Firebase
   */
  async updateProduct(productId: string, updates: Partial<Product>): Promise<void> {
    try {
      const productRef = doc(this.productsCollection, productId);
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp()
      };

      await updateDoc(productRef, updateData);
      console.log('✅ Product updated in Firebase:', productId);
    } catch (error) {
      console.error('❌ Error updating product in Firebase:', error);
      throw error;
    }
  }

  /**
   * Delete product from Firebase
   */
  async deleteProduct(productId: string): Promise<void> {
    try {
      const productRef = doc(this.productsCollection, productId);
      await deleteDoc(productRef);
      console.log('✅ Product deleted from Firebase:', productId);
    } catch (error) {
      console.error('❌ Error deleting product from Firebase:', error);
      throw error;
    }
  }

  /**
   * Upload image to Firebase Storage
   */
  async uploadImage(file: File, productId: string): Promise<string> {
    try {
      const storageRef = ref(storage, `products/${productId}/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      console.log('✅ Image uploaded to Firebase Storage:', downloadURL);
      return downloadURL;
    } catch (error) {
      console.error('❌ Error uploading image to Firebase Storage:', error);
      throw error;
    }
  }

  /**
   * Delete image from Firebase Storage
   */
  async deleteImage(imageUrl: string): Promise<void> {
    try {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
      console.log('✅ Image deleted from Firebase Storage:', imageUrl);
    } catch (error) {
      console.error('❌ Error deleting image from Firebase Storage:', error);
      throw error;
    }
  }

  /**
   * Search products by name or barcode
   */
  async searchProducts(searchTerm: string): Promise<Product[]> {
    try {
      const nameQuery = query(
        this.productsCollection,
        where('name', '>=', searchTerm),
        where('name', '<=', searchTerm + '\uf8ff')
      );
      
      const barcodeQuery = query(
        this.productsCollection,
        where('barcode', '==', searchTerm)
      );

      const [nameSnapshot, barcodeSnapshot] = await Promise.all([
        getDocs(nameQuery),
        getDocs(barcodeQuery)
      ]);

      const products: Product[] = [];
      
      nameSnapshot.forEach((doc) => {
        const data = doc.data();
        products.push({
          id: doc.id,
          name: data.name,
          price: data.price,
          stock: data.stock,
          category: data.category,
          barcode: data.barcode,
          image: data.image,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        });
      });

      barcodeSnapshot.forEach((doc) => {
        const data = doc.data();
        if (!products.find(p => p.id === doc.id)) {
          products.push({
            id: doc.id,
            name: data.name,
            price: data.price,
            stock: data.stock,
            category: data.category,
            barcode: data.barcode,
            image: data.image,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date()
          });
        }
      });

      return products;
    } catch (error) {
      console.error('❌ Error searching products in Firebase:', error);
      throw error;
    }
  }

  /**
   * Get products by category
   */
  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const q = query(
        this.productsCollection,
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      const products: Product[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        products.push({
          id: doc.id,
          name: data.name,
          price: data.price,
          stock: data.stock,
          category: data.category,
          barcode: data.barcode,
          image: data.image,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        });
      });

      return products;
    } catch (error) {
      console.error('❌ Error getting products by category from Firebase:', error);
      throw error;
    }
  }
}

export const firebaseService = new FirebaseService(); 