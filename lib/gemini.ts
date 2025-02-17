import { useLocalStorage } from "@/hooks/use-local-storage"; // Import

export async function identifyVehicle(imageData: ArrayBuffer) {

  // Check for sufficient tokens using the hook
    const [, , decrementToken] = useLocalStorage<number>('tokens', 0);
    if (!decrementToken()) { // Attempt to decrement, check result
        throw new Error('Insufficient tokens to identify vehicle.'); // Throw error
    }


  // Convert ArrayBuffer to Base64 using FileReader
  const blob = new Blob([imageData]);
  const base64Image = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix to get just the base64 string
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
  
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: "Analyze this vehicle image and provide comprehensive details in JSON format:\n" +
                   "{\n" +
                   "  make: string, // manufacturer name\n" +
                   "  model: string, // model name\n" +
                   "  year: number | string, // estimated year or year range\n" +
                   "  trim: string, // trim level if identifiable\n" +
                   "  bodyStyle: string, // sedan, SUV, coupe, etc.\n" +
                   "  exteriorColor: string, // exterior color\n" +
                   "  condition: {\n" +
                   "    overall: string, // excellent, good, fair, poor\n" +
                   "    notes: string[] // visible damage or issues\n" +
                   "  },\n" +
                   "  priceRange: { min: number, max: number },\n" +
                   "  fuelEfficiency: { city: number, highway: number } | { range: number, unit: string },\n" +
                   "  specifications: {\n" +
                   "    engine: string,\n" +
                   "    transmission: string,\n" +
                   "    drivetrain: string,\n" +
                   "    horsepower: number,\n" +
                   "    torque: string\n" +
                   "  },\n" +
                   "  exterior: {\n" +
                   "    headlights: string,\n" +
                   "    wheels: string,\n" +
                   "    grille: string,\n" +
                   "    additionalFeatures: string[]\n" +
                   "  },\n" +
                   "  interior: {\n" +
                   "    seating: string,\n" +
                   "    dashboard: string,\n" +
                   "    features: string[]\n" +
                   "  },\n" +
                   "  features: string[],\n" +
                   "  safetyFeatures: string[]\n" +
                   "}" },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: base64Image
              }
            }
          ]
        }]
      })
    }
  );

  if (!response.ok) {
    throw new Error('Failed to identify vehicle');
  }
  
  const data = await response.json();
  
  // Extract the response text and parse it as JSON
  if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
    console.error('Unexpected Gemini API response structure:', data);
    throw new Error('Invalid response from identification service');
  }

  try {
    const text = data.candidates[0].content.parts[0].text;
    // Try to extract JSON from the response text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    
    const parsedData = JSON.parse(jsonMatch[0]);

    // Check for fuelEfficiency and fetch if missing
    if (!parsedData.fuelEfficiency || (!parsedData.fuelEfficiency.city && !parsedData.fuelEfficiency.range)) {
      try {
        const searchQuery = `${parsedData.year} ${parsedData.make} ${parsedData.model} fuel efficiency`;
        const searchResponse = await fetch(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`);

        if (!searchResponse.ok) {
          throw new Error(`HTTP error! Status: ${searchResponse.status}`);
        }

        const searchHtml = await searchResponse.text();

        // Extract fuel efficiency data (VERY basic and fragile parsing)
        const mpgMatch = searchHtml.match(/(\d+\.?\d*)\s*MPG/i); // Look for "XX MPG"
        const kmLMatch = searchHtml.match(/(\d+\.?\d*)\s*km\/L/i); // Look for "XX km/L"
        const l100kmMatch = searchHtml.match(/(\d+\.?\d*)\s*L\/100km/i); // Look for "XX L/100km"

        if (mpgMatch) {
          parsedData.fuelEfficiency = { range: parseFloat(mpgMatch[1]), unit: 'MPG' };
        } else if (kmLMatch) {
          parsedData.fuelEfficiency = { range: parseFloat(kmLMatch[1]), unit: 'km/L' };
        } else if (l100kmMatch) {
          parsedData.fuelEfficiency = { range: parseFloat(l100kmMatch[1]), unit: 'L/100km' };
        }
      } catch (searchError) {
        console.error('Error searching for fuel efficiency:', searchError);
        // Don't throw here, just log and continue with available data
      }
    }
    
    // Validate the required fields
    const validatedData = {
      make: parsedData.make || 'Unknown',
      model: parsedData.model || 'Unknown',
      year: parsedData.year?.toString() || 'Unknown',
      trim: parsedData.trim || 'Unknown',
      bodyStyle: parsedData.bodyStyle || 'Unknown',
      exteriorColor: parsedData.exteriorColor || 'Unknown',
      condition: {
        overall: parsedData.condition?.overall || 'Unknown',
        notes: Array.isArray(parsedData.condition?.notes) ? parsedData.condition.notes : []
      },
      priceRange: typeof parsedData.priceRange === 'object'
        ? `$${parsedData.priceRange.min?.toLocaleString() || 0} - $${parsedData.priceRange.max?.toLocaleString() || 0}`
        : parsedData.priceRange || 'Not available',
      fuelEfficiency: typeof parsedData.fuelEfficiency === 'object'
        ? parsedData.fuelEfficiency.range
          ? `${parsedData.fuelEfficiency.range} ${parsedData.fuelEfficiency.unit}`
          : parsedData.fuelEfficiency.city && parsedData.fuelEfficiency.highway
            ? `${parsedData.fuelEfficiency.city} city / ${parsedData.fuelEfficiency.highway} highway MPG`
            : 'Fuel efficiency data not available'
        : parsedData.fuelEfficiency || 'Not available',
      specifications: parsedData.specifications || {},
      exterior: parsedData.exterior || {},
      interior: parsedData.interior || {},
      safetyFeatures: Array.isArray(parsedData.safetyFeatures) ? parsedData.safetyFeatures : [],
      features: Array.isArray(parsedData.features) ? parsedData.features : []
    };

    // Token deduction moved BEFORE the API call
    // if (typeof window !== 'undefined') {
    //   const storedTokens = localStorage.getItem('tokens');
    //   let currentTokens = storedTokens ? parseInt(storedTokens, 10) : 0;
    //   localStorage.setItem('tokens', String(currentTokens - 1));
    // }
    
    return validatedData;
  } catch (error) {
    console.error('Failed to parse vehicle data:', error, '\nResponse text:', data.candidates[0].content.parts[0].text);
    throw new Error('Failed to parse vehicle identification response');
  }
}
