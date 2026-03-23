"use client";

import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/login' })}
      style={{ marginLeft: 'auto', color: 'var(--text-muted)', cursor: 'pointer', background: 'transparent', border: 'none' }}
      title="Sign out"
    >
      <LogOut size={16} />
    </button>
  );
}
