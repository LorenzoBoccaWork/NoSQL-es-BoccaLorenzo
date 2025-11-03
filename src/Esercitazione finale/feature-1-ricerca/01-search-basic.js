// ### 1.1
// Io cerco film per titolo usando una parola chiave come "godfather", ignorando maiuscole e minuscole, e mostro i primi 20 film ordinati per rating decrescente.

const searchTerm = "godfather"; 
db.movies.find(
  { title: { $regex: new RegExp(searchTerm, "i") } },
  { title: 1, year: 1, poster: 1, "imdb.rating": 1, _id: 0 }
).sort({ "imdb.rating": -1 }).limit(20);

// Soluzione:
// {
//   imdb: {
//     rating: 9.2
//   },
//   year: 1972,
//   title: 'The Godfather',
//   poster: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SY1000_SX677_AL_.jpg'
// }
// {
//   imdb: {
//     rating: 9.1
//   },
//   year: 1974,
//   title: 'The Godfather: Part II',
//   poster: 'https://m.media-amazon.com/images/M/MV5BMWMwMGQzZTItY2JlNC00OWZiLWIyMDctNDk2ZDQ2YjRjMWQ0XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SY1000_SX677_AL_.jpg'
// }
// {
//   title: 'Godfather',
//   year: 1991,
//   imdb: {
//     rating: 8.1
//   }
// }
// {
//   poster: 'https://m.media-amazon.com/images/M/MV5BZmUyOTBkNjgtYjIzMi00ZTk1LWE4MDAtOWVmMzVhMzFjMTEwL2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyMzM4MjM0Nzg@._V1_SY1000_SX677_AL_.jpg',
//   title: 'Tokyo Godfathers',
//   year: 2003,
//   imdb: {
//     rating: 7.9
//   }
// }
// {
//   imdb: {
//     rating: 7.6
//   },
//   year: 1990,
//   title: 'The Godfather: Part III',
//   poster: 'https://m.media-amazon.com/images/M/MV5BNTc1YjhiNzktMjEyNS00YmNhLWExYjItZDhkNWJjZjYxOWZiXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SY1000_SX677_AL_.jpg'
// }

// ### 1.2
// Io filtro i film per genere, anno, rating, paese, lingua, pagina e ordino per campo scelto, mostrando 20 risultati per pagina.

const params = {
  genre: "Drama",  // Opzionale
  yearFrom: 2010,  // Opzionale
  yearTo: 2020,    // Opzionale
  minRating: 7.5,  // Opzionale
  country: "USA",  // Opzionale
  language: null,  // Opzionale
  page: 1,         // Default 1
  limit: 20,       // Default 20
  sortBy: "imdb.rating",  // Default
  sortOrder: "desc"  // "asc" o "desc"
};

let filter = {};
if (params.genre) filter.genres = params.genre;
if (params.yearFrom || params.yearTo) {
  filter.year = {};
  if (params.yearFrom) filter.year.$gte = params.yearFrom;
  if (params.yearTo) filter.year.$lte = params.yearTo;
}
if (params.minRating) filter["imdb.rating"] = { $gte: params.minRating };
if (params.country) filter.countries = params.country;
if (params.language) filter.languages = params.language;


let sort = {};
sort[params.sortBy] = params.sortOrder === "asc" ? 1 : -1;

db.movies.find(filter, {
  title: 1,
  year: 1,
  genres: 1,
  poster: 1,
  "imdb.rating": 1,
  countries: 1,
  _id: 0
}).sort(sort).skip((params.page - 1) * params.limit).limit(params.limit)
.toArray();

