const form = document.querySelector(".search-form");
const resultsSection = document.querySelector("#results");

const API_KEY = "b69b151";

  const titleInput = document.getElementById("title");
  const suggestions = document.getElementById("suggestions");


titleInput.addEventListener("input", async () => {

  const query = titleInput.value.trim();

  if (query.length < 3) {
    suggestions.innerHTML = "";
    return;
  }

  try {

    const res = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`
    );

    const data = await res.json();



suggestions.innerHTML = "";

if (data.Search) {

  const sortedMovies = data.Search.sort((a, b) => {

    const aStarts = a.Title.toLowerCase().startsWith(query.toLowerCase());
    const bStarts = b.Title.toLowerCase().startsWith(query.toLowerCase());

    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;

    return a.Title.length - b.Title.length;
  });

  sortedMovies.forEach(movie => {

    const option = document.createElement("option");

    option.value = movie.Title;

    suggestions.appendChild(option);

  });

}

  } catch (err) {
    console.error(err);
  }

});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const year = document.getElementById("year").value.trim();

  const director = document.getElementById("director").value.trim();
  const cast = document.getElementById("cast").value.trim();
  const genre = document.getElementById("genre").value;


  if (!title) return;


  let url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(title)}`;

  if (year) {
    url += `&y=${year}`;
  }

  try {
    resultsSection.innerHTML = "<p>Loading...</p>";

    const res = await fetch(url);
    const data = await res.json();

    await displayResults(data);

  } catch (err) {
  console.error(err);

  resultsSection.innerHTML = `
    <p>Error fetching data</p>
    <p>${err.message}</p>
  `;
}
});

async function displayResults(data) {
      const director = document.getElementById("director").value.toLowerCase();
    const cast = document.getElementById("cast").value.toLowerCase();
    const genre = document.getElementById("genre").value.toLowerCase();
  if (data.Response === "False") {

    resultsSection.innerHTML = `
      <h2>Results</h2>
      <p>No results found</p>
    `;
    return;
  }

  const movies = await Promise.all(
  data.Search.map(async (movie) => {

    const res = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`
    );

    return await res.json();

  })
);

const filteredMovies = movies.filter(movie => {

  if (
    director &&
    !movie.Director.toLowerCase().includes(director)
  ) {
    return false;
  }

  if (
    cast &&
    !movie.Actors.toLowerCase().includes(cast)
  ) {
    return false;
  }

  if (
    genre !== "any" &&
    !movie.Genre.toLowerCase().includes(genre)
  ) {
    return false;
  }

  return true;

});



  resultsSection.innerHTML = `
    <h2>Results</h2>
    <div class="netflix-grid">
${filteredMovies.map(movie => `
  <div class="netflix-card">
    <div class="poster">

<img 
  src="${movie.Poster !== "N/A"
    ? movie.Poster
    : "no-poster.png"}"
  alt="${movie.Title}"
  onerror="this.src='no-poster.png'"
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

const translations = {
  en: {
    subtitle: "Search movies by multiple parameters",
    cinemas: "Currently in cinemas",
    cinemasText: "Featured cinema releases will appear here.",

    netflix: "Currently popular on Netflix",

    searchMovies: "Search movies",
    preferences: "Choose your preferences. Results will appear below.",

    title: "Title",
    year: "Year",
    director: "Director",
    cast: "Cast",
    genre: "Genre",
    runtime: "Runtime",
    awards: "Awards",
    country: "Country",

    search: "Search",
    reset: "Reset",

    results: "Results",
    noResults: "No results yet. Use the search form above to find movies."
  },

  pl: {
    subtitle: "Wyszukuj filmy według wielu parametrów",
    cinemas: "Obecnie w kinach",
    cinemasText: "Polecane premiery kinowe pojawią się tutaj.",

    netflix: "Obecnie popularne na Netflixie",

    searchMovies: "Wyszukaj filmy",
    preferences: "Wybierz preferencje. Wyniki pojawią się poniżej.",

    title: "Tytuł",
    year: "Rok",
    director: "Reżyser",
    cast: "Obsada",
    genre: "Gatunek",
    runtime: "Czas trwania",
    awards: "Nagrody",
    country: "Kraj",

    search: "Szukaj",
    reset: "Resetuj",

    results: "Wyniki",
    noResults: "Brak wyników. Użyj formularza wyszukiwania."
  }
};

let currentLang = "en";

const langBtn = document.getElementById("langToggle");

langBtn.addEventListener("click", () => {
  currentLang = currentLang === "en" ? "pl" : "en";

  langBtn.textContent = currentLang === "en" ? "PL" : "EN";

  document.querySelectorAll("[data-lang]").forEach(element => {
    const key = element.getAttribute("data-lang");
    element.textContent = translations[currentLang][key];
  });
});


window.addEventListener("load", () => {

  const intro = document.getElementById("intro-screen");
  const app = document.querySelector(".app");

  /* Movie slap */
  setTimeout(() => {

    app.classList.add("shake");

  }, 700);

  /* Hiding the intro */
  setTimeout(() => {

    intro.classList.add("hide-intro");

  }, 1000);

  /* Closing the intro */
  setTimeout(() => {

    intro.remove();

  }, 1800);

});

/* =========================
   POPCORN CURSOR EFFECT
========================= */

document.addEventListener("mousemove", (e) => {

  createPopcorn(e.clientX, e.clientY);

});

function createPopcorn(x, y) {

  const popcorn = document.createElement("span");

  popcorn.classList.add("popcorn");

  popcorn.innerText = "🍿";

  document.body.appendChild(popcorn);

  /* Position */
  popcorn.style.left = x + "px";
  popcorn.style.top = y + "px";

  /* Random size */
  const size = Math.random() * 18 + 12;

  popcorn.style.fontSize = size + "px";

  /* Random movement */
  const xMove = (Math.random() - 0.5) * 100;

  popcorn.style.setProperty("--xMove", `${xMove}px`);

  /* Remove after animation */
  setTimeout(() => {
    popcorn.remove();
  }, 1200);
}