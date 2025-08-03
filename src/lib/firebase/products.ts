import { db } from "@/lib/firebase";
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, addDoc } from "firebase/firestore";
import type { Product } from "@/lib/data";

const productsCollection = collection(db, "products");

export async function getProducts(): Promise<Product[]> {
    const snapshot = await getDocs(productsCollection);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Product));
}

export async function addProduct(product: Omit<Product, 'id'>) {
    const docRef = await addDoc(productsCollection, product);
    await updateDoc(docRef, { id: docRef.id });
    return docRef.id;
}

export async function updateProduct(id: string, product: Partial<Omit<Product, 'id'>>) {
    const productDoc = doc(db, "products", id);
    await updateDoc(productDoc, product);
}

export async function deleteProduct(id: string) {
    const productDoc = doc(db, "products", id);
    await deleteDoc(productDoc);
}
