import { db } from "@/lib/firebase";
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import type { Category } from "@/lib/data";

const categoriesCollection = collection(db, "categories");

export async function getCategories(): Promise<Category[]> {
    const snapshot = await getDocs(categoriesCollection);
    // The document ID is already the category ID, so we just spread the data.
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Category));
}

export async function addCategory(category: Omit<Category, 'id'>) {
    // Generate a 4-digit random number as a string for the ID.
    const newId = Math.floor(1000 + Math.random() * 9000).toString();
    const categoryDoc = doc(db, "categories", newId);
    // We use setDoc here to specify our custom ID.
    // We also store the id as a field within the document.
    await setDoc(categoryDoc, { ...category, id: newId });
    return newId;
}

export async function updateCategory(id: string, category: Partial<Omit<Category, 'id'>>) {
    const categoryDoc = doc(db, "categories", id);
    await updateDoc(categoryDoc, category);
}

export async function deleteCategory(id: string) {
    const categoryDoc = doc(db, "categories", id);
    await deleteDoc(categoryDoc);
}
