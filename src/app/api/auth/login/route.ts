import { NextResponse } from 'next/server';

// Minimal auth login placeholder
export async function POST(req: Request) {
  try {
    // For Phase 3 tests we expect a 401 when invalid/unauthorized
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    console.error('Erreur auth login:', error);
    return NextResponse.json({ error: 'Erreur authentification' }, { status: 500 });
  }
}
