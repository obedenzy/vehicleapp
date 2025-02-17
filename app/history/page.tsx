'use client';

import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Search, ChevronDown, ChevronUp, Car } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';

interface VehicleHistory {
  make: string;
  model: string;
  year: string;
  image: string;
  timestamp: Date;
  details: any;
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="p-4 rounded-lg bg-muted">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <p className="mt-1 text-lg font-semibold">{String(value)}</p>
    </div>
  );
}

export default function HistoryPage() {
  const [history, setHistory] = useState<VehicleHistory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const savedHistory = localStorage.getItem('vehicleHistory');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setHistory(parsed.map((item: VehicleHistory) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        })));
      } catch (error) {
        console.error('Error parsing history:', error);
        setHistory([]);
      }
    }
  }, [searchQuery]); // Re-run when search changes to ensure fresh data

  const filteredHistory = history.filter(item => 
    `${item.make} ${item.model} ${item.year}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return 'Today, ' + new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday, ' + new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return `${days} days ago`;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-4xl font-bold">History</h1>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9 w-full md:w-[300px]"
            placeholder="Search history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredHistory.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">
              {searchQuery ? 'No matching vehicles found' : 'No vehicle history yet'}
            </p>
          </Card>
        ) : (
          filteredHistory.map((item, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {formatDate(new Date(item.timestamp))}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-1">
                      {item.year} {item.make} {item.model}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 text-muted-foreground hover:text-foreground"
                      onClick={() => setExpandedItem(expandedItem === index ? null : index)}
                    >
                      {expandedItem === index ? (
                        <>
                          <ChevronUp className="h-4 w-4 mr-2" />
                          Hide Details
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4 mr-2" />
                          View Details
                        </>
                      )}
                    </Button>
                  </div>
                  <img
                    src={item.image}
                    alt={`${item.year} ${item.make} ${item.model}`}
                    className={cn("rounded-lg w-32 h-24 object-cover", imageErrors[index] ? 'hidden' : '')}
                    onError={() => setImageErrors(prev => ({ ...prev, [index]: true }))}
                  />
                  {imageErrors[index] && (
                    <div className="rounded-lg w-32 h-24 bg-muted flex items-center justify-center">
                      <Car className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                
                {expandedItem === index && item.details && (
                  <div className="mt-6 border-t pt-6">
                    <div className="space-y-4">
                      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                        <InfoCard title="Make & Model" value={`${item.details.make} ${item.details.model}`} />
                        <InfoCard title="Year" value={String(item.details.year)} />
                        <InfoCard title="Trim" value={item.details.trim} />
                        <InfoCard title="Body Style" value={item.details.bodyStyle} />
                        <InfoCard title="Exterior Color" value={item.details.exteriorColor} />
                        <InfoCard title="Condition" value={item.details.condition.overall} />
                        <InfoCard title="Price Range" value={String(item.details.priceRange)} />
                        <InfoCard title="Fuel Efficiency" value={String(item.details.fuelEfficiency)} />
                      </div>
                      
                      {item.details.condition.notes.length > 0 && (
                        <div className="mt-4">
                          <h3 className="text-lg font-semibold mb-2">Condition Notes</h3>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            {item.details.condition.notes.map((note: string, noteIndex: number) => (
                              <li key={noteIndex}>{note}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {item.details.specifications && Object.keys(item.details.specifications).length > 0 && (
                        <div className="mt-4">
                          <h3 className="text-lg font-semibold mb-2">Specifications</h3>
                          <div className="bg-muted p-4 rounded-lg">
                            {Object.entries(item.details.specifications).map(([key, value]) => (
                              <div key={key} className="mb-2">
                                <span className="font-medium">{key}: </span>
                                <span>{String(value)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {item.details.features && item.details.features.length > 0 && (
                        <div className="mt-4">
                          <h3 className="text-lg font-semibold mb-2">Notable Features</h3>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            {item.details.features.map((feature: string, featureIndex: number) => (
                              <li key={featureIndex}>{feature}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
