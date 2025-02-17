'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Settings, Bell, Shield, GamepadIcon, Coins, DollarSign, Plus } from 'lucide-react';
import Link from 'next/link';
import { useLocalStorage } from '@/hooks/use-local-storage'; // Import

export default function ProfilePage() {
  const [tokens] = useLocalStorage<number>('tokens', 0); // Get tokens

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Profile</h1>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Guest User</h2>
              <p className="text-muted-foreground">guest@example.com</p>
            </div>
          </div>
          <Button className="w-full">Edit Profile</Button>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Coins className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Tokens</h2>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{tokens}</span> {/* Display tokens */}
                <span className="text-muted-foreground">available</span>
              </div>
            </div>
          </div>
          <Link href="/tokens">
            <Button className="w-full" variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Buy Tokens
            </Button>
          </Link>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Earnings</h2>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">120</span>
                <span className="text-muted-foreground">points</span>
              </div>
            </div>
          </div>
          <Link href="/earn">
            <Button className="w-full" variant="outline">
              View Rewards
            </Button>
          </Link>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <GamepadIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Game Creation</h2>
              <p className="text-muted-foreground">Create fun challenges</p>
            </div>
          </div>
          <Link href="/games/templates">
            <Button className="w-full">Create Game</Button>
          </Link>
        </Card>

        <div className="space-y-4">
          <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
            <div className="flex items-center space-x-4">
              <Settings className="h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Account Settings</h3>
                <p className="text-sm text-muted-foreground">Manage your account preferences</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
            <div className="flex items-center space-x-4">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Notifications</h3>
                <p className="text-sm text-muted-foreground">Configure notification settings</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
            <div className="flex items-center space-x-4">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Privacy & Security</h3>
                <p className="text-sm text-muted-foreground">Manage your security preferences</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
