# sunset-sunrise-exercise

How does it work:
- It generstes a set amount of random latitude and longitude coordintes
- Injects these coordinates to an URL to be used to fetch data
- Returns a full list of generated URLs
- Loops over the array of URLs and chunks them into set size chunks
- Loops over each chunk and creates new promise for each URL
- Then fetches API data in parallel using a chunk of created Promises
- After all chunks of promises have been resolved, data is stored in a variable
- Then it loops over all data and collects all sunrise times and stores in a variable
- Then converts all sunrise times, AM/PM, to seconds and finds the smallest number
- Then it finds the index of that smallest number in the array
- Once index has been found, it looks inside all fetched data by index and fetches longest day for that data object