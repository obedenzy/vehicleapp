'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Users, Trophy, Gift, Car, Scan } from 'lucide-react';
import Link from 'next/link';

const gameTemplates = [
  {
    id: 'guess-year-model',
    title: 'Guess the Year & Model',
    description: 'Players guess the exact year and model of a car from an image with hidden badges.',
    icon: Car,
    entryFee: '$2',
    features: [
      'Upload car image or take photo',
      'Auto-hide identifying details',
      'First correct guess wins',
      'Real-time leaderboard'
    ]
  },
  {
    id: 'odometer-challenge',
    title: 'Odometer Challenge',
    description: 'Players guess the exact odometer reading from your video.',
    icon: Eye,
    entryFee: '$2',
    features: [
      'Upload video showing odometer',
      'Set exact odometer reading',
      'One guess per player',
      'Progressive prize pool'
    ]
  },
  {
    id: 'fastest-finger',
    title: 'Fastest Finger First',
    description: '10-second speed challenge to identify brand, model, and year.',
    icon: Trophy,
    entryFee: '$1',
    features: [
      'Timed responses',
      'Multiple rounds',
      'Speed-based scoring',
      'Global rankings'
    ]
  },
  {
    id: 'badge-guess',
    title: 'Blindfolded Badge Guess',
    description: 'Identify car brands from blurred or removed badges.',
    icon: Scan,
    entryFee: '$2',
    features: [
      'Auto-blur technology',
      'Multiple choice options',
      'Progressive difficulty',
      'Brand-specific challenges'
    ]
  }
];

export default function GameTemplatesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Game Templates</h1>
        <p className="text-muted-foreground">Choose a template to create your game</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {gameTemplates.map((template) => {
          const Icon = template.icon;
          return (
            <Card key={template.id} className="p-6 hover:shadow-lg transition-all">
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{template.title}</h2>
                  <p className="text-sm text-muted-foreground">Entry: {template.entryFee}</p>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-4">{template.description}</p>
              
              <div className="space-y-2 mb-6">
                {template.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <Link href={`/games/create/${template.id}`}>
                <Button className="w-full">Use Template</Button>
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
