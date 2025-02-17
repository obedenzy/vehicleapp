import VehicleIdentifier from '@/components/vehicle-identifier';

export default function Home() {
  return (
    <div
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-4xl font-bold text-center mb-8">
        Vehicle Identification AI
      </h1>
      <VehicleIdentifier />
    </div>
  );
}
