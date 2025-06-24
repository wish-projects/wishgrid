import { type NextRequest, NextResponse } from "next/server";

const PEXELS_API_KEY = process.env.PEXELS_API_KEY || "YOUR_PEXELS_API_KEY_HERE";

export async function POST(request: NextRequest) {
  try {
    const { query, page = 1 } = await request.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // First, get the total number of results to determine available pages
    const countResponse = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        query
      )}&per_page=1`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      }
    );

    if (!countResponse.ok) {
      throw new Error("Failed to fetch from Pexels API");
    }

    const countData = await countResponse.json();
    const totalResults = countData.total_results;
    const maxPage = Math.min(Math.ceil(totalResults / 12), 100); // Pexels limits to 100 pages

    // Fetch the actual images with the random page
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        query
      )}&per_page=12&page=${page}&orientation=all`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch from Pexels API");
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate moodboard" },
      { status: 500 }
    );
  }
}
