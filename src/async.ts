import https from "https";

// Types
interface WeatherData {
  current_weather: {
    temperature: number;
    windspeed: number;
    weathercode: number;
  };
}

interface NewsPost {
  id: number;
  title: string;
}

interface NewsData {
  posts: NewsPost[];
}

// HTTPS GET request
function httpsGet(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        let data = "";

        response.on("data", (chunk) => {
          data += chunk;
        });

        response.on("end", () => {
          resolve(data);
        });

        response.on("error", (error) => {
          reject(new Error(`Error during HTTPS request: ${error.message}`));
        });
      })
      .on("error", (error) => {
        reject(new Error(`Error during HTTPS request: ${error.message}`));
      });
  });
}

// Fetch Current Weather
async function fetchCurrentWeather(): Promise<WeatherData> {
  const weatherApiUrl =
    "https://api.open-meteo.com/v1/forecast?latitude=-26.2041&longitude=28.0473&current_weather=true";

  const data = await httpsGet(weatherApiUrl);

  return JSON.parse(data) as WeatherData;
}

// Fetch News Posts
async function fetchNewsPosts(): Promise<NewsData> {
  const newsApiUrl = "https://dummyjson.com/posts?limit=5&select=id,title";

  const data = await httpsGet(newsApiUrl);

  return JSON.parse(data) as NewsData;
}

// Display Current Weather
function displayCurrentWeather(weather: WeatherData): void {
  console.log("Current Weather:");

  console.log(`Temperature: ${weather.current_weather.temperature}°C`);

  console.log(`Wind Speed: ${weather.current_weather.windspeed} km/h`);

  console.log(`Weather Code: ${weather.current_weather.weathercode}`);
}

// Display News Posts
function displayNewsPosts(news: NewsData): void {
  console.log("\nLatest News Posts:");

  news.posts.forEach((post, index) => {
    console.log(`${index + 1}. ${post.title}`);
  });
}

// ========================================
// ASYNC/AWAIT
// ========================================

async function main() {
  try {
    // Chain of Promises using async/await
    console.log("Chain of Promises:");

    const weather = await fetchCurrentWeather();
    displayCurrentWeather(weather);

    const news = await fetchNewsPosts();
    displayNewsPosts(news);

    // Promise.all using async/await
    console.log("\nPromise All:");

    const [weatherData, newsData] = await Promise.all([
      fetchCurrentWeather(),
      fetchNewsPosts(),
    ]);

    displayCurrentWeather(weatherData);
    displayNewsPosts(newsData);

    console.log("\nBoth loaded at the same time");

    // Promise.race using async/await
    console.log("\nPromise Race:");

    const result = await Promise.race([
      fetchCurrentWeather(),
      fetchNewsPosts(),
    ]);

    console.log(JSON.stringify(result, null, 2).slice(0, 100));
  } catch (error) {
    console.error("Error:", (error as Error).message);
  }
}

main();
