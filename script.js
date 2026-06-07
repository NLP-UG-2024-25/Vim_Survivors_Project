const form = document.querySelector(".search-form");
const resultsSection = document.querySelector("#results");

const API_KEY = "b69b151";
const TMDB_API_KEY ="c30fe8b26335fd1d87b1d82a2c7bb887";

let currentPage = 1;


const genreMap = {
  "Action": 28,
  "Drama": 18,
  "Comedy": 35,
  "Sci-Fi": 878
};

const countryMap = {
  "USA": "US",
  "UK": "GB",
  "France": "FR",
  "Poland": "PL",
  "Japan": "JP"
};
  
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
  const country = document.getElementById("country").value;
  const sort = document.getElementById("sort").value;

if (!title && !year && director) {
  searchByDirectorTMDB(director);
  return;
}

if (!title && !year && cast) {
  searchByCastTMDB(cast);
  return;
}

if (
  !title &&
  !director &&
  !cast &&
  (
    year ||
    genre !== "Any" ||
    country !== "Any"
  )
) {

  searchAdvancedTMDB(
    year,
    genre,
    country
  );

  return;
}

async function searchByGenreTMDB(genre) {

  try {

    const genreId = genreMap[genre];

    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&sort_by=popularity.desc`
    );

    const data = await res.json();

    displayTMDBResults(data.results);
    
  } catch (err) {

    console.error(err);

    resultsSection.innerHTML = `
      <h2>Results</h2>
      <p>Error loading genre data.</p>
    `;
  }

}

async function searchByYearGenreTMDB(year, genre) {

  try {

    const genreId = genreMap[genre];

    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&primary_release_year=${year}&with_genres=${genreId}&sort_by=popularity.desc`
    );

    const data = await res.json();

    displayTMDBResults(data.results);

  } catch (err) {

    console.error(err);

    resultsSection.innerHTML = `
      <h2>Results</h2>
      <p>Error loading movies.</p>
    `;
  }
}

async function searchByCountryTMDB(country) {

  try {

    const countryCode = countryMap[country];

    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_origin_country=${countryCode}&sort_by=popularity.desc`
    );

    const data = await res.json();

    displayTMDBResults(data.results);

  } catch (err) {

    console.error(err);

    resultsSection.innerHTML = `
      <h2>Results</h2>
      <p>Error loading country data.</p>
    `;
  }

}

async function searchByCastTMDB(actorName) {

  try {

    const personResponse = await fetch(
      `https://api.themoviedb.org/3/search/person?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(actorName)}`
    );

    const personData = await personResponse.json();

    if (!personData.results.length) {

      resultsSection.innerHTML = `
        <h2>Results</h2>
        <p>Actor not found.</p>
      `;

      return;
    }

    const actorId = personData.results[0].id;

    const moviesResponse = await fetch(
      `https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=${TMDB_API_KEY}`
    );

    const moviesData = await moviesResponse.json();

    displayTMDBResults(moviesData.cast);

  } catch (err) {

    console.error(err);

    resultsSection.innerHTML = `
      <h2>Results</h2>
      <p>Error loading actor data.</p>
    `;
  }

}

async function searchByDirectorTMDB(directorName) {

  try {

    const personResponse = await fetch(
      `https://api.themoviedb.org/3/search/person?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(directorName)}`
    );

    const personData = await personResponse.json();

    if (!personData.results.length) {

      resultsSection.innerHTML = `
        <h2>Results</h2>
        <p>Director not found.</p>
      `;

      return;
    }

    const directorId = personData.results[0].id;

    const creditsResponse = await fetch(
      `https://api.themoviedb.org/3/person/${directorId}/movie_credits?api_key=${TMDB_API_KEY}`
    );

    const creditsData = await creditsResponse.json();

    const directedMovies = creditsData.crew.filter(movie =>
      movie.job === "Director"
    );

    displayTMDBResults(directedMovies);

  } catch (err) {

    console.error(err);

    resultsSection.innerHTML = `
      <h2>Results</h2>
      <p>Error loading director data.</p>
    `;
  }

}

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

