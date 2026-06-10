export async function getUnsplashPhoto(query: string) {
  const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&q=80"; // High-quality default food image

  if (!process.env.UNSPLASH_ACCESS_KEY) return DEFAULT_IMAGE;

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        query
      )}&per_page=1&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
        },
      }
    );
    const data = await response.json();
    return data.results[0]?.urls?.regular || DEFAULT_IMAGE;
  } catch (error) {
    console.error("Error fetching Unsplash photo:", error);
    return DEFAULT_IMAGE;
  }
}
