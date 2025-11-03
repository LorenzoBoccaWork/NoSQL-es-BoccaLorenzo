// ### 4.1
// Io calcolo un punteggio di similarità per film simili basandomi su generi, registi e cast, escludendo il film stesso.

const movieId = ObjectId("573a1390f29313caabcd4323"); 

const targetMovie = db.movies.findOne({ _id: movieId }, { genres: 1, directors: 1, cast: 1, _id: 0 });

if (!targetMovie) {
  print("Errore: Film non trovato. Usa un movieId valido.");
} else {
  db.movies.aggregate([
    { $match: { _id: { $ne: movieId } } },
    {
      $addFields: {
        similarityScore: {
          $add: [
            { $size: { $setIntersection: ["$genres", targetMovie.genres || []] } },  // Aggiungi || [] per sicurezza
            { $size: { $setIntersection: ["$directors", targetMovie.directors || []] } },
            { $size: { $setIntersection: ["$cast", targetMovie.cast || []] } }
          ]
        }
      }
    },
    { $match: { similarityScore: { $gt: 0 } } },
    {
      $project: {
        title: 1,
        year: 1,
        poster: 1,
        "imdb.rating": 1,
        genres: 1,
        similarityScore: 1,
        _id: 0
      }
    },
    { $sort: { similarityScore: -1, "imdb.rating": -1 } },
    { $limit: 10 }
  ]).toArray();
}

// Soluzione:

//Errore, film non trovato. Ciò vuol dire che servirebbe un ID valido presente nel database.

// ### 4.2
// Io trovo preferenze dell'utente dai commenti e raccomando film simili non commentati.

const userId = "roger_ashton-griffiths@gameofthron.es";

const commentedMovies = db.comments.distinct("movie_id", { email: userId });

if (commentedMovies.length === 0) {
  print("Errore: Utente senza commenti. Usa un userId con commenti.");
} else {
  const userPrefs = db.movies.aggregate([
    { $match: { _id: { $in: commentedMovies } } },
    {
      $group: {
        _id: null,
        genres: { $addToSet: "$genres" },
        directors: { $addToSet: "$directors" },
        cast: { $addToSet: "$cast" }
      }
    },
    { $project: { _id: 0 } }
  ]).toArray()[0];
  if (!userPrefs) {
    print("Errore: Nessuna preferenza trovata.");
  } else {
    const flatGenres = (userPrefs.genres || []).flat();
    const flatDirectors = (userPrefs.directors || []).flat();
    const flatCast = (userPrefs.cast || []).flat();

    db.movies.aggregate([
      { $match: { _id: { $nin: commentedMovies } } },  // Escludi già commentati
      {
        $addFields: {
          similarityScore: {
            $add: [
              { $size: { $setIntersection: ["$genres", flatGenres] } },
              { $size: { $setIntersection: ["$directors", flatDirectors] } },
              { $size: { $setIntersection: ["$cast", flatCast] } }
            ]
          }
        }
      },
      { $match: { similarityScore: { $gt: 0 } } },
      {
        $project: {
          title: 1,
          year: 1,
                 poster: 1,
          "imdb.rating": 1,
          similarityScore: 1,
          _id: 0
        }
      },
      { $sort: { similarityScore: -1, "imdb.rating": -1 } },
      { $limit: 10 }
    ]).toArray();
  }
}
// Soluzione:

// Non mi funziona :( !!!!!!!!!!!!!!!

// ### 4.3
// Io calcolo un punteggio nascosto per film sottovalutati basandomi su rating, commenti e awards, filtrando per rating alto e commenti bassi.

const limit = 20;

db.movies.aggregate([
  {
    $lookup: {
      from: "comments",
      localField: "_id",
      foreignField: "movie_id",
      as: "comments"
    }
  },
  {
    $addFields: {
      commentCount: { $size: "$comments" },
      hiddenScore: {
        $add: [
          { $multiply: ["$imdb.rating", 10] }, 
          { $divide: [1, { $add: ["$commentCount", 1] }] },  
          "$awards.wins"
        ]
      }
    }
  },
  { $match: { commentCount: { $lt: 50 }, "imdb.rating": { $gte: 7 } } },  // Filtri per "hidden"
  {
    $project: {
      title: 1,
      year: 1,
      poster: 1,
      "imdb.rating": 1,
      commentCount: 1,
      hiddenScore: { $round: ["$hiddenScore", 2] },
      _id: 0
    }
  },
  { $sort: { hiddenScore: -1 } },
  { $limit: limit }
]).toArray();