const sort = document.getElementById("sort").value;

if (sort === "year_desc") {

  filteredMovies.sort((a, b) =>
    parseInt(b.Year) - parseInt(a.Year)
  );

}

if (sort === "year_asc") {

  filteredMovies.sort((a, b) =>
    parseInt(a.Year) - parseInt(b.Year)
  );

}

if (sort === "title") {

  filteredMovies.sort((a, b) =>
    a.Title.localeCompare(b.Title)
  );

}



if (filteredMovies.length === 0) {
  resultsSection.innerHTML = `
    <h2>Results</h2>
    <p>No movies match your filters.</p>
  `;
  return;
}


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

async function searchByYearTMDB(year, page = 1) {

  try {

    const res = await fetch(
  `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&primary_release_year=${year}&sort_by=popularity.desc&page=${page}`
);

    const data = await res.json();

displayTMDBResults(
  data.results,
  data.total_pages,
  (page) => searchByYearTMDB(year, page)
);

  } catch (err) {

    console.error(err);

    resultsSection.innerHTML = `
      <h2>Results</h2>
      <p>Error loading TMDb data.</p>
    `;
  }
}


async function searchAdvancedTMDB(
  year,
  genre,
  country,
  page = 1
) {

  try {

    let url =
      `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&page=${page}`;

    if (year) {
      url += `&primary_release_year=${year}`;
    }

    if (genre !== "Any") {
      url += `&with_genres=${genreMap[genre]}`;
    }

    if (country !== "Any") {
      url += `&with_origin_country=${countryMap[country]}`;
    }

    const res = await fetch(url);

    const data = await res.json();

    displayTMDBResults(
      data.results,
      data.total_pages,
      (page) =>
        searchAdvancedTMDB(
          year,
          genre,
          country,
          page
        )
    );

  } catch (err) {

    console.error(err);

    resultsSection.innerHTML = `
      <h2>Results</h2>
      <p>Error loading movies.</p>
    `;
  }
}

function displayTMDBResults(
  movies,
  totalPages = 1,
  searchFunction = null
) {

  if (!movies || movies.length === 0) {

    resultsSection.innerHTML = `
      <h2>Results</h2>
      <p>No movies found.</p>
    `;

    return;
  }
  const sort = document.getElementById("sort").value;

    if (sort === "year_desc") {
    movies.sort((a, b) =>
      new Date(b.release_date) - new Date(a.release_date)
    );
  }

  if (sort === "year_asc") {
    movies.sort((a, b) =>
      new Date(a.release_date) - new Date(b.release_date)
    );
  }

  if (sort === "title") {
    movies.sort((a, b) =>
      a.title.localeCompare(b.title)
    );
  }

 resultsSection.innerHTML = `
  <h2>Results</h2>

  <div class="netflix-grid">

    ${movies.map(movie => `

      <div class="netflix-card">

        <div class="poster">

          <img
            src="${
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "no-poster.png"
            }"
            alt="${movie.title}"
          >

          <div class="overlay">

            <div class="info">

              <h3>${movie.title}</h3>

              <p>${movie.release_date?.slice(0,4) || "Unknown"}</p>

            </div>

          </div>

        </div>

      </div>

    `).join("")}

  </div>

  <div class="pagination">

    <button id="prevPage"
      ${currentPage === 1 ? "disabled" : ""}>
      Previous
    </button>

    <span>Page ${currentPage}</span>

    <button id="nextPage"
      ${currentPage >= totalPages ? "disabled" : ""}>
      Next
    </button>

  </div>
`;

const prevBtn = document.getElementById("prevPage");
const nextBtn = document.getElementById("nextPage");

if (prevBtn && searchFunction) {
  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      searchFunction(currentPage);
    }
  });
}

if (nextBtn && searchFunction) {
  nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      searchFunction(currentPage);
    }
  });
}
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


