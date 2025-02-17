'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload, Camera, X } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import type { GameTemplate, GameFormData } from '../types';
import { useLocalStorage } from '@/hooks/use-local-storage';

interface GameFormProps {
  template: GameTemplate;
  templateId: string;
}

export default function GameForm({ template, templateId }: GameFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<GameFormData>({
    title: '',
    description: '',
    image: null,
    config: Object.fromEntries(
      template.fields.map(field => [field.name, field.defaultValue])
    )
  });

  const handleImageSelect = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image must be less than 5MB",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData(prev => ({
        ...prev,
        image: e.target?.result as string
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate prize pool and entry fee
    const entryFee = parseFloat(formData.config.entryFee || '0');
    const prizePool = entryFee * 0.9; // 90% of entry fee goes to prize pool

    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a game title",
        variant: "destructive"
      });
      return;
    }

    if (!formData.image) {
      toast({
        title: "Error",
        description: "Please upload a game image",
        variant: "destructive"
      });
      return;
    }

    try {
      const newGame = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        title: formData.title,
        description: formData.description,
        image: formData.image,
        templateId,
        status: 'ongoing' as const,
        entryCount: 0,
        entryFee,
        prizePool,
        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
        config: formData.config
      };

      // Get existing games and add the new one
      try {
        const existingGames = JSON.parse(localStorage.getItem('games') || '[]');
        const updatedGames = [newGame, ...existingGames];
        localStorage.setItem('games', JSON.stringify(updatedGames));

        toast({
          title: "Success",
          description: "Game created successfully"
        });

        router.push('/play');
      } catch (storageError) {
        console.error('Failed to save game:', storageError);
        throw new Error('Failed to save game data');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create game. Please try again.",
        variant: "destructive"
      });
    }
  };

  const isFieldVisible = (field: GameTemplate['fields'][0]) => {
    if (!field.showIf) return true;
    return field.showIf(formData.config);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Link 
          href="/games/templates" 
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Templates
        </Link>

        <Card className="p-6">
          <h1 className="text-3xl font-bold mb-2">{template.title}</h1>
          <p className="text-muted-foreground mb-6">{template.description}</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Game Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    title: e.target.value
                  }))}
                  placeholder="Enter a title for your game"
                />
              </div>

              <div>
                <Label className="mb-2 block">Game Image</Label>
                {!formData.image ? (
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageSelect(file);
                      }}
                    />
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <Upload className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Upload Game Image</h3>
                        <p className="text-sm text-muted-foreground">
                          Upload a cover image for your game (max 5MB)
                        </p>
                      </div>
                      <div className="flex justify-center gap-4">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Image
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => {
                            toast({
                              title: "Coming Soon",
                              description: "Camera capture will be available soon"
                            });
                          }}
                        >
                          <Camera className="mr-2 h-4 w-4" />
                          Take Photo
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={formData.image}
                      alt="Game cover"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, image: null }));
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {template.fields.map((field) => (
                isFieldVisible(field) && (
                  <div key={field.name} className="space-y-2">
                    <Label htmlFor={field.name}>{field.label}</Label>
                    {field.type === 'switch' ? (
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={field.name}
                          checked={formData.config[field.name] as boolean}
                          onCheckedChange={(checked) =>
                            setFormData(prev => ({
                              ...prev,
                              config: { ...prev.config, [field.name]: checked }
                            }))
                          }
                        />
                        <Label htmlFor={field.name}>
                          {formData.config[field.name] ? 'Enabled' : 'Disabled'}
                        </Label>
                      </div>
                    ) : field.type === 'select' ? (
                      <Select
                        value={String(formData.config[field.name])}
                        onValueChange={(value) =>
                          setFormData(prev => ({
                            ...prev,
                            config: { ...prev.config, [field.name]: value }
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options?.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id={field.name}
                        type={field.type}
                        value={formData.config[field.name]}
                        onChange={(e) =>
                          setFormData(prev => ({
                            ...prev,
                            config: { ...prev.config, [field.name]: e.target.value }
                          }))
                        }
                        min={field.min}
                        max={field.max}
                        step={field.step}
                      />
                    )}
                  </div>
                )
              ))}

              <div className="space-y-2">
                <Label htmlFor="description">Game Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    description: e.target.value
                  }))}
                  placeholder="Enter a description for your game..."
                  className="h-32"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit">Create Game</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
