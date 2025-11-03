// ### 3.1
// Io espando i generi e calcolo statistiche per ogni genere, come numero film, rating medio e awards totali.

db.movies.aggregate([
  { $unwind: "$genres" },
  {
    $group: {
      _id: "$genres",
      movieCount: { $sum: 1 },
      avgRating: { $avg: "$imdb.rating" },
      totalAwards: { $sum: "$awards.wins" }
    }
  },
  {
    $project: {
      genre: "$_id",
      movieCount: 1,
      avgRating: { $round: ["$avgRating", 1] },
      totalAwards: 1,
      _id: 0
    }
  },
  { $sort: { movieCount: -1 } }
]).toArray();

// Soluzione:

// [
//   {
//     movieCount: 12385,
//     totalAwards: 62720,
//     genre: 'Drama',
//     avgRating: 6.8
//   },
//   {
//     movieCount: 6532,
//     totalAwards: 21230,
//     genre: 'Comedy',
//     avgRating: 6.5
//   },
//   {
//     movieCount: 3318,
//     totalAwards: 15286,
//     genre: 'Romance',
//     avgRating: 6.7
//   },
//   {
//     movieCount: 2457,
//     totalAwards: 9896,
//     genre: 'Crime',
//     avgRating: 6.7
//   },
//   {
//     movieCount: 2454,
//     totalAwards: 9377,
//     genre: 'Thriller',
//     avgRating: 6.3
//   },
//   {
//     movieCount: 2381,
//     totalAwards: 7758,
//     genre: 'Action',
//     avgRating: 6.3
//   },
//   {
//     movieCount: 1900,
//     totalAwards: 8659,
//     genre: 'Adventure',
//     avgRating: 6.5
//   },
//   {
//     movieCount: 1834,
//     totalAwards: 4807,
//     genre: 'Documentary',
//     avgRating: 7.4
//   },
//   {
//     movieCount: 1470,
//     totalAwards: 3066,
//     genre: 'Horror',
//     avgRating: 5.8
//   },
//   {
//     movieCount: 1269,
//     totalAwards: 8866,
//     genre: 'Biography',
//     avgRating: 7.1
//   },
//   {
//     movieCount: 1249,
//     totalAwards: 3513,
//     genre: 'Family',
//     avgRating: 6.3
//   },
//   {
//     movieCount: 1139,
//     totalAwards: 4434,
//     genre: 'Mystery',
//     avgRating: 6.5
//   },
//   {
//     movieCount: 1055,
//     totalAwards: 4422,
//     genre: 'Fantasy',
//     avgRating: 6.4
//   },
//   {
//     movieCount: 958,
//     totalAwards: 3839,
//     genre: 'Sci-Fi',
//     avgRating: 6.1
//   },
//   {
//     movieCount: 912,
//     totalAwards: 3741,
//     genre: 'Animation',
//     avgRating: 6.9
//   },
//   {
//     movieCount: 874,
//     totalAwards: 5523,
//     genre: 'History',
//     avgRating: 7.2
//   },
//   {
//     movieCount: 780,
//     totalAwards: 3517,
//     genre: 'Music',
//     avgRating: 6.9
//   },
//   { movieCount: 699, totalAwards: 3761, genre: 'War', avgRating: 7.1 },
//   {
//     movieCount: 442,
//     totalAwards: 1516,
//     genre: 'Short',
//     avgRating: 7.4
//   },
//   {
//     movieCount: 440,
//     totalAwards: 1753,
//     genre: 'Musical',
//     avgRating: 6.7
//   },
//   {
//     movieCount: 366,
//     totalAwards: 1402,
//     genre: 'Sport',
//     avgRating: 6.7
//   },
//   {
//     movieCount: 242,
//     totalAwards: 963,
//     genre: 'Western',
//     avgRating: 6.8
//   },
//   {
//     movieCount: 77,
//     totalAwards: 154,
//     genre: 'Film-Noir',
//     avgRating: 7.4
//   },
//   { movieCount: 44, totalAwards: 98, genre: 'News', avgRating: 7.3 },
//   { movieCount: 1, totalAwards: 5, genre: 'Talk-Show', avgRating: 7 }
// ]

