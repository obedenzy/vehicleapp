'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Loader2, AlertTriangle } from 'lucide-react';

export default function PaymentForm() {
  const [amount, setAmount] = useState<string | number>(''); // Default to minimum
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [tokens, setTokens] = useLocalStorage<number>('tokens', 0);

  // State for card details (NOT SECURE - for demo only)
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');

  // Error states for each field
  const [cardNumberError, setCardNumberError] = useState('');
  const [expiryDateError, setExpiryDateError] = useState('');
  const [cvcError, setCvcError] = useState('');
    const [amountError, setAmountError] = useState(''); // Add amountError state


  // Placeholder refs for where Stripe Elements would be mounted
  const cardElementRef = useRef<HTMLDivElement>(null);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '') {
            setAmount(''); // Allow empty input
            setAmountError('');
            return;
        }

        const numValue = parseInt(value, 10);

        if (isNaN(numValue)) {
            setAmountError('Please enter a valid number.');
            return;
        }

        if (numValue < 5) {
            setAmountError('Minimum amount is $5.');
            setAmount(numValue); // Allow typing values less than 5, but show error
        } else {
            setAmountError('');
            setAmount(numValue);
        }
    };

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        // Remove non-digit characters
        value = value.replace(/\D/g, '');
        // Limit to 16 digits
        value = value.substring(0, 16);
        // Add spaces for formatting
        const formattedValue = value.replace(/(\d{4})/g, '$1 ').trim();

        setCardNumber(formattedValue);
        validateCardNumber(formattedValue); //validate on change
    }

    const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
         // Remove non-digit characters
        value = value.replace(/\D/g, '');
        // Limit to 4 digits
        value = value.substring(0, 4);

        // Add slash
        if (value.length > 2) {
            value = `${value.substring(0, 2)}/${value.substring(2)}`;
        }

        setExpiryDate(value);
        validateExpiryDate(value);
    }

    const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        value = value.replace(/\D/g, '');
        value = value.substring(0, 4); // Limit CVC
        setCvc(value);
        validateCvc(value);
    }


  const handlePayment = async () => {
    setLoading(true);
    setAmountError(''); // Clear amount error
    setCardNumberError('');
    setExpiryDateError('');
    setCvcError('');

    // Basic validation (in a real app, use a library!)
    if (!cardNumber || !expiryDate || !cvc) {
      toast({
        title: "Error",
        description: "Please fill in all card details.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

      if (amount === '' || Number(amount) < 5) {
          setAmountError('Minimum amount is $5.');
          setLoading(false);
          return;
      }

    // More robust (but still basic) validation:
    if (!validateCardNumber(cardNumber)) {
          setLoading(false);
          return;
      }
      if (!validateExpiryDate(expiryDate)) {
          setLoading(false);
          return;
      }
      if (!validateCvc(cvc)) {
          setLoading(false);
          return;
      }


    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: Number(amount), cardNumber: cardNumber.replace(/\s/g, ''), expiryDate, cvc }), // Sending card details - INSECURE! Remove spaces before sending
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Payment intent creation failed');
      }

      const { clientSecret } = await response.json();

      // *******************************************************************
      // **  IN A REAL APPLICATION, YOU WOULD USE STRIPE.JS HERE.        **
      // **  This example is *SIMULATED* due to environment limitations. **
      // *******************************************************************

      // Simulate a successful payment after a short delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update the token balance (in localStorage, for this demo)
      setTokens(prevTokens => prevTokens + Number(amount));

      toast({
        title: 'Payment Successful',
        description: `You have successfully purchased ${amount} tokens!`,
      });

      // Clear the form
      setCardNumber('');
      setExpiryDate('');
      setCvc('');
        setAmount('');

    } catch (error: any) {
      toast({
        title: 'Payment Failed',
        description: error.message || 'An error occurred during payment.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

    const validateCardNumber = (number: string) => {
    const cleaned = number.replace(/\s/g, ''); // Remove spaces
    if (!/^\d{16}$/.test(cleaned)) {
      setCardNumberError('Card number must be 16 digits');
      return false;
    }
    setCardNumberError('');
    return true;
  };

  const validateExpiryDate = (date: string) => {
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(date)) {
      setExpiryDateError('Invalid format. Use MM/YY');
      return false;
    }

    const [month, year] = date.split('/');
    const now = new Date();
    const expiry = new Date(parseInt('20' + year, 10), parseInt(month, 10) - 1); // Month is 0-indexed

    if (expiry < now) {
      setExpiryDateError('Card has expired');
      return false;
    }

    setExpiryDateError('');
    return true;
  };

  const validateCvc = (cvc: string) => {
    if (!/^\d{3,4}$/.test(cvc)) {
      setCvcError('CVC must be 3 or 4 digits');
      return false;
    }
    setCvcError('');
    return true;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Buy Tokens</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              min="5"
              step="1"
              placeholder='min is $5'
              value={amount}
              onChange={handleAmountChange}
              disabled={loading}
              data-error={!!amountError}
            />
            {amountError && <p className="text-red-500 text-sm">{amountError}</p>}
            <p className="text-sm text-muted-foreground">
              Minimum purchase: $5 (5 tokens)
            </p>
          </div>
          <div className="space-y-2">
            <Label>Tokens to receive</Label>
            <div className="p-2 border rounded-md">
              {amount}
            </div>
          </div>

        {/*  Credit Card Form (SIMULATED - NOT SECURE) */}
        <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="XXXX XXXX XXXX XXXX"
              value={cardNumber}
              onChange={handleCardNumberChange}
              disabled={loading}
              maxLength={19} // Allow spaces for visual formatting
              data-error={!!cardNumberError}
            />
            {cardNumberError && <p className="text-red-500 text-sm">{cardNumberError}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={handleExpiryDateChange}
                disabled={loading}
                maxLength={5}
                data-error={!!expiryDateError}
              />
              {expiryDateError && <p className="text-red-500 text-sm">{expiryDateError}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input
                id="cvc"
                placeholder="CVC"
                value={cvc}
                onChange={handleCvcChange}
                disabled={loading}
                maxLength={4}
                data-error={!!cvcError}
              />
              {cvcError && <p className="text-red-500 text-sm">{cvcError}</p>}
            </div>
          </div>
          {/* End Credit Card Form */}
          <div className="flex items-center text-yellow-500 my-2">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <span>
              This is a demo. Do NOT enter real card details.
            </span>
          </div>

          <Button type="button" onClick={handlePayment} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Pay'
            )}
          </Button>
          <div className="text-sm text-muted-foreground">
            Your current token balance: {tokens}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