// Soluzione:
// Ci ha impiegato un po a generare i valori

// [
//   {
//     poster: 'https://m.media-amazon.com/images/M/MV5BNmM0MjdkMDQtMDMwMy00ZjE4LThjMDUtNjA4ZjkxYzM0MWRjXkEyXkFqcGdeQXVyMDI2NDg0NQ@@._V1_SY1000_SX677_AL_.jpg',
//     title: 'The Thief of Bagdad',
//     year: 1924,
//     imdb: { rating: 7.9 },
//     commentCount: 0,
//     hiddenScore: null
//   },
//   {
//     poster: 'https://m.media-amazon.com/images/M/MV5BMjIwMzA3MDAyNl5BMl5BanBnXkFtZTgwNzMyNTE1MjE@._V1_SY1000_SX677_AL_.jpg',
//     title: "Tol'able David",
//     year: 1921,
//     imdb: { rating: 8.1 },
//     commentCount: 0,
//     hiddenScore: null
//   },
//   {
//     poster: 'https://m.media-amazon.com/images/M/MV5BNzE1OWRlNDgtMTllNi00NTZiLWIyNTktYTk0MDY1ZWUwYTc5XkEyXkFqcGdeQXVyMjUxODE0MDY@._V1_SY1000_SX677_AL_.jpg',
//     title: 'From Hand to Mouth',
//     year: 1919,
//     imdb: { rating: 7 },
//     commentCount: 0,
//     hiddenScore: null
//   },
//   {
//     title: 'The Iron Horse',
//     poster: 'https://m.media-amazon.com/images/M/MV5BMGYwNjkxMmQtYzI1My00YzA4LTg2MGMtMjlmZjIzMWMwZDE1XkEyXkFqcGdeQXVyNjc1NTYyMjg@._V1_SY1000_SX677_AL_.jpg',
//     year: 1924,
//     imdb: { rating: 7.3 },
//     commentCount: 0,
//     hiddenScore: null
//   },
//   {
//     poster: 'https://m.media-amazon.com/images/M/MV5BYzRmMWIyNDEtYTRmYS00Y2FlLWJhOGUtYWZmNTI1YzZjOTc2L2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyMjUxODE0MDY@._V1_SY1000_SX677_AL_.jpg',
//     title: 'Robin Hood',
//     year: 1922,
//     imdb: { rating: 7.7 },
//     commentCount: 0,
//     hiddenScore: null
//   },
//   {
//     poster: 'https://m.media-amazon.com/images/M/MV5BOTU1ODQyYTctODhkNy00YWRmLWE2YzYtMTQ5ZjA3OTNiN2QyXkEyXkFqcGdeQXVyMzE0MjY5ODA@._V1_SY1000_SX677_AL_.jpg',
//     title: 'The Four Horsemen of the Apocalypse',
//     year: 1921,
//     imdb: { rating: 7.9 },
//     commentCount: 1,
//     hiddenScore: null
//   },
//   {
//     poster: 'https://m.media-amazon.com/images/M/MV5BMjA4OTYwMTcwM15BMl5BanBnXkFtZTcwNDEyNTkzMQ@@._V1_SY1000_SX677_AL_.jpg',
//     title: 'Wild Oranges',
//     year: 1924,
//     imdb: { rating: 7.1 },
//     commentCount: 1,
//     hiddenScore: null
//   },
//   {
//     poster: 'https://m.media-amazon.com/images/M/MV5BYzg2NjNhNTctMjUxMi00ZWU4LWI3ZjYtNTI0NTQxNThjZTk2XkEyXkFqcGdeQXVyNzg5OTk2OA@@._V1_SY1000_SX677_AL_.jpg',
//     title: 'Winsor McCay, the Famous Cartoonist of the N.Y. Herald and His Moving Comics',
//     year: 1911,
//     imdb: { rating: 7.3 },
//     commentCount: 0,
//     hiddenScore: null
//   },
//   {
//     poster: 'https://m.media-amazon.com/images/M/MV5BMTk2NDkxMTY1Nl5BMl5BanBnXkFtZTgwNDI1NDU5MTE@._V1_SY1000_SX677_AL_.jpg',
//     title: 'Foolish Wives',
//     year: 1922,
//     imdb: { rating: 7.3 },
//     commentCount: 0,
//     hiddenScore: null
//   },
//   {
//     poster: 'https://m.media-amazon.com/images/M/MV5BODliMjc3ODctYjhlOC00MDM5LTgzNmUtMjQ1MmViNDQ0NzlhXkEyXkFqcGdeQXVyNTM3MDMyMDQ@._V1_SY1000_SX677_AL_.jpg',
//     title: 'High and Dizzy',
//     year: 1920,
//     imdb: { rating: 7 },
//     commentCount: 1,
//     hiddenScore: null
//   },
//   {
//     poster: 'https://m.media-amazon.com/images/M/MV5BOTEwMTA1OTc1NF5BMl5BanBnXkFtZTgwMzU1NjkwMjE@._V1_SY1000_SX677_AL_.jpg',
//     title: 'He Who Gets Slapped',
//     year: 1924,
//     imdb: { rating: 7.8 },
//     commentCount: 0,
//     hiddenScore: null
//   },
//   {
//     poster: 'https://m.media-amazon.com/images/M/MV5BMjI3OTEzODA4NF5BMl5BanBnXkFtZTgwODc0NDIwMjE@._V1_SY1000_SX677_AL_.jpg',
//     title: 'Three Ages',
//     year: 1923,
//     imdb: { rating: 7.2 },
//     commentCount: 0,
//     hiddenScore: null
//   },
//   {
//     poster: 'https://m.media-amazon.com/images/M/MV5BMTkwOTUyNDk1N15BMl5BanBnXkFtZTYwODI3MzI3._V1_SY1000_SX677_AL_.jpg',
//     title: 'The Ace of Hearts',
//     year: 1921,
//     imdb: { rating: 7 },
//     commentCount: 1,
//     hiddenScore: null
//   },
//   {
//     poster: 'https://m.media-amazon.com/images/M/MV5BODkwOTUxMDkyMV5BMl5BanBnXkFtZTgwOTA1MDQ0MjE@._V1_SY1000_SX677_AL_.jpg',
//     title: 'Peter Pan',
//     year: 1924,
//     imdb: { rating: 7.4 },
//     commentCount: 1,
//     hiddenScore: null
//   },
//   {
//     poster: 'https://m.media-amazon.com/images/M/MV5BMzgxODk1Mzk2Ml5BMl5BanBnXkFtZTgwMDg0NzkwMjE@._V1_SY1000_SX677_AL_.jpg',
//     title: 'The Perils of Pauline',
//     year: 1914,
//     imdb: { rating: 7.6 },
//     commentCount: 0,
//     hiddenScore: null
//   },
//   {
//     poster: 'https://m.media-amazon.com/images/M/MV5BMTY5MTY0MzY0Ml5BMl5BanBnXkFtZTgwNjE4NDAxMjE@._V1_SY1000_SX677_AL_.jpg',
//     title: 'Miss Lulu Bett',
//     year: 1921,
//     imdb: { rating: 7.2 },
//     commentCount: 0,
//     hiddenScore: null
//   },
//   {
//     poster: 'https://m.media-amazon.com/images/M/MV5BMTU3NjE5NzYtYTYyNS00MDVmLWIwYjgtMmYwYWIxZDYyNzU2XkEyXkFqcGdeQXVyNzQzNzQxNzI@._V1_SY1000_SX677_AL_.jpg',
//     title: 'The Great Train Robbery',
//     year: 1903,
//     imdb: { rating: 7.4 },
//     commentCount: 0,
//     hiddenScore: null
//   },
//   {
//     poster: 'https://m.media-amazon.com/images/M/MV5BMTQxNzI4ODQ3NF5BMl5BanBnXkFtZTgwNzY5NzMwMjE@._V1_SY1000_SX677_AL_.jpg',
//     title: 'Gertie the Dinosaur',
//     year: 1914,
//     imdb: { rating: 7.3 },
//     commentCount: 0,
//     hiddenScore: null
//   },
//   {
//     title: 'One Week',
//     year: 1920,
//     imdb: { rating: 8.3 },
//     commentCount: 0,
//     hiddenScore: null
//   },
//   {
//     poster: 'https://m.media-amazon.com/images/M/MV5BZjJiMTU2NGQtNWRkNi00ZjExLWExMTUtMmNkNTU0NzRlMTA3XkEyXkFqcGdeQXVyNjUwNzk3NDc@._V1_SY1000_SX677_AL_.jpg',
//     title: 'A Woman of Paris: A Drama of Fate',
//     year: 1923,
//     imdb: { rating: 7.1 },
//     commentCount: 1,
//     hiddenScore: null
//   }
// ]