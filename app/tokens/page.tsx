'use client';

import PaymentForm from '@/components/payment-form';
import { AlertTriangle } from 'lucide-react';
import { useLocalStorage } from '@/hooks/use-local-storage'; // Import
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function TokensPage() {
  const [tokens] = useLocalStorage<number>('tokens', 0); // Get tokens

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Buy Tokens</h1>
      <div className="mb-4 p-4 bg-yellow-100 border border-yellow-500 rounded-md flex items-center">
        <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
        <p className="text-sm text-yellow-700">
          This is a demo application.  The payment form below is a placeholder.  No real payments will be processed.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Token Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{tokens} Tokens</div>
          <p className="text-muted-foreground">Available tokens</p>
        </CardContent>
      </Card>
      <PaymentForm />
    </div>
  );
}
