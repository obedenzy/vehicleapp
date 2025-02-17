'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Users, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { templateIcons } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

interface Game {
  id: string;
  title: string;
  description: string;
  image: string;
  templateId: string;
  entryFee: number;
  entryCount: number;
  prizePool: number;
  status: 'ongoing' | 'completed';
  endTime?: string;
  winner?: string;
  createdAt: string;
  entries?: Array<{ userId: string; timestamp: string; }>;
  config?: Record<string, any>;
}

export default function PlayPage() {
  const [activeTab, setActiveTab] = useState('ongoing');
  const [games, setGames] = useState<Game[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const savedGames = localStorage.getItem('games');
      const parsedGames = savedGames ? JSON.parse(savedGames) : [];
      const sortedGames = parsedGames.sort((a: Game, b: Game) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setGames(sortedGames);
    } catch (error) {
      console.error('Failed to load games:', error);
      setGames([]);
    }
  }, []);

  const filteredGames = games.filter(game => {
    const now = Date.now();
    const isExpired = game.endTime ? new Date(game.endTime).getTime() < now : false;
    return activeTab === 'ongoing' ? !isExpired : isExpired;
  });

  const formatTimeLeft = (endTime: string) => {
    const end = new Date(endTime);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ended';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m left`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Play & Win</h1>
          <p className="text-muted-foreground">Join games and compete for prizes</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="ongoing">Ongoing Games</TabsTrigger>
          <TabsTrigger value="completed">Completed Games</TabsTrigger>
        </TabsList>

        <TabsContent value="ongoing" className="space-y-6">
          {filteredGames.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">No ongoing games available</p>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredGames.map((game) => {
                const Icon = templateIcons[game.templateId as keyof typeof templateIcons];
                return (
                  <Card key={game.id} className="overflow-hidden">
                    <div className="relative h-48">
                      <img
                        src={game.image}
                        alt={game.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <div className="bg-background/90 backdrop-blur-sm text-foreground px-3 py-1 rounded-full text-sm font-medium">
                          ${game.entryFee}
                        </div>
                      </div>
                      <div className="absolute bottom-4 right-4">
                        <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                          {formatTimeLeft(game.endTime!)}
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          {Icon && <Icon className="h-5 w-5 text-primary" />}
                        </div>
                        <div>
                          <h2 className="font-semibold">{game.title}</h2>
                          <p className="text-sm text-muted-foreground">{game.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{game.entryCount} entries</span>
                        </div>
                        <div className="text-sm font-medium">
                          Prize Pool: ${game.prizePool}
                        </div>
                      </div>
                      <Button 
                        className="w-full" 
                        asChild
                      >
                        <Link href={`/games/${game.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          {filteredGames.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">No completed games</p>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredGames.map((game) => {
                const Icon = templateIcons[game.templateId as keyof typeof templateIcons];
                return (
                  <Card key={game.id} className="overflow-hidden">
                    <div className="relative h-48">
                      <img
                        src={game.image}
                        alt={game.title}
                        className="w-full h-full object-cover opacity-75"
                      />
                      <div className="absolute inset-0 bg-background/50" />
                      <div className="absolute top-4 right-4">
                        <div className="bg-background/90 backdrop-blur-sm text-foreground px-3 py-1 rounded-full text-sm font-medium">
                          ${game.entryFee}
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          {Icon && <Icon className="h-5 w-5 text-primary" />}
                        </div>
                        <div>
                          <h2 className="font-semibold">{game.title}</h2>
                          <p className="text-sm text-muted-foreground">{game.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{game.entryCount} entries</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Trophy className="h-4 w-4 text-primary" />
                          <span>Winner: {game.winner}</span>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        asChild
                      >
                        <Link href={`/games/${game.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
