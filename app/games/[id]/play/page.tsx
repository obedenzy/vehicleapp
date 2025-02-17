import { headers } from 'next/headers';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamicParams = false;

export function generateStaticParams() {
  try {
    const headersList = headers();
    const games = JSON.parse(headersList.get('x-games') || '[]');
    return games.map((game: Game) => ({
      id: game.id
    }));
  } catch (error) {
    console.error('Failed to generate static params:', error);
    return [];
  }
}

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
  entries?: Array<{ userId: string; timestamp: string; guess?: string; }>;
  config?: Record<string, any>;
}

function getGame(id: string): Game | null {
  try {
    const headersList = headers();
    const games = JSON.parse(headersList.get('x-games') || '[]');
    return games.find((g: Game) => g.id === id) || null;
  } catch (error) {
    console.error('Failed to load game:', error);
    return null;
  }
}

export default function GamePlayPage({ params }: { params: { id: string } }) {
  const game = getGame(params.id);

  if (!game) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link 
        href={`/games/${params.id}`}
        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Game Details
      </Link>

      <div className="max-w-2xl mx-auto">
        <Card className="p-6">
          <div className="relative aspect-video rounded-lg overflow-hidden mb-6">
            <img
              src={game.image}
              alt={game.title}
              className="object-cover w-full h-full"
            />
          </div>

          <h1 className="text-2xl font-bold mb-4">{game.title}</h1>
          
          <form action="/api/games/submit-guess" method="POST" className="space-y-6">
            <input type="hidden" name="gameId" value={game.id} />
            <div className="space-y-2">
              <Label htmlFor="guess">Your Guess</Label>
              <Input
                id="guess"
                name="guess"
                placeholder="Enter your guess..."
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Submit Guess
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
