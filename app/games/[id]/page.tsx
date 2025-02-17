import { headers } from 'next/headers';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Users, Clock, ArrowLeft } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { templateIcons } from '@/lib/constants';
import { templates } from '../create/templates';
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
  entries?: Array<{ userId: string; timestamp: string; }>;
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

function formatTimeLeft(endTime: string) {
  const end = new Date(endTime);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  
  if (diff <= 0) return 'Ended';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m left`;
}

export default function GameDetailsPage({ params }: { params: { id: string } }) {
  const game = getGame(params.id);
  
  if (!game) {
    notFound();
  }

  const template = templates[game.templateId as keyof typeof templates];
  const Icon = templateIcons[game.templateId as keyof typeof templateIcons];

  const hasEntered = game.entries?.some(entry => entry.userId === 'current-user') || false;
  const isExpired = game.endTime && new Date(game.endTime).getTime() <= Date.now();

  return (
    <div className="container mx-auto px-4 py-8">
      <Link 
        href="/play" 
        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Games
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="relative aspect-video rounded-lg overflow-hidden mb-6">
              <img
                src={game.image}
                alt={game.title}
                className="object-cover w-full h-full"
              />
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                {Icon && <Icon className="h-6 w-6 text-primary" />}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{game.title}</h1>
                <p className="text-muted-foreground">{game.description}</p>
              </div>
            </div>

            <div className="mt-6">
              <Button 
                className="w-full" 
                size="lg"
                asChild
                disabled={hasEntered || isExpired}
              >
                <Link href={`/games/${game.id}/play`}>
                  {isExpired 
                    ? 'Game Ended'
                    : hasEntered 
                      ? 'Already Entered' 
                      : 'Enter Game'
                  }
                </Link>
              </Button>
            </div>

            {game.endTime && new Date(game.endTime).getTime() > Date.now() && (
              <div className="mb-6">
                <Progress 
                  value={(
                    (new Date(game.endTime).getTime() - Date.now()) / 
                    (24 * 60 * 60 * 1000)
                  ) * 100} 
                  className="mb-2" 
                />
                <p className="text-sm text-muted-foreground text-center">
                  {formatTimeLeft(game.endTime)}
                </p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <Users className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                <div className="font-semibold">{game.entryCount}</div>
                <div className="text-sm text-muted-foreground">Entries</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <Trophy className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                <div className="font-semibold">${game.prizePool}</div>
                <div className="text-sm text-muted-foreground">Prize Pool</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <Clock className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                <div className="font-semibold">${game.entryFee}</div>
                <div className="text-sm text-muted-foreground">Entry Fee</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Game Configuration</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {Object.entries(game.config || {}).map(([key, value]) => (
                <div key={key} className="p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </div>
                  <div className="font-medium">{String(value)}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Game Rules</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">How to Play</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Each player gets one attempt to guess</li>
                  <li>Closest guess wins the prize pool</li>
                  <li>Results revealed when time expires</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Prize Distribution</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Winner takes 90% of prize pool</li>
                  <li>Runner-up receives 10%</li>
                  <li>Ties split the prize equally</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Entries</h2>
            {game.entries && game.entries.length > 0 ? (
              <div className="space-y-4">
                {game.entries.slice(0, 5).map((entry, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Player {index + 1}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No entries yet. Be the first to enter!</p>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Template Information</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Features</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  {template.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
