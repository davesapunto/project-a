export async function GET() {
  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/trending/tv/day?language=en-US",
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_KEY}`,
        },
        next: { revalidate: 3600 },
      }
    );

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch TMDB" },
      { status: 500 }
    );
  }
}
