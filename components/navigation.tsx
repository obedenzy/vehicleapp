
'use client';

import { Home, User, History, Menu, Scan, Gamepad2, Plus, Coins } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { useLocalStorage } from '@/hooks/use-local-storage';

export default function Navigation() {
  const pathname = usePathname();
  const [tokens, setTokens, decrementToken] = useLocalStorage<number>('tokens', 0); // Get tokens

  const links = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/profile', icon: User, label: 'Profile' },
    { href: '/history', icon: History, label: 'History' },
    { href: '/play', icon: Gamepad2, label: 'Play & Win' },
    { href: '/games/templates', icon: Plus, label: 'Create Games' },
    { href: '/tokens', icon: Coins, label: 'Add Tokens' }, // Added link
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-background border-b z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Scan className="h-6 w-6" />
            <span className="font-bold text-lg hidden sm:inline">Vehicle AI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {links.map(({ href, icon: Icon, label }) => {
              const isActive = pathname === href || (pathname.startsWith('/games') && href ==='/games/templates');
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center space-x-2 px-3 py-2 rounded-md transition-colors',
                    isActive
                      ? 'text-primary bg-muted'
                      : 'text-muted-foreground hover:text-primary hover:bg-muted/50'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{label}</span>
                </Link>
              );
            })}
            <div className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-primary" />
              <span className="font-medium">{tokens}</span>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="px-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[400px] p