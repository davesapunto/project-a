export async function GET( request : Request ) {

  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") ?? "1";

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_KEY}`,
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