// ### 3.2
// Io filtro film per anno e rating, espando paesi e calcolo statistiche per paese, ordinando per numero film.

db.movies.aggregate([
  { $match: { year: { $gte: 2000, $lte: 2020 }, "imdb.rating": { $gte: 7 } } },
  { $unwind: "$countries" },
  {
    $group: {
      _id: "$countries",
      movieCount: { $sum: 1 },
      avgRating: { $avg: "$imdb.rating" }
    }                
    },
    {
        $project: {                 
        country: "$_id",
        movieCount: 1,
        avgRating: { $round: ["$avgRating", 1] },
        _id: 0
    }
    },
    { $sort: { movieCount: -1 } }
]).toArray();

// Soluzione:

// [
//   { movieCount: 2041, country: 'USA', avgRating: 7.5 },
//   { movieCount: 688, country: 'UK', avgRating: 7.5 },
//   { movieCount: 594, country: 'France', avgRating: 7.4 },
//   { movieCount: 466, country: 'Germany', avgRating: 7.4 },
//   { movieCount: 262, country: 'Canada', avgRating: 7.5 },
//   { movieCount: 260, country: 'Japan', avgRating: 7.4 },
//   { movieCount: 231, country: 'India', avgRating: 7.7 },
//   { movieCount: 172, country: 'Italy', avgRating: 7.4 },
//   { movieCount: 146, country: 'Spain', avgRating: 7.4 },
//   { movieCount: 122, country: 'South Korea', avgRating: 7.4 },
//   { movieCount: 109, country: 'Belgium', avgRating: 7.3 },
//   { movieCount: 107, country: 'Denmark', avgRating: 7.4 },
//   { movieCount: 103, country: 'Sweden', avgRating: 7.4 },
//   { movieCount: 99, country: 'China', avgRating: 7.4 },
//   { movieCount: 99, country: 'Russia', avgRating: 7.4 },
//   { movieCount: 91, country: 'Brazil', avgRating: 7.5 },
//   { movieCount: 89, country: 'Netherlands', avgRating: 7.4 },
//   { movieCount: 87, country: 'Australia', avgRating: 7.5 },
//   { movieCount: 72, country: 'Hong Kong', avgRating: 7.4 },
//   { movieCount: 67, country: 'Poland', avgRating: 7.4 },
//   { movieCount: 59, country: 'Norway', avgRating: 7.4 },
//   { movieCount: 59, country: 'Switzerland', avgRating: 7.4 },
//   { movieCount: 55, country: 'Mexico', avgRating: 7.4 },
//   { movieCount: 55, country: 'Austria', avgRating: 7.5 },
//   { movieCount: 51, country: 'Argentina', avgRating: 7.5 },
//   { movieCount: 50, country: 'Turkey', avgRating: 7.6 },
//   { movieCount: 49, country: 'Czech Republic', avgRating: 7.5 },
//   { movieCount: 48, country: 'Israel', avgRating: 7.4 },
//   { movieCount: 47, country: 'Finland', avgRating: 7.5 },
//   { movieCount: 46, country: 'Ireland', avgRating: 7.5 },
//   { movieCount: 44, country: 'Iran', avgRating: 7.5 },
//   { movieCount: 42, country: 'Romania', avgRating: 7.5 },
//   { movieCount: 35, country: 'Hungary', avgRating: 7.5 },
//   { movieCount: 30, country: 'Taiwan', avgRating: 7.3 },
//   { movieCount: 30, country: 'Thailand', avgRating: 7.4 },
//   { movieCount: 30, country: 'Greece', avgRating: 7.7 },
//   { movieCount: 29, country: 'New Zealand', avgRating: 7.6 },
//   { movieCount: 27, country: 'South Africa', avgRating: 7.4 },
//   { movieCount: 26, country: 'Iceland', avgRating: 7.5 },
//   { movieCount: 24, country: 'Portugal', avgRating: 7.3 },
//   { movieCount: 21, country: 'Croatia', avgRating: 7.3 },
//   { movieCount: 18, country: 'Luxembourg', avgRating: 7.3 },
//   { movieCount: 18, country: 'Serbia', avgRating: 7.6 },
//   { movieCount: 17, country: 'United Arab Emirates', avgRating: 7.5 },
//   { movieCount: 16, country: 'Colombia', avgRating: 7.5 },
//   { movieCount: 16, country: 'Estonia', avgRating: 7.4 },
//   { movieCount: 16, country: 'Chile', avgRating: 7.4 },
//   { movieCount: 14, country: 'Slovenia', avgRating: 7.5 },
//   { movieCount: 13, country: 'Indonesia', avgRating: 7.7 },
//   { movieCount: 13, country: 'Bulgaria', avgRating: 7.4 },
//   { movieCount: 13, country: 'Philippines', avgRating: 7.3 },
//   { movieCount: 12, country: 'Latvia', avgRating: 7.6 },
//   { movieCount: 12, country: 'Ukraine', avgRating: 7.6 },
//   { movieCount: 12, country: 'Slovakia', avgRating: 7.4 },
//   { movieCount: 10, country: 'Lithuania', avgRating: 7.7 },
//   { movieCount: 9, country: 'Pakistan', avgRating: 7.7 },
//   { movieCount: 9, country: 'Singapore', avgRating: 7.4 },
//   { movieCount: 9, country: 'Bosnia and Herzegovina', avgRating: 7.5 },
//   { movieCount: 9, country: 'Egypt', avgRating: 7.7 },
//   { movieCount: 8, country: 'Georgia', avgRating: 7.6 },
//   { movieCount: 8, country: 'Iraq', avgRating: 7.8 },
//   { movieCount: 8, country: 'Morocco', avgRating: 7.4 },
//   { movieCount: 7, country: 'Uruguay', avgRating: 7.2 },
//   { movieCount: 7, country: 'Lebanon', avgRating: 7.4 },
//   { movieCount: 7, country: 'Kazakhstan', avgRating: 7.3 },
//   { movieCount: 5, country: 'Tanzania', avgRating: 7.4 },
//   { movieCount: 5, country: 'Cambodia', avgRating: 7.5 },
//   { movieCount: 5, country: 'Jordan', avgRating: 7.6 },
//   { movieCount: 5, country: 'Republic of Macedonia', avgRating: 7.5 },
//   { movieCount: 5, country: 'Ecuador', avgRating: 7.4 },
//   { movieCount: 5, country: 'Serbia and Montenegro', avgRating: 8 },
//   { movieCount: 5, country: 'Cuba', avgRating: 7.3 },
//   { movieCount: 5, country: 'Peru', avgRating: 7.7 },
//   { movieCount: 5, country: 'Palestine', avgRating: 7.3 },
//   { movieCount: 4, country: 'Kenya', avgRating: 7.7 },
//   { movieCount: 4, country: 'Malaysia', avgRating: 7.5 },
//   { movieCount: 4, country: 'Qatar', avgRating: 7.4 },
//   { movieCount: 4, country: 'Venezuela', avgRating: 7.5 },
//   { movieCount: 3, country: 'Dominican Republic', avgRating: 7.2 },
//   { movieCount: 3, country: 'Tunisia', avgRating: 7.5 },
//   { movieCount: 3, country: 'Panama', avgRating: 7.9 },
//   { movieCount: 3, country: 'Afghanistan', avgRating: 7.2 },
//   { movieCount: 3, country: 'Syria', avgRating: 7.3 },
//   { movieCount: 3, country: 'Nepal', avgRating: 7.8 },
//   { movieCount: 3, country: 'Vietnam', avgRating: 7.2 },
//   { movieCount: 2, country: 'Bangladesh', avgRating: 7.8 },
//   { movieCount: 2, country: 'North Korea', avgRating: 7.4 },
//   { movieCount: 2, country: 'Liberia', avgRating: 7.9 },
//   { movieCount: 2, country: 'Albania', avgRating: 7.5 },
//   { movieCount: 2, country: 'Haiti', avgRating: 8 },
//   { movieCount: 2, country: 'Madagascar', avgRating: 7.2 },
//   { movieCount: 2, country: 'Kyrgyzstan', avgRating: 7.8 },
//   { movieCount: 2, country: 'Saudi Arabia', avgRating: 8 },
//   { movieCount: 2, country: 'Malta', avgRating: 7.1 },
//   { movieCount: 2, country: 'Papua New Guinea', avgRating: 7.3 },
//   { movieCount: 2, country: 'Algeria', avgRating: 7.1 },
//   { movieCount: 2, country: 'Senegal', avgRating: 7 },
//   { movieCount: 2, country: 'Puerto Rico', avgRating: 7.7 },
//   { movieCount: 2, country: 'Rwanda', avgRating: 7.6 },
//   { movieCount: 2, country: 'Mongolia', avgRating: 7.6 },
//   ... 31 more items
// ]

