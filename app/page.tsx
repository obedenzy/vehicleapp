'use client';

import VehicleIdentifier from '@/components/vehicle-identifier';
import { useEffect, useState } from 'react';
import Link from 'next/link'; // Import Link

interface VehicleHistory {
  make: string;
  model: string;
  year: string;
  image: string;
  timestamp: Date;
  details: any;
  id: string; // Add ID
}

export default function Home() {
    const [recentHistory, setRecentHistory] = useState<VehicleHistory[]>([]);

    useEffect(() => {
        const savedHistory = localStorage.getItem('vehicleHistory');
        if (savedHistory) {
            try {
                const parsed = JSON.parse(savedHistory);
                // Sort by timestamp descending, then take the first 3
                const sortedHistory = parsed.sort((a: VehicleHistory, b: VehicleHistory) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 3);

                setRecentHistory(sortedHistory);

            } catch (error) {
                console.error('Error parsing history:', error);
                setRecentHistory([]); // Set to empty array on error.
            }
        }
    }, []);


  return (
    <div
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-4xl font-bold text-center mb-8">
        Vehicle Identification AI
      </h1>
      <VehicleIdentifier />

        {/* Recent History Section */}
        {recentHistory.length > 0 && (
            <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Recent Identifications</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {recentHistory.map((item) => (
                        <Link key={item.id} href={`/history/${item.id}`}>
                            <div  className="flex items-center gap-4 p-4 border rounded-lg shadow-sm hover:bg-muted cursor-pointer">
                                <img
                                    src={item.image}
                                    alt={`${item.year} ${item.make} ${item.model}`}
                                    className="w-24 h-24 object-cover rounded-md"
                                />
                                <div>
                                    <h3 className="font-medium">{item.year} {item.make} {item.model}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(item.timestamp).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        )}
    </div>
  );
}
