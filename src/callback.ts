import https from "https";

// Types 
interface WeatherData {
  temperature: number;
  windSpeed: number;
  weatherCode: number;
}

interface NewsPost {
  id: number;
  title: string;
}

interface NewsData {
  posts: NewsPost[];
}

// HTTPS GET helper
function httpsGet(
  url: string,
  callback: (error: Error | null, data?: any) => void
): void {
  https
    .get(url, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        const statusCode = response.statusCode ?? 0;

        if (statusCode < 200 || statusCode >= 300) {
          callback(
            new Error(`HTTP ${statusCode}: ${data}`)
          );
          return;
        }

        try {
          const parsedData = JSON.parse(data);
          callback(null, parsedData);
        } catch (error) {
          console.error("Raw API response:", data);

          callback(
            new Error("Failed to parse JSON response")
          );
        }
      });
    })
    .on("error", (error) => {
      callback(error);
    });
}


// Fetch Current Weather


function fetchWeather(
  latitude: number,
  longitude: number,
  callback: (
    error: Error | null,
    weather?: WeatherData
  ) => void
): void {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${latitude}` +
    `&longitude=${longitude}` +
    `&current=temperature_2m,wind_speed_10m,weather_code`;

  console.log("Weather URL:", url);

  httpsGet(url, (error, data) => {
    if (error) {
      callback(error);
      return;
    }

    const weather: WeatherData = {
      temperature: data.current.temperature_2m,
      windSpeed: data.current.wind_speed_10m,
      weatherCode: data.current.weather_code,
    };

    callback(null, weather);
  });
}


// Fetch Limited News


function fetchNews(
  callback: (
    error: Error | null,
    news?: NewsData
  ) => void
): void {
  const url =
    "https://dummyjson.com/posts?limit=5&select=id,title";

  console.log("News URL:", url);

  httpsGet(url, (error, data) => {
    if (error) {
      callback(error);
      return;
    }

    callback(null, data);
  });
}


// Main


function main(): void {
  // Durban coordinates
  const latitude = -29.8587;
  const longitude = 31.0218;

  console.log("Fetching weather...");

  fetchWeather(latitude, longitude, (weatherError, weather) => {
    if (weatherError) {
      console.error(
        "Weather error:",
        weatherError.message
      );
      return;
    }

    console.log("\nCurrent Weather:");
    console.log(`Temperature: ${weather?.temperature}°C`);
    console.log(`Wind Speed: ${weather?.windSpeed} km/h`);
    console.log(`Weather Code: ${weather?.weatherCode}`);

    console.log("\nFetching news...");

    fetchNews((newsError, news) => {
      if (newsError) {
        console.error(
          "News error:",
          newsError.message
        );
        return;
      }

      console.log("\nLatest Posts:");

      news?.posts.forEach((post, index) => {
        console.log(`${index + 1}. ${post.title}`);
      });

      console.log("\nFinished!");
    });
  });
}


main();
