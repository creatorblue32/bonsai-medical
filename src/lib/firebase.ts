import { initializeApp, getApps } from 'firebase/app';
import { getAuth, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase only if it hasn't been initialized yet
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);

// User profile types
export interface UserStudyProfile {
  name: string;
  exam: string;
  targetScore: number;
  minimumScore: number;
  examDate: string;
  resources: string[];
  studyStyle: 'intensive' | 'balanced' | 'relaxed';
  createdAt: Date;
  updatedAt: Date;
}

// Save user study profile to Firestore
export async function saveUserStudyProfile(userId: string, profile: Omit<UserStudyProfile, 'createdAt' | 'updatedAt'>) {
  const userRef = doc(db, 'users', userId);
  const existingDoc = await getDoc(userRef);
  
  const data: UserStudyProfile = {
    ...profile,
    createdAt: existingDoc.exists() ? existingDoc.data().createdAt : new Date(),
    updatedAt: new Date(),
  };
  
  await setDoc(userRef, data, { merge: true });
  
  // Update Firebase Auth display name
  const currentUser = auth.currentUser;
  if (currentUser && profile.name) {
    await updateProfile(currentUser, {
      displayName: profile.name,
    });
  }
  
  return data;
}

// Get user study profile from Firestore
export async function getUserStudyProfile(userId: string): Promise<UserStudyProfile | null> {
  const userRef = doc(db, 'users', userId);
  const docSnap = await getDoc(userRef);
  
  if (docSnap.exists()) {
    return docSnap.data() as UserStudyProfile;
  }
  return null;
}

export default app;
