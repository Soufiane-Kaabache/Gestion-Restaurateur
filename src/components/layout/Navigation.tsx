'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  Table,
  Utensils,
  ChefHat,
  DollarSign,
  Calendar,
  BarChart3,
  Users,
  Martini,
  Menu as MenuIcon,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavigationProps {
  notifications?: number;
}

export function Navigation({ notifications = 0 }: NavigationProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: Home,
      description: "Vue d'ensemble",
    },
    {
      name: 'Tables',
      href: '/tables',
      icon: Table,
      description: 'Gestion des tables',
    },
    {
      name: 'Menu',
      href: '/menu',
      icon: Utensils,
      description: 'Carte et produits',
    },
    {
      name: 'Commandes',
      href: '/orders',
      icon: Utensils,
      description: 'Prise de commandes',
    },
    {
      name: 'Cuisine',
      href: '/kitchen',
      icon: ChefHat,
      description: 'Écran cuisine',
    },
    {
      name: 'Bar',
      href: '/bar',
      icon: Martini,
      description: 'Gestion du bar',
    },
    {
      name: 'Service',
      href: '/server',
      icon: Users,
      description: 'Service en salle',
    },
    {
      name: 'Caisse',
      href: '/payment',
      icon: DollarSign,
      description: 'Paiements',
    },
    {
      name: 'Réservations',
      href: '/reservations',
      icon: Calendar,
      description: 'Gestion des réservations',
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      description: 'Statistiques',
    },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="font-bold text-xl">Restaurant</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navigationItems.slice(0, 6).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}

            {/* More dropdown for remaining items */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <MenuIcon className="h-4 w-4" />
                  Plus
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {navigationItems.slice(6).map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-2 w-full ${
                        isActive(item.href) ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            {notifications > 0 && (
              <div className="relative">
                <Button variant="ghost" size="sm">
                  <div className="w-2 h-2 bg-red-500 rounded-full absolute top-1 right-1" />
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <MenuIcon className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <div>
                    <div>{item.name}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
