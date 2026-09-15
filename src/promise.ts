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

//  function to perform HTTPS GET request and return a Promise
function httpsGet(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        let data = "";
        
        response.on("data", (chunk) => {
          data += chunk;
        });

        response.on("end", () => {
          const statusCode = response.statusCode ?? 0;
          if (statusCode < 200 || statusCode >= 300) {
            reject(new Error(`HTTP ${statusCode}: ${data}`));
            return;
          }
          resolve(JSON.parse(data));
        });
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}
// Fetch Current Weather
function fetchCurrentWeather(): Promise<WeatherData> {
    const weatherApiUrl = "https://api.open-meteo.com/v1/forecast?latitude=-26.2041&longitude=28.0473&current_weather=true";
    return httpsGet(weatherApiUrl).then((data) =>{
        return JSON.parse(data) as WeatherData;
    })}

    // Fetch News Posts
function fetchNewsPosts(): Promise<NewsData> {
    const newsApiUrl =   "https://dummyjson.com/posts?limit=5&select=id,title"
    return httpsGet(newsApiUrl).then((data) => {
        return JSON.parse(data) as NewsData;
    });
}

// Display Current Weather
function displayCurrentWeather(weather: WeatherData): void {
  console.log("Current Weather:");
  console.log(`Temperature: ${weather.temperature}°C`);
  console.log(`Wind Speed: ${weather.windSpeed} km/h`);
  console.log(`Weather Code: ${weather.weatherCode}`);
}

// Display News Posts
function displayNewsPosts(news: NewsData): void {
  console.log("\nLatest News Posts:");
  news.posts.forEach((post, index) => {
    console.log(`${index + 1}. ${post.title}`);
  });
}

// Display Chain of Promises
console.log("chain of Promises:");
fetchCurrentWeather().then((weather) => {
  displayCurrentWeather(weather);
  return fetchNewsPosts();
}).then((news) => {
  displayNewsPosts(news);
}).catch((error) => {
  console.error("Error:", error.message);
})

//Display promise all
.then(() => {
console.log("promise all")
return Promise.all([fetchCurrentWeather(), fetchNewsPosts()])
.then(([weather, news]) => {
    displayCurrentWeather(weather);
    displayNewsPosts(news);
    console.log('\n Both loaded same time')
}).catch((error) => {
    console.error("Error:", error.message);
})
})

.then(()=>{
    console.log("promise race") 
    return Promise.race([fetchCurrentWeather(),fetchNewsPosts])
    .then((result)=>{  
        console.log(JSON.stringify(result,null,2).slice(0,100))
    }).catch((error) => {
        console.error("Error:", error.message);
    })
})
