import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

app.use(cors());

app.get("/api/v1/images", async (req, res) => {
  try {
    res.send({
      success: true,
      result: await fetchRoverImagesForEarthDate(
        req.query.earth_date_ymd as string
      ),
    });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      error,
    });
  }
});

const port = process.env.PORT ?? 80;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

async function fetchRoverImagesForEarthDate(
  earthDateYmd: string
): Promise<object[]> {
  const url = new URL(
    "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos"
  );
  url.searchParams.append("earth_date", earthDateYmd);
  url.searchParams.append("api_key", process.env.NASA_KEY);

  console.log(`Fetching from ${url}`);

  const res = await (await fetch(url.toString())).json();
  return (res as any).photos;
}
