// This is a *simulated* server-side API route for creating a payment intent.
// In a real application, you would use the Stripe Node.js library on a secure server.

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { amount, cardNumber, expiryDate, cvc } = await req.json();

    console.log('Received request body:', { amount, cardNumber, expiryDate, cvc });

    // Validate the amount (ensure it's a number and meets the minimum)
    if (typeof amount !== 'number' || amount < 5) {
      const errorMessage = 'Invalid amount. Minimum amount is $5.';
      console.error(errorMessage);
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Basic (and insufficient) validation - just for the demo
    if (!/^\d{13,16}$/.test(cardNumber)) {
      const errorMessage = 'Invalid card number';
      console.error(errorMessage);
      return new Response(JSON.stringify({ error: errorMessage }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
        const errorMessage = 'Invalid expiry date';
        console.error(errorMessage);
        return new Response(JSON.stringify({ error: errorMessage }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    if (!/^\d{3,4}$/.test(cvc)) {
        const errorMessage = 'Invalid CVC';
        console.error(errorMessage);
        return new Response(JSON.stringify({ error: errorMessage }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    

    // *******************************************************************
    // **  IN A REAL APPLICATION, YOU WOULD USE THE STRIPE NODE LIBRARY  **
    // **  TO CREATE A PAYMENT INTENT HERE.  THIS IS A SIMULATION.       **
    // *******************************************************************
    // Example (using the Stripe library - NOT USABLE IN THIS ENVIRONMENT):
    /*
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Amount in cents
      currency: 'usd',
      payment_method_types: ['card'], // Specify payment method types
      // Other options, like customer, metadata, etc.
    });

    return new Response(JSON.stringify({ clientSecret: paymentIntent.client_secret }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    */
    // *******************************************************************

    // --- BEGIN SIMULATION (DO NOT USE IN PRODUCTION) ---
    console.warn("SIMULATED PAYMENT: Received card details (INSECURE - DEMO ONLY):", {
      cardNumber,
      expiryDate,
      cvc,
    });

    const clientSecret = `pi_simulated_${Math.random().toString(36).substring(2, 15)}`; // Simulate a client secret
    console.log('Simulated clientSecret:', clientSecret);
    // --- END SIMULATION ---

    return new Response(JSON.stringify({ clientSecret }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to create payment intent' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
