import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, getDocs, query, orderBy } from "firebase/firestore";
import type { TransactionDetail } from "@/lib/data";

const transactionsCollection = collection(db, "transactions");

export async function addTransaction(transaction: Omit<TransactionDetail, 'id'>) {
    const docRef = await addDoc(transactionsCollection, transaction);
    // Add the generated ID to the document itself.
    await updateDoc(docRef, { id: docRef.id });
    return docRef.id;
}

export async function getTransactions(): Promise<TransactionDetail[]> {
    const q = query(transactionsCollection, orderBy("date", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as TransactionDetail);
}
