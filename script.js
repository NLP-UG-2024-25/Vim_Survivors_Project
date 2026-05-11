const form = document.querySelector(".search-form");
const resultsSection = document.querySelector("#results");

const API_KEY = "b69b151";

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = form.querySelector('input[type="text"]').value.trim();
  const year = form.querySelector('input[type="number"]').value.trim();

  if (!title) return;


  let url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(title)}`;

  if (year) {
    url += `&y=${year}`;
  }

  try {
    resultsSection.innerHTML = "<p>Loading...</p>";

    const res = await fetch(url);
    const data = await res.json();

    displayResults(data);

  } catch (err) {
    resultsSection.innerHTML = `<p>Error fetching data</p>`;
  }
});

function displayResults(data) {
  if (data.Response === "False") {
    resultsSection.innerHTML = `
      <h2>Results</h2>
      <p>No results found</p>
    `;
    return;
  }

  const movies = data.Search;

  resultsSection.innerHTML = `
    <h2>Results</h2>
    <div class="netflix-grid">
${movies.map(movie => `
  <div class="netflix-card">
    <div class="poster">

<img 
  src="${movie.Poster !== "N/A"
    ? movie.Poster
    : "no-poster.png"}"
  alt="${movie.Title}"
/>

      <button class="play-btn">▶</button>

      <div class="overlay">
        <div class="info">
          <h3>${movie.Title}</h3>
          <p>${movie.Year}</p>
        </div>
      </div>
    </div>
  </div>
`).join("")}
    </div>
  `;
}