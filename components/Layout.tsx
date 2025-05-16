// components/Layout.tsx
import Link from 'next/link';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <nav className="container mx-auto px-4 py-3 flex space-x-6">
          <Link href="/">
            <a className="text-gray-700 dark:text-gray-200 hover:underline">Home</a>
          </Link>
          <Link href="/dashboard">
            <a className="text-gray-700 dark:text-gray-200 hover:underline">Dashboard</a>
          </Link>
        </nav>
      </header>
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
      <footer className="bg-gray-100 dark:bg-gray-900 text-center py-4 text-sm text-gray-500">
        © {new Date().getFullYear()} Your App Name
      </footer>
    </div>
  );
}
