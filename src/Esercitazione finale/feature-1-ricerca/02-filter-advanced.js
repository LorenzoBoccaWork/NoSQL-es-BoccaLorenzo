// ### 2.1
// Io prendo un film specifico e aggiungo i commenti più recenti usando lookup, ordinandoli per data decrescente e limitandoli a 10.

const movieId = ObjectId("573a1390f29313caabcd4135");  
const limit = 10;  
db.movies.aggregate([
  { $match: { _id: movieId } },
  {
    $lookup: {
      from: "comments",
      let: { movieId: "$_id" },
      pipeline: [
        { $match: { $expr: { $eq: ["$movie_id", "$$movieId"] } } },
        { $sort: { date: -1 } },
        { $limit: limit },
        { $project: { name: 1, text: 1, date: 1, _id: 0 } }
      ],
      as: "comments"
    }
  },
  {
    $addFields: {
      totalComments: { $size: "$comments" }  
    }
  },
  {
    $project: {
      title: 1,
      year: 1,
      plot: 1,
      genres: 1,
      cast: 1,
      directors: 1,
      ratings: 1,  
      comments: 1,
      totalComments: 1,
      _id: 0
    }
  }
]).toArray();

// Soluzione:
// []

// ### 2.2
// Io conto i commenti per ogni film, li ordino per numero di commenti decrescente, e mostro i film più commentati con lookup.

const limit = 20;  // Simula query param

db.comments.aggregate([
  {
    $group: {
      _id: "$movie_id",
      commentCount: { $sum: 1 },
      lastCommentDate: { $max: "$date" }
    }
  },
  { $match: { commentCount: { $gte: 1 } } },  // Ridondante ma esplicito
  {
    $lookup: {
      from: "movies",
      localField: "_id",
      foreignField: "_id",
      as: "movie"
    }
  },
  { $unwind: "$movie" },
  {
    $project: {
      title: "$movie.title",
      year: "$movie.year",
      poster: "$movie.poster",
      genres: "$movie.genres",
      "imdb.rating": "$movie.imdb.rating",
      commentCount: 1,
      lastCommentDate: 1,
      _id: 0
    }
  },
  { $sort: { commentCount: -1 } },
  { $limit: limit }
]).toArray();

// Soluzione:

