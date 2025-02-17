'use client';

import { useState, useRef } from 'react';
import { Camera, Upload, Loader2, ImagePlus, X, Scan, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { identifyVehicle } from '@/lib/gemini';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useLocalStorage } from '@/hooks/use-local-storage'; // Import

interface VehicleHistory {
  make: string;
  model: string;
  year: string;
  image: string;
  timestamp: Date;
  details: any;
  id: string; // Add ID
}

export default function VehicleIdentifier() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [image, setImage] = useState<string | null>(null); // Keep for displaying the image
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [vehicleData, setVehicleData] = useState<any>(null);
  const [history, setHistory] = useState<VehicleHistory[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vehicleHistory');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const router = useRouter();

    // Use the hook to manage tokens
  const [tokens, setTokens, decrementToken] = useLocalStorage<number>('tokens', 0);


  const addToHistory = (data: any, base64Image: string) => { // Changed parameter
    const newEntry: VehicleHistory = {
      make: data.make,
      model: data.model,
      year: data.year,
      image: base64Image, // Store base64 data
      details: data,
      timestamp: new Date(),
      id: crypto.randomUUID(), // Generate a unique ID
    };

    const updatedHistory = [newEntry, ...history].slice(0, 10); // Keep last 10 entries
    setHistory(updatedHistory);
    localStorage.setItem('vehicleHistory', JSON.stringify(updatedHistory));
  };

  const validateImage = (file: File) => {
    try {
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }

      if (file.size > 10 * 1024 * 1024) {
        throw new Error('Image size should be less than 10MB');
      }

      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Invalid image file",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleIdentifyVehicle = async () => {
    if (!imageFile) {
      toast({
        title: "No Image",
        description: "Please select or capture an image first",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      setVehicleData(null);

      const buffer = await imageFile.arrayBuffer();
      const result = await identifyVehicle(buffer); // Await the API call

      setVehicleData(result); // Set vehicle data *after* successful API call
      // Store the Base64 data, not the object URL
      if (imageFile) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64Data = reader.result as string;
          addToHistory(result, base64Data);
        }
        reader.readAsDataURL(imageFile);
      }
    } catch (error: any) { // Catch the error
      if (error.message === 'Insufficient tokens to identify vehicle.') {
        toast({
          title: "Insufficient Tokens",
          description: "You don't have enough tokens to identify a vehicle.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to identify vehicle. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (file: File) => {
    if (validateImage(file)) {
      setImageFile(file);
      setVehicleData(null);
      setUploadProgress(0);
      
      // Simulate upload progress
      const reader = new FileReader();
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          setUploadProgress(progress);
        }
      };
      reader.onload = () => {
        setUploadProgress(100);
        setImage(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    if (image) {
      URL.revokeObjectURL(image);
    }
    setImage(null);
    setImageFile(null);
    setVehicleData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageSelect(file);
    } else {
      clearImage();
    }
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      toast({
        title: "Coming Soon",
        description: "Camera capture functionality is under development.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container max-w-6xl mx-auto px-4">
      <div className="space-y-6">
        {!image ? (
          <div className="flex flex-col items-center justify-center space-y-8">
            <div className="text-center space-y-4">
              <ImagePlus className="h-20 w-20 text-primary mx-auto" />
              <h3 className="text-2xl font-semibold">Add Vehicle Image</h3>
              <p className="text-lg text-muted-foreground">
                Upload an image or take a photo of the vehicle
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
              <Button
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                size="lg"
                className="h-[150px] text-xl bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white transition-all duration-200 rounded-xl shadow-lg hover:shadow-xl"
              >
                <Upload className="mr-3 h-8 w-8" />
                Upload Image
              </Button>
              <Button
                className="h-[150px] text-xl bg-black text-white hover:bg-black/90 transition-all duration-200 rounded-xl shadow-lg hover:shadow-xl"
                size="lg"
                onClick={handleCameraCapture}
                disabled={loading}
              >
                <Camera className="mr-3 h-8 w-8" />
                Take Photo
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative max-w-4xl mx-auto">
            <Button
              variant="ghost"
              size="lg"
              onClick={clearImage}
              className="mb-4 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Options
            </Button>
            <div className="aspect-video relative rounded-lg overflow-hidden bg-muted">
              {uploadProgress < 100 && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                  <div className="w-full max-w-md space-y-4 p-8">
                    <Progress value={uploadProgress} className="w-full" />
                    <p className="text-center text-sm text-muted-foreground">
                      Uploading image... {Math.round(uploadProgress)}%
                    </p>
                  </div>
                </div>
              )}
              <img
                src={image}
                alt="Vehicle"
                className="object-contain w-full h-full"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-4 right-4"
                onClick={clearImage}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="mt-6 flex justify-center">
              <Button
                onClick={handleIdentifyVehicle}
                size="lg"
                disabled={loading}
                className="h-16 text-xl px-8"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                    Analyzing Vehicle...
                  </>
                ) : (
                  <>
                    <Scan className="mr-3 h-6 w-6" />
                    Identify Vehicle
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
        
        {vehicleData && !loading && (
          <div className="mt-8 flex justify-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                router.push('/history');
                router.refresh();
              }}
              className="px-8"
            >
              View History
            </Button>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileSelect}
        />

        {vehicleData && !loading && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Vehicle Details</h2>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <InfoCard title="Make & Model" value={`${vehicleData.make} ${vehicleData.model}`} />
              <InfoCard title="Year" value={String(vehicleData.year)} />
              <InfoCard title="Trim" value={vehicleData.trim} />
              <InfoCard title="Body Style" value={vehicleData.bodyStyle} />
              <InfoCard title="Exterior Color" value={vehicleData.exteriorColor} />
              <InfoCard title="Condition" value={vehicleData.condition.overall} />
              <InfoCard title="Price Range" value={String(vehicleData.priceRange)} />
              <InfoCard title="Fuel Efficiency" value={String(vehicleData.fuelEfficiency)} />
            </div>
            
            {vehicleData.condition.notes.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Condition Notes</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {vehicleData.condition.notes.map((note: string, index: number) => (
                    <li key={index}>{note}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {vehicleData.specifications && Object.keys(vehicleData.specifications).length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Specifications</h3>
                <div className="prose prose-sm max-w-none">
                  <div className="bg-muted p-4 rounded-lg overflow-auto">
                    {Object.entries(vehicleData.specifications).map(([key, value]) => (
                      <div key={key} className="mb-2">
                        <span className="font-medium">{key}: </span>
                        <span>{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {vehicleData.exterior && Object.keys(vehicleData.exterior).length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Exterior Details</h3>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-medium mb-2">Design Features</h4>
                      <div className="space-y-2">
                        {vehicleData.exterior.headlights && (
                          <p><span className="font-medium">Headlights:</span> {vehicleData.exterior.headlights}</p>
                        )}
                        {vehicleData.exterior.wheels && (
                          <p><span className="font-medium">Wheels:</span> {vehicleData.exterior.wheels}</p>
                        )}
                        {vehicleData.exterior.grille && (
                          <p><span className="font-medium">Grille:</span> {vehicleData.exterior.grille}</p>
                        )}
                      </div>
                    </div>
                    {vehicleData.exterior.additionalFeatures?.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Additional Features</h4>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          {vehicleData.exterior.additionalFeatures.map((feature: string, index: number) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {vehicleData.interior && Object.keys(vehicleData.interior).length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Interior Details</h3>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-medium mb-2">Layout</h4>
                      <div className="space-y-2">
                        {vehicleData.interior.seating && (
                          <p><span className="font-medium">Seating:</span> {vehicleData.interior.seating}</p>
                        )}
                        {vehicleData.interior.dashboard && (
                          <p><span className="font-medium">Dashboard:</span> {vehicleData.interior.dashboard}</p>
                        )}
                      </div>
                    </div>
                    {vehicleData.interior.features?.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Features</h4>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          {vehicleData.interior.features.map((feature: string, index: number) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {vehicleData.safetyFeatures?.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Safety Features</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {vehicleData.safetyFeatures.map((feature: string, index: number) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {vehicleData.features && vehicleData.features.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Notable Features</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {vehicleData.features.map((feature: string, index: number) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="p-4 rounded-lg bg-muted">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <p className="mt-1 text-lg font-semibold">{String(value)}</p>
    </div>
  );
}
