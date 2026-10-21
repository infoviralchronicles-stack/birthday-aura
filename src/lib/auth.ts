import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'Birthday Aura_secret_key_super_secure_2026';

export interface AuthSession {
  userId: string;
  email: string;
  role: string;
  name: string;
}

export function signSessionToken(payload: AuthSession): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifySessionToken(token: string): AuthSession | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthSession;
  } catch (error) {
    return null;
  }
}

export async function getCurrentUser(): Promise<AuthSession | null> {
  const cookieStore = cookies();
  const token = cookieStore.get('gold_session')?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

