// Your code here

// Global variables to be accessed in the functions

let allMovies = [];
let currentMovie = null;

// Fetch request to get movies

function getMovies() {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch("http://localhost:3000/films/", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      allMovies = result;
      movieList(result);
    })
    .catch((error) => console.error(error));
}
getMovies();

// Looping to access individual movies and their info

function movieList(movies) {
  const movieTitles = document.getElementById("films");
  let movieNames = "";

  for (let i = 0; i < movies.length; i++) {
    let movie = movies[i];
    movieNames =
      movieNames +
      `<li class="film item" onclick="movieClick(${i})">${movie.title}</li>`;
  }
  movieTitles.innerHTML = movieNames;
}

// DOM manipulation after clicking movie

function movieClick(i) {
  let poster = document.getElementById("poster");
  let selectedMovie = allMovies[i];
  poster.src = selectedMovie.poster;
  poster.alt = selectedMovie.title;

  movieInfo(selectedMovie.id);
}

function movieInfo(id) {
  let movieTitleInfo = document.getElementById("title");
  let runtimeInfo = document.getElementById("runtime");
  let descriptionInfo = document.getElementById("film-info");
  let showtimeInfo = document.getElementById("showtime");
  let remainingTicketsInfo = document.getElementById("ticket-num");

  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch(`http://localhost:3000/films/${id}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      movieTitleInfo.innerText = result.title;
      runtimeInfo.innerText = `${result.runtime} minutes`;
      descriptionInfo.innerText = result.description;
      showtimeInfo.innerText = result.showtime;
      remainingTicketsInfo.innerText = result.capacity - result.tickets_sold;

      currentMovie = result;
    })
    .catch((error) => console.error(error));
}

// Button click event listener and functionality

document.getElementById("buy-ticket").addEventListener("click", buttonClick);

function buttonClick() {
  let result = currentMovie;
  let remainingTickets = result.capacity - result.tickets_sold;
  let remainingTicketsInfo = document.getElementById("ticket-num");
  if (remainingTickets > 1) {
    ticketSale(result);
  } else {
    remainingTicketsInfo.innerText = "SOLD OUT !!!";
  }
}

function ticketSale(movie) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    title: movie.title,
    runtime: movie.runtime,
    capacity: movie.capacity,
    showtime: movie.showtime,
    tickets_sold: movie.tickets_sold + 1,
    description: movie.description,
    poster: movie.poster,
  });

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(`http://localhost:3000/films/${movie.id}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      movieInfo(movie.id);
    })
    .catch((error) => console.error(error));
}
