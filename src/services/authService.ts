import { 
  auth 
} from '../firebase';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
} from 'firebase/auth';
import type { User } from 'firebase/auth';

export function login(email: string, pass: string): Promise<User> {
  return signInWithEmailAndPassword(auth, email, pass).then(res => res.user);
}

export function logout(): Promise<void> {
  return signOut(auth);
}

export function subscribeToAuthChanges(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
