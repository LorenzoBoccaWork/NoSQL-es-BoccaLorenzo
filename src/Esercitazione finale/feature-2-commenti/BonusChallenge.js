// OIEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE
// QUI CI VA LA QUERY PER IL BONUS CHALLENGE
// Io implemento raccomandazioni collaborative: trovo utenti simili basati su commenti comuni e raccomando film che hanno commentato.
// UPPA UPPA 
// OIEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE

// Bonus 1: Dashboard Completa con $facet

db.movies.createIndex({ genres: 1 });
db.movies.createIndex({ directors: 1 });
db.movies.createIndex({ year: 1 });
db.comments.createIndex({ movie_id: 1 });

const year = 2020;

db.movies.aggregate([
  {
    $facet: {
      topGenres: [
        { $match: { genres: { $exists: true, $ne: [] } } },  // Riduci documenti senza genres
        { $unwind: "$genres" },
        {
          $group: {
            _id: "$genres",
            count: { $sum: 1 },
            avgRating: { $avg: "$imdb.rating" }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
        {
          $project: {
            genre: "$_id",
            count: 1,
            avgRating: { $round: ["$avgRating", 1] },
            _id: 0
          }
        }
      ],
      topDirectors: [
        { $match: { directors: { $exists: true, $ne: [] } } },  // Riduci documenti senza directors
        { $unwind: "$directors" },
        {
          $group: {
            _id: "$directors",
            count: { $sum: 1 },
            avgRating: { $avg: "$imdb.rating" }
          }
        },
        { $match: { count: { $gte: 3 } } },
        { $sort: { avgRating: -1 } },
        { $limit: 5 },
        {
          $project: {
            director: "$_id",
            count: 1,
            avgRating: { $round: ["$avgRating", 1] },
            _id: 0
          }
        }
      ],
      recentMovies: [
        { $match: { year: { $gte: year } } },  // Match precoce
        { $sort: { "imdb.rating": -1 } },
        { $limit: 10 },
        {
          $project: {
            title: 1,
            year: 1,
            "imdb.rating": 1,
            _id: 0
          }
        }
      ],
      commentStats: [
        // Usa una aggregation separata per evitare $lookup lento in $facet
        // (Opzionale: se vuoi mantenerlo, limita con $match su film recenti)
        { $match: { year: { $gte: 2000 } } },  // Riduci film per test
        {
          $lookup: {
            from: "comments",
            localField: "_id",
            foreignField: "movie_id",
            as: "comments"
          }
        },
        {
          $group: {
            _id: null,
            totalMovies: { $sum: 1 },
            totalComments: { $sum: { $size: "$comments" } },
            avgCommentsPerMovie: { $avg: { $size: "$comments" } }
          }
        },
        {
          $project: {
            totalMovies: 1,
            totalComments: 1,
            avgCommentsPerMovie: { $round: ["$avgCommentsPerMovie", 1] },
            _id: 0
          }
        }
      ]
    }
  }
], {
  allowDiskUse: true, 
  maxTimeMS: 300000    
}).toArray();

// Soluzione:

// [
//   {
//     topGenres: [ [Object], [Object], [Object], [Object], [Object] ],
//     topDirectors: [ [Object], [Object], [Object], [Object], [Object] ],
//     recentMovies: [],
//     commentStats: [ [Object] ]
//   }
// ]


// Bonus 2: Ottimizzazione con Indici

// Droppo l'indice esistente
db.movies.dropIndex("cast_text_fullplot_text_genres_text_title_text");

// Ricreo con i campi desiderati (senza genres)
db.movies.createIndex({
  title: "text",
  fullplot: "text",
  cast: "text"
});

// Poi eseguo questo comando

db.movies.createIndex({
  title: "text",
  fullplot: "text",
  cast: "text"
});

// Simula query di ricerca
const searchQuery = "the godfather"; 

db.movies.find(
  { $text: { $search: searchQuery } }, 
  {
    score: { $meta: "textScore" },  
    title: 1,
    year: 1,
    fullplot: { $substr: ["$fullplot", 0, 100] },  // Usa fullplot e tronca
    cast: { $slice: 3 },  // Primi 3 attori
    "imdb.rating": 1,
    _id: 0
  }
).sort({ score: { $meta: "textScore" } }).limit(20).toArray();

// Soluzione:

// [
//   {
//     imdb: { rating: 7.6 },
//     year: 1990,
//     title: 'The Godfather: Part III',
//     cast: [ 'Al Pacino', 'Diane Keaton', 'Talia Shire' ],
//     score: 1.178861788617886,
//     fullplot: 'In the final instalment of the Godfather Trilogy, an aging Don Michael Corleone seeks to legitimize '
//   },
//   {
//     title: 'Godfather',
//     cast: [ 'N.N. Pillai', 'Mukesh', 'Kanaka' ],
//     year: 1991,
//     imdb: { rating: 8.1 },
//     score: 1,
//     fullplot: 'Two rival clans under Anjooran and Achamma have a history of mutual hatred. Anjooran, convinced that'
//   },
//   {
//     imdb: { rating: 9.2 },
//     year: 1972,
//     title: 'The Godfather',
//     cast: [ 'Marlon Brando', 'Al Pacino', 'James Caan' ],
//     score: 1,
//     fullplot: 'When the aging head of a famous crime family decides to transfer his position to one of his subalter'
//   },
//   {
//     cast: [ 'Patrick Swayze', 'Om Puri', 'Pauline Collins' ],
//     title: 'City of Joy',
//     year: 1992,
//     imdb: { rating: 6.3 },
//     score: 0.8948863636363636,
//     fullplot: 'Hazari Pal lives in a small village in Bihar, India, with his dad, mom, wife, Kamla, daughter, Amrit'
//   },
//   {
//     cast: [ 'John Cazale', 'Steve Buscemi', 'Sam Rockwell' ],
//     title: 'I Knew It Was You: Rediscovering John Cazale',
//     year: 2009,
//     imdb: { rating: 7.9 },
//     score: 0.8017241379310345,
//     fullplot: 'John Cazale was in only five films - The Godfather, The Conversation, The Godfather, Part Two, Dog D'
//   },
//   {
//     cast: [ 'Tèru Emori', 'Aya Okamoto', 'Yoshiaki Umegaki' ],
//     title: 'Tokyo Godfathers',
//     year: 2003,
//     imdb: { rating: 7.9 },
//     score: 0.75,
//     fullplot: 'Christmas in Tokyo, Japan. Three homeless friends: a young girl, a transvestite, and a middle-aged b'
//   },
//   {
//     imdb: { rating: 9.1 },
//     year: 1974,
//     title: 'The Godfather: Part II',
//     cast: [ 'Al Pacino', 'Robert Duvall', 'Diane Keaton' ],
//     score: 0.6666666666666666,
//     fullplot: 'The continuing saga of the Corleone crime family tells the story of a young Vito Corleone growing up'
//   },
//   {
//     cast: [ 'Henry Hèbchen', 'Moritz Bleibtreu', 'Corinna Harfouch' ],
//     title: 'C(r)ook',
//     year: 2004,
//     imdb: { rating: 6.4 },
//     score: 0.5357142857142857,
//     fullplot: 'A killer for the Russian Mafia in Vienna wants to retire and write a book about his passion - cookin'
//   },
//   {
//     cast: [ 'Michael Eklund', 'Sara Canning', 'Christopher Heyerdahl' ],
//     title: 'Eadweard',
//     year: 2015,
//     imdb: { rating: 7.4 },
//     score: 0.5185185185185185,
//     fullplot: 'A psychological drama centered around world-famous turn-of-the-century photographer, Eadweard Muybri'
//   },
//   {
//     cast: [ 'Christian Slater', 'Rodney Eastman', 'Costas Mandylor' ],
//     title: 'Mobsters',
//     year: 1991,
//     imdb: { rating: 5.8 },
//     score: 0.515625,
//     fullplot: 'The story of a group of friends in turn of the century New York, from their early days as street hoo'
//   },
//   {
//     cast: [ 'Irrfan Khan', 'Tabu', 'Pankaj Kapur' ],
//     title: 'Maqbool',
//     year: 2003,
//     imdb: { rating: 8.2 },
//     score: 0.5128205128205128,
//     fullplot: 'Macbeth meets the Godfather in present-day Bombay. The Scottish tragedy set in the contemporary unde'
//   },
//   {
//     cast: [ 'Marlon Brando', 'Matthew Broderick', 'Bruno Kirby' ],
//     title: 'The Freshman',
//     year: 1990,
//     imdb: { rating: 6.5 },
//     score: 0.5116279069767442,
//     fullplot: 'Clark Kellogg is a young man starting his first year at film school in New York City. After a small '
//   },
//   {
//     cast: [ 'Eric McCormack', 'Carl Bressler', 'Ethan Glazer' ],
//     title: 'Free Enterprise',
//     year: 1998,
//     imdb: { rating: 7 },
//     score: 0.5092592592592593,
//     fullplot: 'Young filmmakers (Rafer Weigel, Eric McCormack) trying to hawk a movie titled "Bradykillers" about a'
//   },
//   {
//     cast: [ 'Laurence Fishburne', 'Tim Roth', 'Vanessa Williams' ],
//     title: 'Hoodlum',
//     year: 1997,
//     imdb: { rating: 6.2 },
//     score: 0.509090909090909,
//     fullplot: 'The film focuses on the war of two gangs in 1930s Harlem for the control of illegal gaming - one hea'
//   },
//   {
//     title: 'Above and Below',
//     year: 2015,
//     imdb: { rating: 7.4 },
//     score: 0.5089285714285714,
//     fullplot: 'From Mars to Earth and underneath. Above and Below is a rough and rhythmic roller coaster ride seati'
//   },
//   {
//     cast: [ 'Jerry Lewis', 'Ed Wynn', 'Judith Anderson' ],
//     title: 'Cinderfella',
//     year: 1960,
//     imdb: { rating: 5.9 },
//     score: 0.5083333333333333,
//     fullplot: "This was Jerry Lewis' answer to the classic Cinderella story. When his father dies, poor Fella is le"
//   },
//   {
//     cast: [ 'Greg Kinnear', 'Barry Pepper', 'Katie Holmes' ],
//     title: 'The Kennedys',
//     year: 2011,
//     imdb: { rating: 7.7 },
//     score: 0.5076923076923077,
//     fullplot: 'The story of the most fabled political family in American history, told in a manner similar to The G'
//   },
//   {
//     cast: [ 'Alice Cooper', 'Sheryl Cooper', 'Jack Curtis' ],
//     title: 'Super Duper Alice Cooper',
//     year: 2014,
//     imdb: { rating: 7.3 },
//     score: 0.5066666666666667,
//     fullplot: 'Super Duper Alice Cooper is the twisted tale of a teenage Dr Jekyll whose rock n roll Mr Hyde almost'
//   },
//   {
//     cast: [ 'Chadwick Boseman', 'Nelsan Ellis', 'Dan Aykroyd' ],
//     title: 'Get on Up',
//     year: 2014,
//     imdb: { rating: 6.9 },
//     score: 0.5059523809523809,
//     fullplot: 'On route to the stage, singer James Brown recalls a life with a turbulent childhood where music was '
//   },
//   {
//     imdb: { rating: 6.7 },
//     year: 1999,
//     title: 'Analyze This',
//     cast: [ 'Robert De Niro', 'Billy Crystal', 'Lisa Kudrow' ],
//     score: 0.5054347826086957,
//     fullplot: 'Ben Sobol, Psychiatrist, has a few problems: His son spies on his patients when they open up their h'
//   }
// ]


// Bonus 3: Indice Geospaziale

const userId = "roger_ashton-griffiths@gameofthron.es";

// Trova utenti simili basati su commenti comuni
const similarUsers = db.comments.aggregate([
  { $match: { email: userId } },
  {
    $lookup: {
      from: "comments",
      localField: "movie_id",
      foreignField: "movie_id",
      as: "otherComments"
    }
  },
  { $unwind: "$otherComments" },
  { $match: { "otherComments.email": { $ne: userId } } },
  {
    $group: {
      _id: "$otherComments.email",
      commonMovies: { $addToSet: "$movie_id" },
      similarity: { $sum: 1 }  // Numero commenti comuni
    }
  },
  { $match: { similarity: { $gte: 2 } } },  // Almeno 2 commenti comuni
  { $sort: { similarity: -1 } },
  { $limit: 5 }
]).toArray();

const similarUserIds = similarUsers.map(u => u._id);
const userCommentedMovies = db.comments.distinct("movie_id", { email: userId });

db.comments.aggregate([
  { $match: { email: { $in: similarUserIds }, movie_id: { $nin: userCommentedMovies } } },
  {
    $group: {
      _id: "$movie_id",
      recommenders: { $addToSet: "$email" },
      score: { $sum: 1 }  
    }
  },
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
      "imdb.rating": "$movie.imdb.rating",
      score: 1,
      recommenders: 1,
      _id: 0
    }
  },
  { $sort: { score: -1, "imdb.rating": -1 } },
  { $limit: 10 }
]).toArray();