// [
//   {
//     commentCount: 161,
//     lastCommentDate: 2017-06-28T02:28:25.000Z,
//     title: 'The Taking of Pelham 1 2 3',
//     year: 2009,
//     poster: 'https://m.media-amazon.com/images/M/MV5BMTU3NzA4MDcwNV5BMl5BanBnXkFtZTcwMDAyNzc1Mg@@._V1_SY1000_SX677_AL_.jpg',
//     genres: [ 'Action', 'Crime', 'Thriller' ],
//     imdb: { rating: 6.4 }
//   },
//   {
//     commentCount: 158,
//     lastCommentDate: 2017-09-10T06:24:48.000Z,
//     title: 'Terminator Salvation',
//     year: 2009,
//     poster: 'https://m.media-amazon.com/images/M/MV5BODE1MTM1MzA2NF5BMl5BanBnXkFtZTcwODQ5MTA2Mg@@._V1_SY1000_SX677_AL_.jpg',
//     genres: [ 'Action', 'Sci-Fi' ],
//     imdb: { rating: 6.7 }
//   },
//   {
//     commentCount: 158,
//     lastCommentDate: 2017-04-29T22:31:26.000Z,
//     title: 'About a Boy',
//     year: 2002,
//     poster: 'https://m.media-amazon.com/images/M/MV5BMTQ2Mzg4MDAzNV5BMl5BanBnXkFtZTgwMjcxNTYxMTE@._V1_SY1000_SX677_AL_.jpg',
//     genres: [ 'Comedy', 'Drama', 'Romance' ],
//     imdb: { rating: 7.1 }
//   },
//   {
//     commentCount: 158,
//     lastCommentDate: 2017-09-08T07:54:03.000Z,
//     title: '50 First Dates',
//     year: 2004,
//     poster: 'https://m.media-amazon.com/images/M/MV5BMjAwMzc4MDgxNF5BMl5BanBnXkFtZTYwNjUwMzE3._V1_SY1000_SX677_AL_.jpg',
//     genres: [ 'Comedy', 'Romance' ],
//     imdb: { rating: 6.8 }
//   },
//   {
//     commentCount: 158,
//     lastCommentDate: 2017-09-06T02:51:38.000Z,
//     title: "Ocean's Eleven",
//     year: 2001,
//     poster: 'https://m.media-amazon.com/images/M/MV5BYzVmYzVkMmUtOGRhMi00MTNmLThlMmUtZTljYjlkMjNkMjJkXkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_SY1000_SX677_AL_.jpg',
//     genres: [ 'Crime', 'Thriller' ],
//     imdb: { rating: 7.8 }
//   },
//   {
//     commentCount: 157,
//     lastCommentDate: 2017-06-10T23:58:07.000Z,
//     title: 'The Mummy',
//     year: 1999,
//     poster: 'https://m.media-amazon.com/images/M/MV5BOTJiYjBhZDgtMjhiOC00MTIzLThlNGMtMmI1NjIwM2M3YTI5XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SY1000_SX677_AL_.jpg',
//     genres: [ 'Action', 'Adventure', 'Fantasy' ],
//     imdb: { rating: 7 }
//   },
//   {
//     commentCount: 157,
//     lastCommentDate: 2017-02-21T00:38:02.000Z,
//     title: 'Sherlock Holmes',
//     year: 2009,
//     poster: 'https://m.media-amazon.com/images/M/MV5BMTg0NjEwNjUxM15BMl5BanBnXkFtZTcwMzk0MjQ5Mg@@._V1_SY1000_SX677_AL_.jpg',
//     genres: [ 'Action', 'Adventure', 'Crime' ],
//     imdb: { rating: 7.6 }
//   },
//   {
//     commentCount: 155,
//     lastCommentDate: 2017-09-07T11:19:02.000Z,
//     title: 'Hellboy II: The Golden Army',
//     year: 2008,
//     poster: 'https://m.media-amazon.com/images/M/MV5BMjA5NzgyMjc2Nl5BMl5BanBnXkFtZTcwOTU3MDI3MQ@@._V1_SY1000_SX677_AL_.jpg',
//     genres: [ 'Action', 'Adventure', 'Fantasy' ],
//     imdb: { rating: 7 }
//   },
//   {
//     commentCount: 154,
//     lastCommentDate: 2017-08-09T21:19:21.000Z,
//     title: 'Anchorman: The Legend of Ron Burgundy',
//     year: 2004,
//     poster: 'https://m.media-amazon.com/images/M/MV5BMTQ2MzYwMzk5Ml5BMl5BanBnXkFtZTcwOTI4NzUyMw@@._V1_SY1000_SX677_AL_.jpg',
//     genres: [ 'Comedy' ],
//     imdb: { rating: 7.3 }
//   },
//   {
//     commentCount: 154,
//     lastCommentDate: 2017-08-18T11:42:31.000Z,
//     title: 'The Mummy Returns',
//     year: 2001,
//     poster: 'https://m.media-amazon.com/images/M/MV5BMjE2NzU1NTk2MV5BMl5BanBnXkFtZTgwMjIwMzcxMTE@._V1_SY1000_SX677_AL_.jpg',
//     genres: [ 'Action', 'Adventure', 'Fantasy' ],
//     imdb: { rating: 6.3 }
//   },
//   {
//     commentCount: 153,
//     lastCommentDate: 2017-06-26T21:04:20.000Z,
//     title: "Pirates of the Caribbean: At World's End",
//     year: 2007,
//     poster: 'https://m.media-amazon.com/images/M/MV5BMjIyNjkxNzEyMl5BMl5BanBnXkFtZTYwMjc3MDE3._V1_SY1000_SX677_AL_.jpg',
//     genres: [ 'Action', 'Adventure', 'Fantasy' ],
//     imdb: { rating: 7.1 }
//   },
//   {
//     commentCount: 153,
//     lastCommentDate: 2017-06-27T18:11:25.000Z,
//     title: 'Cinderella',
//     year: 1950,
//     poster: 'https://m.media-amazon.com/images/M/MV5BMWE3NzMxZTYtZTUyYi00ZTMzLTg2MzEtZjg0NGM3ZDJjZDg2XkEyXkFqcGdeQXVyNDE5MTU2MDE@._V1_SY1000_SX677_AL_.jpg',
//     genres: [ 'Animation', 'Family', 'Fantasy' ],
//     imdb: { rating: 7.3 }
//   },
//   {
//     commentCount: 153,
//     lastCommentDate: 2017-07-28T21:20:10.000Z,
//     title: 'American Pie',
//     year: 1999,
//     poster: 'https://m.media-amazon.com/images/M/MV5BMTg3ODY5ODI1NF5BMl5BanBnXkFtZTgwMTkxNTYxMTE@._V1_SY1000_SX677_AL_.jpg',
//     genres: [ 'Comedy', 'Romance' ],
//     imdb: { rating: 7 }
//   },
//   {
//     commentCount: 153,
//     lastCommentDate: 2017-01-01T14:57:38.000Z,
//     title: 'X-Men',
//     year: 2000,
//     poster: 'https://m.media-amazon.com/images/M/MV5BZmIyMDk5NGYtYjQ5NS00ZWQxLTg2YzQtZDk1ZmM4ZDBlN2E3XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SY1000_SX677_AL_.jpg',
//     genres: [ 'Action', 'Adventure', 'Sci-Fi' ],
//     imdb: { rating: 7.4 }
//   },
//   {
//     commentCount: 153,
//     lastCommentDate: 2017-09-09T02:21:31.000Z,
//     title: 'Mission: Impossible',
//     year: 1996,
//     poster: 'https://m.media-amazon.com/images/M/MV5BMTc3NjI2MjU0Nl5BMl5BanBnXkFtZTgwNDk3ODYxMTE@._V1_SY1000_SX677_AL_.jpg',
//     genres: [ 'Action', 'Adventure', 'Thriller' ],
//     imdb: { rating: 7.1 }
//   },
//   {
//     commentCount: 153,
//     lastCommentDate: 2016-07-08T03:30:22.000Z,
//     title: 'E.T. the Extra-Terrestrial',
//     year: 1982,
//     poster: 'https://m.media-amazon.com/images/M/MV5BMTQ2ODFlMDAtNzdhOC00ZDYzLWE3YTMtNDU4ZGFmZmJmYTczXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SY1000_SX677_AL_.jpg',
//     genres: [ 'Family', 'Sci-Fi' ],
//     imdb: { rating: 7.9 }
//   },
//   {
//     commentCount: 153,
//     lastCommentDate: 2017-02-04T16:57:23.000Z,
//     title: 'Bruce Almighty',
//     year: 2003,
//     poster: 'https://m.media-amazon.com/images/M/MV5BNzMyZDhiZDUtYWUyMi00ZDQxLWE4NDQtMWFlMjI1YjVjMjZiXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SY1000_SX677_AL_.jpg',
//     genres: [ 'Comedy', 'Drama', 'Fantasy' ],
//     imdb: { rating: 6.7 }
//   },
//   {
//     commentCount: 153,
//     lastCommentDate: 2017-05-26T22:12:34.000Z,
//     title: 'Wanted',
//     year: 2008,
//     poster: 'https://m.media-amazon.com/images/M/MV5BMTQwNDM2MTMwMl5BMl5BanBnXkFtZTgwMjE4NjQxMTE@._V1_SY1000_SX677_AL_.jpg',
//     genres: [ 'Action', 'Crime', 'Fantasy' ],
//     imdb: { rating: 6.7 }
//   },
//   {
//     commentCount: 152,
//     lastCommentDate: 2016-09-27T16:49:04.000Z,
//     title: 'Gladiator',
//     year: 2000,
//     poster: 'https://m.media-amazon.com/images/M/MV5BMDliMmNhNDEtODUyOS00MjNlLTgxODEtN2U3NzIxMGVkZTA1L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SY1000_SX677_AL_.jpg',
//     genres: [ 'Action', 'Drama' ],
//     imdb: { rating: 8.5 }
//   },
//   {
//     commentCount: 152,
//     lastCommentDate: 2017-09-06T12:52:03.000Z,
//     title: 'The Ring',
//     year: 2002,
//     poster: 'https://m.media-amazon.com/images/M/MV5BNDA2NTg2NjE4Ml5BMl5BanBnXkFtZTYwMjYxMDg5._V1_SY1000_SX677_AL_.jpg',
//     genres: [ 'Horror', 'Mystery' ],
//     imdb: { rating: 7.1 }
//   }
// ]

// ### 2.3
// Io mostro statistiche e commenti recenti di un utente usando facet per combinare stats e cronologia.

const userId = "roger_ashton-griffiths@gameofthron.es";  // Esempio

db.comments.aggregate([
  { $match: { email: userId } },
  {
    $facet: {
      stats: [
        {
          $group: {
            _id: null,
            totalComments: { $sum: 1 },
            uniqueMovies: { $addToSet: "$movie_id" }
          }
        },
        {
          $project: {
            totalComments: 1,
            uniqueMoviesCount: { $size: "$uniqueMovies" },
            _id: 0
          }
        }
      ],
      recentComments: [
        { $sort: { date: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: "movies",
            localField: "movie_id",
            foreignField: "_id",
            as: "movie"
          }
        },
        { $unwind: "$movie" },
        {
          $project: {
            movieTitle: "$movie.title",
            movieYear: "$movie.year",
            commentText: "$text",
            commentDate: "$date",
            _id: 0
          }
        }
      ]
    }
  }
]).toArray();

// Soluzione:

// [
//   {
//     stats: [ [Object] ],
//     recentComments: [
//       [Object], [Object],
//       [Object], [Object],
//       [Object], [Object],
//       [Object], [Object],
//       [Object]
//     ]
//   }
// ]

