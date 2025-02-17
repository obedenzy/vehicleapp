'use client';

import { Card, CardContent } from '@/components/ui/card';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

interface VehicleHistory {
  make: string;
  model: string;
  year: string;
  image: string;
  timestamp: Date;
  details: any;
  id: string; // Add ID
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="p-4 rounded-lg bg-muted">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <p className="mt-1 text-lg font-semibold">{String(value)}</p>
    </div>
  );
}

export default function VehicleDetailsPage({ params }: { params: { id: string } }) {
  const vehicleId = params.id;
  const [vehicleData, setVehicleData] = useState<VehicleHistory | null>(null);

    useEffect(() => {
        const savedHistory = localStorage.getItem('vehicleHistory');
        if (savedHistory) {
            try{
                const history: VehicleHistory[] = JSON.parse(savedHistory);
                const vehicle = history.find(item => item.id === vehicleId);
                setVehicleData(vehicle || null); // Set to null if not found
            } catch (error) {
                console.error('Failed to load vehicle data', error);
                setVehicleData(null);
            }
        }
    }, [vehicleId]);


  if (!vehicleData) {
    return(
        <div className="container mx-auto px-4 py-8">
            <Link
                href="/history"
                className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to History
            </Link>
            <p>Loading...</p>
        </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
        <Link 
            href="/history" 
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
        >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to History
        </Link>
      <h1 className="text-3xl font-bold mb-6">Vehicle Details</h1>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              {vehicleData.year} {vehicleData.make} {vehicleData.model}
            </h2>
            <img
                src={vehicleData.image}
                alt={`${vehicleData.year} ${vehicleData.make} ${vehicleData.model}`}
                className="w-48 h-32 object-cover rounded-lg"
            />
          </div>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <InfoCard title="Make & Model" value={`${vehicleData.details.make} ${vehicleData.details.model}`} />
            <InfoCard title="Year" value={String(vehicleData.details.year)} />
            <InfoCard title="Trim" value={vehicleData.details.trim} />
            <InfoCard title="Body Style" value={vehicleData.details.bodyStyle} />
            <InfoCard title="Exterior Color" value={vehicleData.details.exteriorColor} />
            <InfoCard title="Condition" value={vehicleData.details.condition.overall} />
            <InfoCard title="Price Range" value={String(vehicleData.details.priceRange)} />
            <InfoCard title="Fuel Efficiency" value={String(vehicleData.details.fuelEfficiency)} />
          </div>

          {vehicleData.details.condition.notes.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Condition Notes</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {vehicleData.details.condition.notes.map((note: string, index: number) => (
                  <li key={index}>{note}</li>
                ))}
              </ul>
            </div>
          )}

          {vehicleData.details.specifications && Object.keys(vehicleData.details.specifications).length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Specifications</h3>
              <div className="bg-muted p-4 rounded-lg">
                {Object.entries(vehicleData.details.specifications).map(([key, value]) => (
                  <div key={key} className="mb-2">
                    <span className="font-medium">{key}: </span>
                    <span>{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {vehicleData.details.exterior && Object.keys(vehicleData.details.exterior).length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Exterior Details</h3>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-medium mb-2">Design Features</h4>
                      <div className="space-y-2">
                        {vehicleData.details.exterior.headlights && (
                          <p><span className="font-medium">Headlights:</span> {vehicleData.details.exterior.headlights}</p>
                        )}
                        {vehicleData.details.exterior.wheels && (
                          <p><span className="font-medium">Wheels:</span> {vehicleData.details.exterior.wheels}</p>
                        )}
                        {vehicleData.details.exterior.grille && (
                          <p><span className="font-medium">Grille:</span> {vehicleData.details.exterior.grille}</p>
                        )}
                      </div>
                    </div>
                    {vehicleData.details.exterior.additionalFeatures?.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Additional Features</h4>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          {vehicleData.details.exterior.additionalFeatures.map((feature: string, index: number) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {vehicleData.details.interior && Object.keys(vehicleData.details.interior).length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Interior Details</h3>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-medium mb-2">Layout</h4>
                      <div className="space-y-2">
                        {vehicleData.details.interior.seating && (
                          <p><span className="font-medium">Seating:</span> {vehicleData.details.interior.seating}</p>
                        )}
                        {vehicleData.details.interior.dashboard && (
                          <p><span className="font-medium">Dashboard:</span> {vehicleData.details.interior.dashboard}</p>
                        )}
                      </div>
                    </div>
                    {vehicleData.details.interior.features?.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Features</h4>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          {vehicleData.details.interior.features.map((feature: string, index: number) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

          {vehicleData.details.features && vehicleData.details.features.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Notable Features</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {vehicleData.details.features.map((feature: string, index: number) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
