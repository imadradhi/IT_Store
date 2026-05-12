import { database, auth } from '../firebase';
import { ref, get, set, child } from 'firebase/database';
import { signInAnonymously } from 'firebase/auth';

// نقوم بتسجيل الدخول الخفي (Anonymous) لتأمين قاعدة البيانات
signInAnonymously(auth).catch(error => {
  console.error("Anonymous auth failed:", error);
});

export interface AppUser {
  username: string;
  fullname: string;
  isActive: string;
  createdAt: string;
}

const USER_STORAGE_KEY = 'it_stock_user';

// دالة لتشفير كلمة المرور باستخدام SHA-256
async function hashPassword(password: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function login(username: string, pass: string): Promise<AppUser> {
  const dbRef = ref(database);
  const snapshot = await get(child(dbRef, `users/${username}`));

  if (!snapshot.exists()) {
    throw new Error('USER_NOT_FOUND');
  }

  const userData = snapshot.val();
  const hashedInput = await hashPassword(pass);

  // مقارنة الهاش المشفر
  if (userData.password !== hashedInput) {
    throw new Error('INVALID_PASSWORD');
  }

  // التحقق من التفعيل (ندعم النص والـ boolean لضمان التوافق)
  if (String(userData.isActive) !== 'true') {
    throw new Error('PENDING_ACTIVATION');
  }

  const user: AppUser = {
    username: userData.username,
    fullname: userData.fullname,
    isActive: userData.isActive,
    createdAt: userData.createdAt
  };
  
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  return user;
}

export async function register(username: string, pass: string, fullname: string): Promise<void> {
  const userRef = ref(database, `users/${username}`);
  
  const snapshot = await get(userRef);
  if (snapshot.exists()) {
    throw new Error('USERNAME_TAKEN');
  }

  const hashedPassword = await hashPassword(pass);

  await set(userRef, {
    username,
    password: hashedPassword, // حفظ الهاش فقط
    fullname,
    isActive: 'false',
    createdAt: new Date().toISOString()
  });

  throw new Error('PENDING_ACTIVATION');
}

export function logout(): void {
  localStorage.removeItem(USER_STORAGE_KEY);
  window.location.reload();
}

export function getCurrentUser(): AppUser | null {
  const data = localStorage.getItem(USER_STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}

export function subscribeToAuthChanges(callback: (user: AppUser | null) => void) {
  const user = getCurrentUser();
  callback(user);
  return () => {};
}