// ### 3.3
// Io filtro film italiani con rating alto, espando registi e calcolo statistiche per regista, ordinando per numero film.

db.movies.aggregate([
    { $match: { languages: "Italian", "imdb.rating": { $gte: 7 } } },
    { $unwind: "$directors" },
    {
        $group: {
            _id: "$directors",
            movieCount: { $sum: 1 },
            avgRating: { $avg: "$imdb.rating" }
        }
    },
    {
        $project: {
            director: "$_id",
            movieCount: 1,
            avgRating: { $round: ["$avgRating", 1] },
            _id: 0
        }
    },
    { $sort: { movieCount: -1 } }
]).toArray();

// Soluzione:

// [
//   { movieCount: 12, director: 'Luchino Visconti', avgRating: 7.7 },
//   { movieCount: 11, director: 'Mario Monicelli', avgRating: 7.5 },
//   { movieCount: 10, director: 'Vittorio De Sica', avgRating: 7.5 },
//   { movieCount: 10, director: 'Federico Fellini', avgRating: 7.4 },
//   { movieCount: 9, director: 'Ettore Scola', avgRating: 7.3 },
//   { movieCount: 7, director: 'Mauro Bolognini', avgRating: 7.2 },
//   { movieCount: 7, director: 'Vittorio Taviani', avgRating: 7.3 },
//   { movieCount: 7, director: 'Paolo Taviani', avgRating: 7.3 },
//   { movieCount: 6, director: 'Roberto Benigni', avgRating: 7.7 },
//   { movieCount: 6, director: 'Damiano Damiani', avgRating: 7.2 },
//   { movieCount: 6, director: 'Elio Petri', avgRating: 7.5 },
//   { movieCount: 6, director: 'Roberto Rossellini', avgRating: 7.4 },
//   { movieCount: 5, director: 'Martin Scorsese', avgRating: 8 },
//   { movieCount: 5, director: 'Gianni Amelio', avgRating: 7.4 },
//   { movieCount: 5, director: 'Giuseppe Tornatore', avgRating: 7.7 },
//   { movieCount: 5, director: 'Pier Paolo Pasolini', avgRating: 7.5 },
//   { movieCount: 5, director: 'Valerio Zurlini', avgRating: 7.5 },
//   { movieCount: 4, director: 'Lina Wertmèller', avgRating: 7.8 },
//   { movieCount: 4, director: 'Michelangelo Antonioni', avgRating: 7.4 },
//   { movieCount: 4, director: 'Ferzan Ozpetek', avgRating: 7.2 },
//   { movieCount: 4, director: 'Francesco Rosi', avgRating: 7.5 },
//   { movieCount: 4, director: 'Sergio Leone', avgRating: 8.2 },
//   { movieCount: 4, director: 'Paolo Sorrentino', avgRating: 7.3 },
//   { movieCount: 4, director: 'Nanni Loy', avgRating: 7.4 },
//   { movieCount: 4, director: 'Nanni Moretti', avgRating: 7.2 },
//   { movieCount: 4, director: 'Ermanno Olmi', avgRating: 7.3 },
//   { movieCount: 4, director: 'Gabriele Salvatores', avgRating: 7.3 },
//   { movieCount: 4, director: 'Giuliano Montaldo', avgRating: 7.5 },
//   { movieCount: 4, director: 'Luigi Comencini', avgRating: 7.6 },
//   { movieCount: 4, director: 'Alberto Lattuada', avgRating: 7.1 },
//   { movieCount: 4, director: 'Sidney Lumet', avgRating: 7.5 },
//   { movieCount: 4, director: 'Bernardo Bertolucci', avgRating: 7.5 },
//   { movieCount: 4, director: 'Dino Risi', avgRating: 7.5 },
//   { movieCount: 3, director: 'Franco Brusati', avgRating: 7.3 },
//   { movieCount: 3, director: 'Gillo Pontecorvo', avgRating: 7.5 },
//   { movieCount: 3, director: 'Marco Tullio Giordana', avgRating: 7.8 },
//   { movieCount: 3, director: 'Paolo Virzè', avgRating: 7.2 },
//   { movieCount: 3, director: 'Pietro Germi', avgRating: 7.5 },
//   { movieCount: 3, director: 'Joseph L. Mankiewicz', avgRating: 7.6 },
//   { movieCount: 3, director: 'Luc Besson', avgRating: 7.9 },
//   { movieCount: 3, director: 'Francis Ford Coppola', avgRating: 8.6 },
//   { movieCount: 3, director: 'Carlo Lizzani', avgRating: 7.1 },
//   { movieCount: 3, director: 'Carlo Verdone', avgRating: 7.3 },
//   { movieCount: 3, director: 'Leni Riefenstahl', avgRating: 7.7 },
//   { movieCount: 3, director: 'Jim Jarmusch', avgRating: 7.8 },
//   { movieCount: 3, director: 'Marco Bellocchio', avgRating: 7.1 },
//   { movieCount: 3, director: 'Ridley Scott', avgRating: 7.3 },
//   { movieCount: 2, director: 'Sergio Castellitto', avgRating: 7.2 },
//   { movieCount: 2, director: 'Ka-Fai Wai', avgRating: 7 },
//   { movieCount: 2, director: 'Frèdèric Tcheng', avgRating: 7.3 },
//   { movieCount: 2, director: 'Anatole Litvak', avgRating: 7.3 },
//   { movieCount: 2, director: 'Wes Anderson', avgRating: 7.4 },
//   { movieCount: 2, director: 'Emir Kusturica', avgRating: 8 },
//   { movieCount: 2, director: 'Johnnie To', avgRating: 7 },
//   { movieCount: 2, director: 'Anthony Minghella', avgRating: 7.3 },
//   { movieCount: 2, director: 'Francesco Munzi', avgRating: 7 },
//   { movieCount: 2, director: 'Cèdric Klapisch', avgRating: 7.2 },
//   { movieCount: 2, director: 'Joel Coen', avgRating: 7.8 },
//   { movieCount: 2, director: 'Marco Ferreri', avgRating: 7.2 },
//   { movieCount: 2, director: 'Marco Bechis', avgRating: 7.3 },
//   { movieCount: 2, director: 'Steno', avgRating: 7.5 },
//   { movieCount: 2, director: 'Renè Clèment', avgRating: 7.5 },
//   { movieCount: 2, director: 'Richard Donner', avgRating: 7.7 },
//   { movieCount: 2, director: 'Marcello Fondato', avgRating: 7.2 },
//   { movieCount: 2, director: 'Michael Curtiz', avgRating: 8 },
//   { movieCount: 2, director: 'Franco Piavoli', avgRating: 7.4 },
//   { movieCount: 2, director: 'George Roy Hill', avgRating: 7.2 },
//   { movieCount: 2, director: 'Robert Aldrich', avgRating: 7.7 },
//   { movieCount: 2, director: 'Giorgio Diritti', avgRating: 7.5 },
//   { movieCount: 2, director: 'Dario Argento', avgRating: 7.2 },
//   { movieCount: 2, director: 'Lee Daniels', avgRating: 7.4 },
//   { movieCount: 2, director: 'Sergio Corbucci', avgRating: 7.4 },
//   { movieCount: 2, director: 'Tim Burton', avgRating: 7.2 },
//   { movieCount: 2, director: 'John Sayles', avgRating: 7.8 },
//   { movieCount: 2, director: 'Ethan Coen', avgRating: 7.8 },
//   { movieCount: 2, director: 'Alberto Negrin', avgRating: 7.2 },
//   { movieCount: 2, director: 'Mike Newell', avgRating: 7.6 },
//   { movieCount: 2, director: "Enzo D'Alè", avgRating: 7 },
//   { movieCount: 2, director: 'Jean-Paul Rappeneau', avgRating: 7 },
//   { movieCount: 2, director: 'Mark Sandrich', avgRating: 7.8 },
//   { movieCount: 2, director: 'Wim Wenders', avgRating: 7.5 },
//   { movieCount: 2, director: 'Bruno Barreto', avgRating: 7.1 },
//   { movieCount: 2, director: 'Antonio Pietrangeli', avgRating: 7.5 },
//   { movieCount: 2, director: 'Spike Lee', avgRating: 7.8 },
//   { movieCount: 2, director: 'Daniele Luchetti', avgRating: 7.1 },
//   { movieCount: 2, director: 'Sabina Guzzanti', avgRating: 7.4 },
//   { movieCount: 2, director: 'Massimo Troisi', avgRating: 7.4 },
//   { movieCount: 2, director: 'Hayao Miyazaki', avgRating: 7.8 },
//   { movieCount: 1, director: 'Giacomo Campiotti', avgRating: 7.5 },
//   { movieCount: 1, director: 'Jean Renoir', avgRating: 7.4 },
//   { movieCount: 1, director: 'Duccio Tessari', avgRating: 7 },
//   { movieCount: 1, director: 'John Cassavetes', avgRating: 8.2 },
//   { movieCount: 1, director: 'Francesco La Regina', avgRating: 7.7 },
//   { movieCount: 1, director: 'Len Wiseman', avgRating: 7.2 },
//   { movieCount: 1, director: 'Aditya Kolli', avgRating: 7.7 },
//   { movieCount: 1, director: 'Delphine Lehericey', avgRating: 7.4 },
//   { movieCount: 1, director: 'Volker Schlèndorff', avgRating: 7.6 },
//   { movieCount: 1, director: 'Pantelis Voulgaris', avgRating: 7.6 },
//   { movieCount: 1, director: 'Guy Ritchie', avgRating: 7.5 },
//   { movieCount: 1, director: 'Danny Boyle', avgRating: 7.6 },
//   ... 297 more items
// ]

