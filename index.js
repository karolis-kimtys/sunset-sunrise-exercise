import fetch from 'node-fetch';

console.log('Sunrise/Sunset Technical Exercise');

// Number of API calls to fetch
const totalCalls = 10;

// Number of API fetch calls to be called in parallel
const parallelCallChunks = 5;

// Set up a variable to store all API data
let allData = [];
let urlList = [];
let urlListChunks = [];
let sunriseList = [];
let sunriseTimesSec = [];

const urlGen = () => {
  for (let y = 0; y < totalCalls; y++) {
    let lat = (Math.random() * 180 - 90).toFixed(7);
    let lng = (Math.random() * 360 - 180).toFixed(7);
    let url = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}`;
    urlList.push(url);
    // console.log(`URL: ${url}`);
  }
};

const parallelFetch = () => {
  urlGen();
  console.log(`Promises created.`);
  for (let i = 0; i < urlList.length; i += parallelCallChunks) {
    urlListChunks.push(urlList.slice(i, i + parallelCallChunks));

    // Promise.all(urlList.map((url) => fetch(url)))
    //   .then((response) => Promise.all(response.map((r) => r.json())))
    //   .then((result) => {
    //     allData.push(result);
    //     console.log(`Promise No.${i + 1} resolved.`);
    //   });
  }

  let requests = urlList.slice(0);
  let results = [];
  //   console.log(urlListChunks);

  let chunks = async (urlListChunks, results) => {
    let curr;
    try {
      curr = await Promise.all(
        urlListChunks.map(
          (url) =>
            new Promise((resolve) => {
              //   fetch(url);
              console.log('New Promise', url);
              setTimeout(resolve, 500, url);
            })
          // .then((response) => Promise.all(response.map((r) => r.json())))
          // .then((result) => {
          //   allData.push();
          //   console.log(`Promise returned result`, result);
          // })
        )
      );
      results.push(curr);
      console.log(curr);
    } catch (err) {
      throw err;
    }
    return curr !== undefined && requests.length
      ? chunks(requests.splice(0, parallelCallChunks), results)
      : results;
  };

  chunks(requests.splice(0, parallelCallChunks), results)
    .then((data) => {
      //   console.log('Chunked result', data);
      allData.push(data);

      for (let i = 0; i < totalCalls; i++) {
        // Object.values(allData[i]).map((result) => {
        //   //   sunriseList.push(result.results.sunrise);
        // });
      }
      console.log('allData array', allData);
    })
    .catch((err) => console.error(err));

  //   setTimeout(() => {
  //     for (
  //       let i = 0;
  //       i < (totalCalls < parallelCalls ? 1 : totalCalls / parallelCalls);
  //       i++
  //     ) {
  //       Object.values(allData[i]).map((result) => {
  //         sunriseList.push(result.results.sunrise);
  //       });
  //     }
  //     console.log('All data saved.', allData);
  //   }, 5000);
};

parallelFetch();

const findSunrise = () => {
  console.log(sunriseList);
  parallelFetch();
  setTimeout(() => {
    sunriseList.forEach((time) => {
      time.split(' ')[1] === 'AM'
        ? sunriseTimesSec.push(
            time
              .split(' ')[0]
              .split(':')
              .reduce((acc, time) => 60 * acc + +time)
          )
        : sunriseTimesSec.push(
            time
              .split(' ')[0]
              .split(':')
              .reduce((acc, time) => 60 * acc + +time) + 43200
          );
    });
    console.log(sunriseTimesSec);

    const idxMin = sunriseTimesSec.indexOf(Math.min(...sunriseTimesSec));
    console.log('\n====================================');
    console.log(
      `\nLongest day was found at index ${idxMin} which lasted ${allData[0][idxMin].results.day_length}\n`
    );
    console.log(`\nURL: ${urlList[idxMin]}\n`);
    console.log('====================================\n');
  }, 11000);
};

// findSunrise();
