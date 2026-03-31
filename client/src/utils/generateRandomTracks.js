// Generate random mock tracks as fallback when Spotify API has no data
export function generateRandomTracks(count = 20) {
  const genres = ["Pop", "Rock", "Hip-Hop", "Jazz", "Electronic", "Indie", "R&B", "Country"];
  const adjectives = ["Midnight", "Electric", "Neon", "Golden", "Crystal", "Urban", "Cosmic", "Echo"];
  const nouns = ["Dreams", "Roads", "Nights", "Lights", "Waves", "Echoes", "Vibes", "Rain"];
  
  const artists = [
    "Aurora", "Synthwave", "Luna", "Phoenix", "Cosmos", "Stellar", "Neon", "Infinity",
    "Echo Wave", "Digital Soul", "Cosmic Drift", "Urban Pulse"
  ];

  const colors = [
    "rgb(255, 107, 107)", // Red
    "rgb(74, 144, 226)",  // Blue
    "rgb(75, 192, 192)",  // Teal
    "rgb(255, 159, 64)",  // Orange
    "rgb(153, 102, 255)", // Purple
    "rgb(255, 205, 86)",  // Yellow
    "rgb(201, 203, 207)", // Gray
    "rgb(54, 162, 235)",  // Sky
  ];

  const tracks = [];
  
  for (let i = 0; i < count; i++) {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const genre = genres[Math.floor(Math.random() * genres.length)];
    const artist = artists[Math.floor(Math.random() * artists.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];

    tracks.push({
      id: `random-${i}-${Date.now()}`,
      name: `${adjective} ${noun}`,
      artists: [{ name: artist }],
      album: {
        name: `${genre} Collection`,
        images: [
          {
            url: `https://placehold.co/300x300?text=${encodeURIComponent(adjective + ' ' + noun)}&bg=3498db&textbg=2c3e50`
          }
        ]
      },
      duration_ms: Math.floor(Math.random() * 180000) + 120000 // 2-5 minutes
    });
  }

  return tracks;
}