// Soluzione:
// [
//   {
//     genres: [ 'Documentary', 'Drama', 'News' ],
//     poster: 'https://m.media-amazon.com/images/M/MV5BNTgxMDI4MjY1N15BMl5BanBnXkFtZTgwNDQxNjY3MzE@._V1_SY1000_SX677_AL_.jpg',
//     title: 'Most Likely to Succeed',
//     year: 2015,
//     imdb: { rating: 8.9 },
//     countries: [ 'USA' ]
//   },
//   {
//     genres: [ 'Documentary', 'Drama' ],
//     poster: 'https://m.media-amazon.com/images/M/MV5BMTUxMjM5MDUyMF5BMl5BanBnXkFtZTgwNDMyODQwNDE@._V1_SY1000_SX677_AL_.jpg',
//     title: 'Killswitch',
//     year: 2014,
//     imdb: { rating: 8.8 },
//     countries: [ 'USA' ]
//   },
//   {
//     imdb: { rating: 8.7 },
//     year: 2014,
//     genres: [ 'Adventure', 'Drama', 'Sci-Fi' ],
//     title: 'Interstellar',
//     poster: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SY1000_SX677_AL_.jpg',
//     countries: [ 'USA', 'UK', 'Canada' ]
//   },
//   {
//     genres: [ 'Documentary', 'Adventure', 'Drama' ],
//     poster: 'https://m.media-amazon.com/images/M/MV5BMTUxMzk0MjY4M15BMl5BanBnXkFtZTgwMjMyNjQxNDE@._V1_SY1000_SX677_AL_.jpg',
//     title: 'The Great Alone',
//     year: 2015,
//     imdb: { rating: 8.7 },
//     countries: [ 'USA' ]
//   },
//   {
//     imdb: { rating: 8.6 },
//     year: 2014,
//     genres: [ 'Drama', 'Music' ],
//     title: 'Whiplash',
//     poster: 'https://m.media-amazon.com/images/M/MV5BOTA5NDZlZGUtMjAxOS00YTRkLTkwYmMtYWQ0NWEwZDZiNjEzXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SY1000_SX677_AL_.jpg',
//     countries: [ 'USA' ]
//   },
//   {
//     genres: [ 'Drama' ],
//     title: 'The Letters',
//     poster: 'https://m.media-amazon.com/images/M/MV5BMTYyMzg0Njg5MV5BMl5BanBnXkFtZTgwOTQ3MTkwNjE@._V1_SY1000_SX677_AL_.jpg',
//     countries: [ 'USA' ],
//     year: 2014,
//     imdb: { rating: 8.5 }
//   },
//   {
//     genres: [ 'Drama', 'War' ],
//     poster: 'https://m.media-amazon.com/images/M/MV5BMTYwMzMzMDI0NF5BMl5BanBnXkFtZTgwNDQ3NjI3NjE@._V1_SY1000_SX677_AL_.jpg',
//     title: 'Beasts of No Nation',
//     year: 2015,
//     imdb: { rating: 8.5 },
//     countries: [ 'USA' ]
//   },
//   {
//     genres: [ 'Short', 'Comedy', 'Drama' ],
//     poster: 'https://m.media-amazon.com/images/M/MV5BMTc3ODQ5MzgwMF5BMl5BanBnXkFtZTcwMDI3NTQ5OQ@@._V1_SY1000_SX677_AL_.jpg',
//     title: "Fool's Day",
//     year: 2013,
//     imdb: { rating: 8.4 },
//     countries: [ 'USA' ]
//   },
//   {
//     genres: [ 'Biography', 'Drama' ],
//     poster: 'https://m.media-amazon.com/images/M/MV5BMjQwOTQ4NDk5OF5BMl5BanBnXkFtZTcwNzM0Mjk3Mw@@._V1_SY1000_SX677_AL_.jpg',
//     title: 'Temple Grandin',
//     year: 2010,
//     imdb: { rating: 8.4 },
//     countries: [ 'USA' ]
//   },
//   {
//     genres: [ 'Comedy', 'Drama', 'Family' ],
//     title: "Good Ol' Boy",
//     year: 2015,
//     imdb: { rating: 8.4 },
//     countries: [ 'USA' ]
//   },
//   {
//     genres: [ 'Drama' ],
//     title: 'Out of My Hand',
//     year: 2015,
//     imdb: { rating: 8.4 },
//     countries: [ 'USA', 'Liberia' ]
//   },
//   {
//     genres: [ 'Drama' ],
//     poster: 'https://m.media-amazon.com/images/M/MV5BMjIzOTk4NzMzMV5BMl5BanBnXkFtZTgwMTczMzY4MjE@._V1_SY1000_SX677_AL_.jpg',
//     title: 'Olive Kitteridge',
//     year: 2014,
//     imdb: { rating: 8.4 },
//     countries: [ 'USA' ]
//   },
//   {
//     genres: [ 'Animation', 'Short', 'Drama' ],
//     title: "It's Such a Beautiful Day",
//     countries: [ 'USA' ],
//     year: 2011,
//     imdb: { rating: 8.4 }
//   },
//   {
//     genres: [ 'Biography', 'Comedy', 'Drama' ],
//     poster: 'https://m.media-amazon.com/images/M/MV5BMTQ4ODgxMDY3NF5BMl5BanBnXkFtZTgwNjIwMzI2MTE@._V1_SY1000_SX677_AL_.jpg',
//     title: '700 Sundays',
//     year: 2014,
//     imdb: { rating: 8.3 },
//     countries: [ 'USA' ]
//   },
//   {
//     genres: [ 'Animation', 'Comedy', 'Drama' ],
//     poster: 'https://m.media-amazon.com/images/M/MV5BM2Y0YjBiNjAtZjMwZS00ZGY4LWE0MWItMGE5MWI3ZWRmODAyXkEyXkFqcGdeQXVyMjM5NDU5ODY@._V1_SY1000_SX677_AL_.jpg',
//     title: "It's Such a Beautiful Day",
//     year: 2012,
//     imdb: { rating: 8.3 },
//     countries: [ 'USA' ]
//   },
//   {
//     genres: [ 'Documentary', 'Drama' ],
//     poster: 'https://m.media-amazon.com/images/M/MV5BMjAyMDgzMjE4OV5BMl5BanBnXkFtZTgwOTE1MTQyMjE@._V1_SY1000_SX677_AL_.jpg',
//     title: 'Evaporating Borders',
//     year: 2014,
//     imdb: { rating: 8.3 },
//     countries: [ 'Cyprus', 'USA' ]
//   },
//   {
//     genres: [ 'Comedy', 'Drama' ],
//     title: 'Hello, My Name Is Frank',
//     poster: 'https://m.media-amazon.com/images/M/MV5BMjIwMzU4MDk3NF5BMl5BanBnXkFtZTgwNjk2NDgwNzE@._V1_SY1000_SX677_AL_.jpg',
//     countries: [ 'USA' ],
//     year: 2014,
//     imdb: { rating: 8.3 }
//   },
//   {
//     genres: [ 'Drama' ],
//     poster: 'https://m.media-amazon.com/images/M/MV5BMjM1Nzc1MTM4MV5BMl5BanBnXkFtZTgwMjU0MTc2NjE@._V1_SY1000_SX677_AL_.jpg',
//     title: 'East Side Sushi',
//     year: 2014,
//     imdb: { rating: 8.3 },
//     countries: [ 'USA' ]
//   },
//   {
//     genres: [ 'Drama' ],
//     title: 'Meadowland',
//     year: 2015,
//     imdb: { rating: 8.3 },
//     countries: [ 'USA' ]
//   },
//   {
//     genres: [ 'Drama' ],
//     title: 'Calloused Hands',
//     countries: [ 'USA' ],
//     year: 2013,
//     imdb: { rating: 8.3 }
//   }
// ]

