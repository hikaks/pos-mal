import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc } from "firebase/firestore";
import type { TransactionDetail } from "@/lib/data";

const transactionsCollection = collection(db, "transactions");

export async function addTransaction(transaction: Omit<TransactionDetail, 'id'>) {
    const docRef = await addDoc(transactionsCollection, transaction);
    // Add the generated ID to the document itself.
    await updateDoc(docRef, { id: docRef.id });
    return docRef.id;
}
