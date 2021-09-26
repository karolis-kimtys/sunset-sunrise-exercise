import fetch from 'node-fetch';

console.log('Sunrise/Sunset Technical Exercise');

// Total number of API calls
const totalCalls = 20;

// Size of API call chunk
const parallelCallChunks = 5;

// Set timout delay (ms)
const delay = totalCalls * 500;

// Set up a variables to store all data
let allData = [];
let urlList = [];
let urlListChunks = [];
let sunriseList = [];
let sunriseTimesSec = [];

// Generated a list of url with random coodinates
const urlGen = () => {
  for (let y = 0; y < totalCalls; y++) {
    let lat = (Math.random() * 180 - 90).toFixed(7); // Latitude min -90deg, max 90deg
    let lng = (Math.random() * 360 - 180).toFixed(7); //Longitude min -180deg, max 180deg

    let url = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}`;
    urlList.push(url);
  }
  console.log('Generated URL List:', urlList);
};

// Function to create chunks of URLs and promises
const parallelFetch = () => {
  urlGen();
  for (let i = 0; i < urlList.length; i += parallelCallChunks) {
    urlListChunks.push(urlList.slice(i, i + parallelCallChunks));
  }

  let requests = urlList.slice(0);
  let results = [];

  let chunks = async (urlListChunks, results) => {
    let curr;
    try {
      curr = await Promise.all(
        urlListChunks.map(
          (prop) => new Promise((resolve) => setTimeout(resolve, 100, prop))
        )
      );
      console.log('New promise created.');
      results.push(curr);

      Promise.all(curr.map((url) => fetch(url)))
        .then((response) => Promise.all(response.map((r) => r.json())))
        .then((result) => {
          allData.push(result);
          console.log('New promise resolved.');
        });
    } catch (err) {
      throw err;
    }

    return curr !== undefined && requests.length
      ? chunks(requests.splice(0, parallelCallChunks), results)
      : results;
  };

  chunks(requests.splice(0, parallelCallChunks), results)
    .then((data) => {
      return data;
    })
    .catch((err) => console.error(err));
};

// Process all data to gather all sunrise times, convert to seconds, find earliest sunrise and return the longest day for selected coordinate
const findSunrise = () => {
  parallelFetch();

  setTimeout(() => {
    for (let i = 0; i < allData.length; i++) {
      Object.values(allData[i]).map((result) => {
        setTimeout(() => {
          console.log('Saving data...');
          sunriseList.push(result.results.sunrise);
        }, 100);
      });
    }

    console.log('List of all sunrise times:', sunriseList);
    sunriseList.forEach((time) => {
      time.split(' ')[1] === 'AM'
        ? // If time is in AM, convert to seconds
          sunriseTimesSec.push(
            time
              .split(' ')[0]
              .split(':')
              .reduce((acc, time) => 60 * acc + +time)
          )
        : // If time is in PM, convert to seconds and add 12 hours or 43200 seconds
          sunriseTimesSec.push(
            time
              .split(' ')[0]
              .split(':')
              .reduce((acc, time) => 60 * acc + +time) + 43200
          );
    });
    console.log('All sunrise times in seconds:', sunriseTimesSec);

    // Find the index of smallest number in the array
    const index = sunriseTimesSec.indexOf(Math.min(...sunriseTimesSec));

    // Find the position of the chunk in which index is located
    let chunkPosition = Math.floor(index / parallelCallChunks);

    console.log('All Data.', allData);

    console.log('\n====================================');

    try {
      console.log(
        `\nLongest day was found at index ${index} which lasted ${allData[chunkPosition][0].results.day_length}.\n`
      ),
        console.log(`URL: ${urlList[index]}\n`);
    } catch (error) {
      console.log(error);
    } finally {
      console.log('\nTime out. API server not responding.\n');
    }

    console.log('====================================\n');
    process.exit(1);
  }, delay);
};

findSunrise();
