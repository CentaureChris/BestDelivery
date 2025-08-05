export async function geocodeAddress(address: string): Promise<{ lat: number; lon: number } | null> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
  const response = await fetch(url, {
    headers: {
      'Accept-Language': 'fr',
      'User-Agent': 'MyDeliveryApp - youremail@email.com',
    },
  });
  const results = await response.json();
  if (results && results.length > 0) {
    return { lat: parseFloat(results[0].lat), lon: parseFloat(results[0].lon) };
  }
  return null;
}