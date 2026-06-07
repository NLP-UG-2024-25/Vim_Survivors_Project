const form = document.querySelector(".search-form");
const resultsSection = document.querySelector("#results");

const API_KEY = "b69b151";

const randomMovieBtn = document.querySelector("#random-movie-btn");
const randomMovieResult = document.querySelector("#random-movie-result");

const randomMovieTitles = [
  "Inception",
  "Interstellar",
  "The Matrix",
  "The Dark Knight",
  "Forrest Gump",
  "Pulp Fiction",
  "Fight Club",
  "The Shawshank Redemption",
  "The Godfather",
  "Titanic",
  "La La Land",
  "The Grand Budapest Hotel",
  "Parasite",
  "Whiplash",
  "The Social Network",
  "The Devil Wears Prada",
  "Shutter Island",
  "Gone Girl",
  "The Wolf of Wall Street",
  "Little Women",
  "Barbie",
  "Oppenheimer",
  "Dune",
  "The Hunger Games",
  "Harry Potter and the Sorcerer's Stone",
  "The Lord of the Rings: The Fellowship of the Ring",
  "Spider-Man",
  "Joker",
  "Avatar",
  "Mamma Mia"
];

randomMovieBtn.addEventListener("click", getRandomMovie);

async function getRandomMovie() {
  const randomIndex = Math.floor(Math.random() * randomMovieTitles.length);
  const randomTitle = randomMovieTitles[randomIndex];

  const url = `https://www.omdbapi.com/?apikey=${API_KEY}&t=${encodeURIComponent(randomTitle)}`;

  try {
    randomMovieBtn.disabled = true;
    randomMovieBtn.textContent = translations[currentLang].randomLoading;

    randomMovieResult.classList.remove("random-empty");
    randomMovieResult.innerHTML = `<p>${translations[currentLang].randomLoading}</p>`;

    const res = await fetch(url);
    const movie = await res.json();

    if (movie.Response === "False") {
      randomMovieResult.classList.add("random-empty");
      randomMovieResult.innerHTML = `<p>${translations[currentLang].randomError}</p>`;
      return;
    }

    displayRandomMovie(movie);

  } catch (error) {
    randomMovieResult.classList.add("random-empty");
    randomMovieResult.innerHTML = `<p>${translations[currentLang].randomError}</p>`;
  } finally {
    randomMovieBtn.disabled = false;
    randomMovieBtn.textContent = translations[currentLang].randomButton;
  }
}

function displayRandomMovie(movie) {
  randomMovieResult.innerHTML = `
    <div class="random-movie-card">

      <div class="random-movie-poster">
        <img 
          src="${movie.Poster !== "N/A" ? movie.Poster : "no-poster.png"}" 
          alt="${movie.Title}"
        >
      </div>

      <div class="random-movie-info">
        <h3>${movie.Title}</h3>

        <p>
          <strong>${translations[currentLang].randomYear}:</strong> 
          ${movie.Year}
        </p>

        <p>
          <strong>${translations[currentLang].randomGenre}:</strong> 
          ${movie.Genre}
        </p>

        <p>
          <strong>${translations[currentLang].randomRuntime}:</strong> 
          ${movie.Runtime}
        </p>

        <p>
          <strong>${translations[currentLang].randomRating}:</strong> 
          ${movie.imdbRating}/10
        </p>

        <p>
          <strong>${translations[currentLang].randomPlot}:</strong> 
          ${movie.Plot}
        </p>
      </div>

    </div>
  `;
}

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

const translations = {
  en: {
    subtitle: "Search movies by multiple parameters",
    
    randomTitle: "Can’t decide what to watch?",
    randomText: "Click the button and get a random movie suggestion for today.",
    randomButton: "Pick a movie for me",
    randomEmpty: "Your movie suggestion will appear here.",
    randomLoading: "Choosing a movie...",
    randomError: "Sorry, we could not choose a movie right now.",
    randomYear: "Year",
    randomGenre: "Genre",
    randomRuntime: "Runtime",
    randomRating: "IMDb rating",
    randomPlot: "Plot",

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
    
    randomTitle: "Nie wiesz, co obejrzeć?",
    randomText: "Kliknij przycisk i wylosuj propozycję filmu na dziś.",
    randomButton: "Wylosuj film",
    randomEmpty: "Twoja propozycja filmu pojawi się tutaj.",
    randomLoading: "Losowanie filmu...",
    randomError: "Niestety, nie udało się teraz wylosować filmu.",
    randomYear: "Rok",
    randomGenre: "Gatunek",
    randomRuntime: "Czas trwania",
    randomRating: "Ocena IMDb",
    randomPlot: "Opis",

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


const intro = document.querySelector("#intro-screen");

setTimeout(() => {
  intro.classList.add("shake");
}, 900);

setTimeout(() => {
  intro.classList.add("hide-intro");
}, 1600);

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