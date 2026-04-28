"use client";

import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  serverTimestamp,
  Timestamp
} from "firebase/firestore";
import { db, auth } from "./firebase";

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface ConversionRecord {
  id?: string;
  userId: string;
  originalFileName: string;
  convertedFileName: string;
  fileType: string;
  fileSize: number;
  fromFormat: string;
  toFormat: string;
  timestamp: Timestamp | any;
}

export async function saveConversionHistory(data: Omit<ConversionRecord, 'timestamp' | 'userId'>) {
  const user = auth.currentUser;
  if (!user) return;

  const path = "conversions";
  try {
    const docRef = await addDoc(collection(db, path), {
      ...data,
      userId: user.uid,
      timestamp: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function getUserConversions() {
  const user = auth.currentUser;
  if (!user) return [];

  const path = "conversions";
  try {
    const q = query(
      collection(db, path),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ConversionRecord[];
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}
