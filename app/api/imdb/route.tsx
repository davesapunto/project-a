export async function GET(request) {
    try{
        const response = await fetch({
            method: "GET",
            url: "https://imdb236.p.rapidapi.com/api/imdb/tt0816692",
            headers: {
            "x-rapidapi-host": "imdb236.p.rapidapi.com",
            "x-rapidapi-key": process.env.RAPIDAPI_KEY,
            },
        });

        const data = await response.json();

        return Response.json(data);
    } catch{

    }
}
