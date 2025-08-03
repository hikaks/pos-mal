import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import type { Category } from "@/lib/data";

const categoriesCollection = collection(db, "categories");

export async function getCategories(): Promise<Category[]> {
    const snapshot = await getDocs(categoriesCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
}

export async function addCategory(category: Omit<Category, 'id'>) {
    const docRef = await addDoc(categoriesCollection, category);
    return docRef.id;
}

export async function updateCategory(id: string, category: Partial<Omit<Category, 'id'>>) {
    const categoryDoc = doc(db, "categories", id);
    await updateDoc(categoryDoc, category);
}

export async function deleteCategory(id: string) {
    const categoryDoc = doc(db, "categories", id);
    await deleteDoc(categoryDoc);
}
