'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, User, LogOut, Settings, Package, Users } from 'lucide-react';
import { useAuthStore, useCartStore } from '@/store';
import { useLogout } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

export function Header() {
  const { user, isAuthenticated } = useAuthStore();
  const { items } = useCartStore();
  const logout = useLogout();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const isAdmin = user?.role === 'admin';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Package className="h-6 w-6" />
          <span className="font-bold text-xl">PayeTonKawa</span>
        </Link>

        {/* Navigation */}
                  <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600">
              Accueil
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-blue-600">
              Produits
            </Link>
            {isAuthenticated && (
              <Link href="/orders" className="text-gray-700 hover:text-blue-600">
                Mes commandes
              </Link>
            )}
          </nav>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Cart */}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => router.push('/cart')}
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Button>

          {/* User menu */}
          {isAuthenticated ? (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <User className="h-5 w-5" />
              </Button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      {user?.email}
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="mr-3 h-4 w-4" />
                      Profil
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin/customers"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Users className="mr-3 h-4 w-4" />
                        Clients
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        logout();
                      }}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" onClick={() => router.push('/login')}>
                Connexion
              </Button>
              <Button onClick={() => router.push('/register')}>
                Inscription
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}