// ### 3.4
// Io uso facet per mostrare statistiche complessive per paese e per decade, limitando risultati.

db.movies.aggregate([
  {
    $facet: {
      overall: [
        { $unwind: "$countries" },
        {
          $group: {
            _id: "$countries",
            movieCount: { $sum: 1 },
            avgRating: { $avg: "$imdb.rating" }
          }
        },
        {
          $project: {
            country: "$_id",
            movieCount: 1,
            avgRating: { $round: ["$avgRating", 1] },
            _id: 0
          }
        },
        { $sort: { movieCount: -1 } },
        { $limit: 10 }
      ],
      byDecade: [
        {
          $addFields: {
            yearNum: {
              $convert: {
                input: "$year",
                to: "int",
                onError: null  // Ignora errori di conversione
              }
            }
          }
        },
        { $match: { yearNum: { $ne: null } } },  // Filtra documenti senza year valido
        {
          $addFields: {
            decade: { $subtract: ["$yearNum", { $mod: ["$yearNum", 10] }] }
          }
        },
        { $unwind: "$countries" },
        {
          $group: {
            _id: { country: "$countries", decade: "$decade" },
            movieCount: { $sum: 1 },
            avgRating: { $avg: "$imdb.rating" }
          }
        },
        {
          $project: {
            country: "$_id.country",
            decade: "$_id.decade",
            movieCount: 1,
            avgRating: { $round: ["$avgRating", 1] },
            _id: 0
          }
        },
        { $sort: { decade: -1, movieCount: -1 } },
        { $limit: 20 }
      ]
    }
  }
]).toArray();

// Soluzione:

// [
//   {
//     overall: [
//       [Object], [Object],
//       [Object], [Object],
//       [Object], [Object],
//       [Object], [Object],
//       [Object], [Object]
//     ],
//     byDecade: [
//       [Object], [Object], [Object],
//       [Object], [Object], [Object],
//       [Object], [Object], [Object],
//       [Object], [Object], [Object],
//       [Object], [Object], [Object],
//       [Object], [Object], [Object],
//       [Object], [Object]
//     ]
//   }
// ]