//### 1.3
// Io cerco film per regista o attore usando match parziale, filtro per awards minimi, ordino per awards poi rating, limito a 30.

const params = {
  director: "Spielberg",  // Opzionale, match parziale
  actor: "Tom Hanks",     // Opzionale, match parziale
  minAwards: 10           // Opzionale
};

let filter = {};
if (params.director) filter.directors = { $regex: new RegExp(params.director, "i") };
if (params.actor) filter.cast = { $regex: new RegExp(params.actor, "i") };
if (params.minAwards) filter["awards.wins"] = { $gte: params.minAwards };
db.movies.find(filter, {
  title: 1,
  year: 1,
  directors: 1,
  cast: { $slice: 3 },  // Primi 3 attori
  "awards.wins": 1,
  "awards.nominations": 1,
  "imdb.rating": 1,
  poster: 1,
  _id: 0
}).sort({ "awards.wins": -1, "imdb.rating": -1 }).limit(30)
.toArray();

// Soluzione:
// [
//   {
//     imdb: { rating: 8.6 },
//     year: 1998,
//     title: 'Saving Private Ryan',
//     poster: 'https://m.media-amazon.com/images/M/MV5BZjhkMDM4MWItZTVjOC00ZDRhLThmYTAtM2I5NzBmNmNlMzI1XkEyXkFqcGdeQXVyNDYyMDk5MTU@._V1_SY1000_SX677_AL_.jpg',
//     awards: { wins: 83, nominations: 66 },
//     cast: [ 'Tom Hanks', 'Tom Sizemore', 'Edward Burns' ],
//     directors: [ 'Steven Spielberg' ]
//   },
//   {
//     imdb: { rating: 8 },
//     year: 2002,
//     title: 'Catch Me If You Can',
//     poster: 'https://m.media-amazon.com/images/M/MV5BMTY5MzYzNjc5NV5BMl5BanBnXkFtZTYwNTUyNTc2._V1_SY1000_SX677_AL_.jpg',
//     awards: { wins: 15, nominations: 27 },
//     cast: [ 'Leonardo DiCaprio', 'Tom Hanks', 'Christopher Walken' ],
//     directors: [ 'Steven Spielberg' ]
//   }
// ]

// ### 1.4