// Soluzione:

// [
//   {
//     recommenders: [
//       'brandon_hardy@fakegmail.com',
//       'blake_sellers@fakegmail.com',
//       'tom_wlaschiha@gameofthron.es',
//       'nathalie_emmanuel@gameofthron.es',
//       'richard_dormer@gameofthron.es'
//     ],
//     score: 10,
//     title: 'Indiana Jones and the Last Crusade',
//     year: 1989,
//     imdb: { rating: 8.3 }
//   },
//   {
//     recommenders: [
//       'blake_sellers@fakegmail.com',
//       'nathalie_emmanuel@gameofthron.es'
//     ],
//     score: 8,
//     title: 'Madagascar',
//     year: 2005,
//     imdb: { rating: 6.9 }
//   },
//   {
//     recommenders: [
//       'brandon_hardy@fakegmail.com',
//       'blake_sellers@fakegmail.com',
//       'tom_wlaschiha@gameofthron.es',
//       'nathalie_emmanuel@gameofthron.es',
//       'richard_dormer@gameofthron.es'
//     ],
//     score: 8,
//     title: 'Drag Me to Hell',
//     year: 2009,
//     imdb: { rating: 6.6 }
//   },
//   {
//     recommenders: [
//       'brandon_hardy@fakegmail.com',
//       'blake_sellers@fakegmail.com',
//       'tom_wlaschiha@gameofthron.es',
//       'nathalie_emmanuel@gameofthron.es',
//       'richard_dormer@gameofthron.es'
//     ],
//     score: 7,
//     title: 'Cast Away',
//     year: 2000,
//     imdb: { rating: 7.7 }
//   },
//   {
//     recommenders: [
//       'brandon_hardy@fakegmail.com',
//       'tom_wlaschiha@gameofthron.es',
//       'nathalie_emmanuel@gameofthron.es',
//       'richard_dormer@gameofthron.es'
//     ],
//     score: 7,
//     title: 'The Waterboy',
//     year: 1998,
//     imdb: { rating: 6.1 }
//   },
//   {
//     recommenders: [
//       'richard_dormer@gameofthron.es',
//       'nathalie_emmanuel@gameofthron.es',
//       'blake_sellers@fakegmail.com',
//       'brandon_hardy@fakegmail.com'
//     ],
//     score: 6,
//     title: 'Dègkeselyè',
//     year: 1982,
//     imdb: { rating: 8.1 }
//   },
//   {
//     recommenders: [
//       'brandon_hardy@fakegmail.com',
//       'blake_sellers@fakegmail.com',
//       'nathalie_emmanuel@gameofthron.es',
//       'richard_dormer@gameofthron.es'
//     ],
//     score: 6,
//     title: 'The Chronicles of Narnia: The Lion, the Witch and the Wardrobe',
//     year: 2005,
//     imdb: { rating: 6.9 }
//   },
//   {
//     recommenders: [
//       'brandon_hardy@fakegmail.com',
//       'blake_sellers@fakegmail.com',
//       'tom_wlaschiha@gameofthron.es',
//       'nathalie_emmanuel@gameofthron.es'
//     ],
//     score: 6,
//     title: 'Wanted',
//     year: 2008,
//     imdb: { rating: 6.7 }
//   },
//   {
//     recommenders: [
//       'richard_dormer@gameofthron.es',
//       'tom_wlaschiha@gameofthron.es',
//       'nathalie_emmanuel@gameofthron.es',
//       'blake_sellers@fakegmail.com',
//       'brandon_hardy@fakegmail.com'
//     ],
//     score: 6,
//     title: 'War of the Worlds',
//     year: 2005,
//     imdb: { rating: 6.5 }
//   },
//   {
//     recommenders: [
//       'brandon_hardy@fakegmail.com',
//       'blake_sellers@fakegmail.com',
//       'nathalie_emmanuel@gameofthron.es',
//       'richard_dormer@gameofthron.es'
//     ],
//     score: 6,
//     title: 'Twister',
//     year: 1996,
//     imdb: { rating: 6.3 }
//   }
// ]