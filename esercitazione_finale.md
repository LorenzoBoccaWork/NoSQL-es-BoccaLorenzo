🎬 Esercitazione Finale: Piattaforma Streaming Film
📋 Panoramica
Durata: 6 ore
Difficoltà: Progressiva (da base ad avanzato)
Database: sample_mflix (MongoDB Atlas)

🎯 Scenario
Sei uno sviluppatore backend per CineStream, una nuova piattaforma di streaming e catalogo film. Il tuo compito è implementare una serie di endpoint API che il team frontend utilizzerà per costruire l'applicazione.

Ogni esercizio rappresenta una feature reale richiesta dal Product Manager. Dovrai scrivere le query e le aggregation pipeline MongoDB necessarie per soddisfare i requisiti.

🗄️ Struttura Database
Il database sample_mflix contiene le seguenti collections:

movies (~21,349 documenti)
{
  _id: ObjectId("..."),
  title: "The Godfather",
  year: 1972,
  runtime: 175,
  genres: ["Crime", "Drama"],
  cast: ["Marlon Brando", "Al Pacino", "James Caan"],
  directors: ["Francis Ford Coppola"],
  countries: ["USA"],
  languages: ["English", "Italian"],
  plot: "The aging patriarch of an organized crime dynasty...",
  fullplot: "...",
  rated: "R",
  poster: "https://...",
  imdb: {
    rating: 9.2,
    votes: 1700000,
    id: 68646
  },
  tomatoes: {
    viewer: { rating: 4.5, numReviews: 500000, meter: 98 },
    critic: { rating: 9.1, numReviews: 150, meter: 99 }
  },
  awards: {
    wins: 28,
    nominations: 15,
    text: "Won 3 Oscars. Another 25 wins & 15 nominations."
  },
  num_mflix_comments: 150
}
comments (~41,079 documenti)
{
  _id: ObjectId("..."),
  name: "John Doe",
  email: "john@example.com",
  movie_id: ObjectId("..."),  // Riferimento a movies._id
  text: "Great movie! Loved every minute.",
  date: ISODate("2024-01-15T10:30:00Z")
}
users (~185 documenti)
{
  _id: ObjectId("..."),
  name: "John Doe",
  email: "john@example.com",
  password: "..." // hash
}
🛠️ Setup
1. Connessione al Database
// mongosh
mongosh "your-connection-string"

// Seleziona database
use sample_mflix

// Verifica collections
show collections

// Test query
db.movies.findOne()
db.comments.findOne()
2. Struttura Repository
Crea una cartella nel tuo repository personale per salvare le soluzioni:

your-repo/
├── lezione-finale/
│   ├── feature-1-ricerca/
│   │   ├── 01-search-basic.js
│   │   ├── 02-filter-advanced.js
│   │   └── 03-advanced-search.js
│   ├── feature-2-commenti/
│   │   ├── 04-movie-with-comments.js
│   │   ├── 05-most-discussed.js
│   │   └── 06-user-activity.js
│   ├── feature-3-analytics/
│   │   └── ...
│   └── README.md (note e osservazioni)
3. Formato Soluzioni
Ogni file .js deve contenere:

// 01-search-basic.js

/**
 * FEATURE: Sistema di Ricerca Film
 * ENDPOINT: GET /api/movies/search
 * 
 * PARAMETRI:
 * - searchTerm: string (titolo da cercare)
 * 
 * OBIETTIVO:
 * Cercare film per titolo (case-insensitive, match parziale)
 */

// La tua pipeline/query qui
db.movies.find({
  // ...
})

/**
 * OUTPUT ATTESO:
 * [
 *   {
 *     title: "The Godfather",
 *     year: 1972,
 *     poster: "https://...",
 *     rating: 9.2
 *   },
 *   // ...
 * ]
 */

/**
 * NOTE:
 * - Spiegazioni delle scelte tecniche
 * - Performance considerations
 * - Indici creati
 */
🎯 Feature 1: Sistema di Ricerca Film
Tempo stimato: 1.5 ore
Difficoltà: ⭐⭐ Base-Intermedio

Il team frontend ha bisogno di implementare la funzionalità di ricerca e filtro del catalogo film.

Esercizio 1.1: Ricerca Base per Titolo
Contesto Business: Gli utenti devono poter cercare film digitando parte del titolo nella search bar.

Endpoint: GET /api/movies/search?term=godfather

Requisiti Funzionali
Ricerca case-insensitive sul campo title
Match parziale (es: "god" trova "The Godfather")
Restituire solo i campi necessari per la card film:
title
year
poster
imdb.rating
Ordinare per rilevanza (rating IMDB decrescente)
Limitare a 20 risultati
Criteri di Successo
✅ La ricerca "godfather" trova "The Godfather"
✅ La ricerca "GOD" trova "The Godfather" (case-insensitive)
✅ Restituiti solo i campi richiesti (no campi extra)
✅ Risultati ordinati per rating
Hints
<details> <summary>💡 Clicca per vedere suggerimenti</summary>

Usa regex per match parziale: /searchTerm/i (i = case-insensitive)
Oppure usa $regex operator
Ricorda la dot notation per campi nested: "imdb.rating"
Usa $project o proiezione in find() per selezionare campi
</details>

Esempio Output
[
  {
    title: "The Godfather",
    year: 1972,
    poster: "https://m.media-amazon.com/images/...",
    rating: 9.2
  },
  {
    title: "The Godfather: Part II",
    year: 1974,
    poster: "https://m.media-amazon.com/images/...",
    rating: 9.0
  }
]
Esercizio 1.2: Filtri Avanzati
Contesto Business: Gli utenti vogliono filtrare il catalogo per genere, anno, paese e range di rating.

Endpoint: GET /api/movies/filter?genre=Drama&yearFrom=2010&yearTo=2020&minRating=7.5&country=USA&page=1

Requisiti Funzionali
Filtri multipli (tutti opzionali):
genre: Film con questo genere (es: "Drama")
yearFrom e yearTo: Range di anni
minRating: Rating IMDB minimo
country: Paese di produzione
language: Lingua
Paginazione:
page: numero pagina (default 1)
limit: risultati per pagina (default 20)
Ordinamento configurabile:
sortBy: campo per ordinare (default "imdb.rating")
sortOrder: "asc" o "desc" (default "desc")
Proiettare: title, year, genres, poster, imdb.rating, countries
Criteri di Successo
✅ Ogni filtro funziona singolarmente
✅ I filtri si combinano correttamente (AND logic)
✅ Paginazione funziona (page 1, 2, 3...)
✅ Ordinamento corretto
Hints
<details> <summary>💡 Clicca per vedere suggerimenti</summary>

Costruisci un oggetto filter dinamicamente: javascript let filter = {}; if (genre) filter.genres = genre; if (yearFrom || yearTo) { filter.year = {}; if (yearFrom) filter.year.$gte = yearFrom; if (yearTo) filter.year.$lte = yearTo; } // ...
Per paginazione: skip((page-1) * limit)
Per campi array (genres, countries): MongoDB matcha automaticamente
</details>

Performance Task
Crea un indice compound per ottimizzare questa query. Quali campi includere? In che ordine? Testa con explain().

Esercizio 1.3: Ricerca Avanzata su Cast e Directors
Contesto Business: Gli utenti cinefili vogliono cercare film di un regista specifico o con un attore preferito.

Endpoint: GET /api/movies/advanced-search?director=Spielberg&actor=Tom Hanks&minAwards=10

Requisiti Funzionali
Ricerca per director (match parziale, case-insensitive)
Ricerca per actor in cast (match parziale, case-insensitive)
Filtro per minAwards: film con almeno X vittorie (awards.wins >= minAwards)
Combinazione dei filtri con logica AND
Ordinare per:
Numero di award wins (decrescente)
Poi per rating IMDB (decrescente)
Proiettare:
title, year, directors, cast (primi 3), awards.wins, awards.nominations, imdb.rating, poster
Limitare a 30 risultati
Criteri di Successo
✅ Trova film con regista "Steven Spielberg" cercando solo "spielberg"
✅ Trova film con attore "Tom Hanks" anche se non è il primo nell'array cast
✅ Filtro awards funziona correttamente
✅ Ordinamento corretto (prima per awards, poi per rating)
Hints
<details> <summary>💡 Clicca per vedere suggerimenti</summary>

Per cercare in array di stringhe: usa $regex con array javascript { cast: { $regex: /tom hanks/i } }
Per limitare elementi array in projection: usa $slice javascript { cast: { $slice: 3 } } // primi 3 elementi
Per sort su campi multipli: javascript .sort({ "awards.wins": -1, "imdb.rating": -1 })
</details>

Challenge Performance
Usa explain() per analizzare la query
Crea indici appropriati (considera la ESR rule!)
Documenta il miglioramento in performance
🎯 Feature 2: Sistema Commenti e Engagement
Tempo stimato: 1.5 ore
Difficoltà: ⭐⭐⭐ Intermedio

Implementare funzionalità legate ai commenti degli utenti sui film.

Esercizio 2.1: Film con Commenti
Contesto Business: Nella pagina dettaglio film, mostrare il film con i suoi commenti più recenti.

Endpoint: GET /api/movies/:movieId/with-comments?limit=10

Requisiti Funzionali
Input: movieId (ObjectId del film)
Output: Documento film con array di commenti
Mostrare solo gli ultimi N commenti (ordinati per data, più recenti prima)
Per ogni commento includere:
name (nome utente)
text (testo commento)
date (data commento)
Per il film includere:
Tutti i campi principali (title, year, plot, genres, cast, directors, ratings, etc.)
Contare il totale commenti (totalComments)
Criteri di Successo
✅ Usa $lookup per unire movies e comments
✅ Commenti ordinati per data (più recenti prima)
✅ Limitati al numero richiesto
✅ Include totalComments count
Hints
<details> <summary>💡 Clicca per vedere suggerimenti</summary>

Usa $lookup con pipeline syntax per poter ordinare e limitare: javascript { $lookup: { from: "comments", let: { movieId: "$_id" }, pipeline: [ { $match: { $expr: { $eq: ["$movie_id", "$$movieId"] } } }, { $sort: { date: -1 } }, { $limit: 10 }, { $project: { name: 1, text: 1, date: 1, _id: 0 } } ], as: "comments" } }
Per contare totale: usa $size su array comments prima di limitare
</details>

Performance
Crea un indice su comments.movie_id per ottimizzare il $lookup.

Esercizio 2.2: Top Film Più Commentati
Contesto Business: Homepage mostra una sezione "Film più discussi" per evidenziare i film con più engagement.

Endpoint: GET /api/movies/most-discussed?limit=20

Requisiti Funzionali
Trovare i film con più commenti
Per ogni film mostrare:
title, year, poster, genres
imdb.rating
commentCount (numero totale commenti)
lastCommentDate (data ultimo commento)
Ordinare per commentCount decrescente
Limitare ai top 20
Solo film con almeno 1 commento
Criteri di Successo
✅ Usa aggregation pipeline
✅ Conta correttamente i commenti per film
✅ Include data ultimo commento
✅ Ordinamento corretto
Hints
<details> <summary>💡 Clicca per vedere suggerimenti</summary>

Approccio: Parti da comments, raggruppa per film, poi lookup dettagli film.

db.comments.aggregate([
  // Group per movie_id
  {
    $group: {
      _id: "$movie_id",
      commentCount: { $sum: 1 },
      lastCommentDate: { $max: "$date" }
    }
  },
  // Sort per numero commenti
  { $sort: { commentCount: -1 } },
  { $limit: 20 },
  // Lookup dettagli film
  {
    $lookup: {
      from: "movies",
      localField: "_id",
      foreignField: "_id",
      as: "movie"
    }
  },
  { $unwind: "$movie" },
  // Project finale
  // ...
])
</details>

Challenge
Variante: Mostra i film più commentati dell'ultimo mese. Come modifichi la pipeline?

Esercizio 2.3: Cronologia Attività Utente
Contesto Business: Pagina profilo utente mostra storico dei commenti con i film commentati.

Endpoint: GET /api/users/:email/activity

Requisiti Funzionali
Input: email dell'utente
Trovare tutti i commenti dell'utente
Per ogni commento, includere dettagli del film commentato
Statistiche personalizzate:
Totale commenti
Generi preferiti (top 3 generi più commentati)
Registi preferiti (top 3 registi più commentati)
Rating medio dei film commentati
Cronologia commenti (ultimi 50):
Testo commento
Data commento
Titolo film
Anno film
Rating film
Ordinare commenti per data (più recenti prima)
Criteri di Successo
✅ Lookup multipli (comments → movies)
✅ Calcola statistiche aggregate correttamente
✅ Identifica top generi e registi
✅ Cronologia ordinata
Hints
<details> <summary>💡 Clicca per vedere suggerimenti</summary>

Usa $facet per calcolare statistiche e cronologia in parallelo:

db.comments.aggregate([
  // Match commenti utente
  { $match: { email: "user@example.com" } },
  
  // Lookup film
  {
    $lookup: {
      from: "movies",
      localField: "movie_id",
      foreignField: "_id",
      as: "movie"
    }
  },
  { $unwind: "$movie" },
  
  // Facet per multiple analytics
  {
    $facet: {
      // Stats
      statistics: [
        { $unwind: "$movie.genres" },
        {
          $group: {
            _id: "$movie.genres",
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 3 }
      ],
      
      // Cronologia
      timeline: [
        { $sort: { date: -1 } },
        { $limit: 50 },
        {
          $project: {
            commentText: "$text",
            commentDate: "$date",
            movieTitle: "$movie.title",
            movieYear: "$movie.year",
            movieRating: "$movie.imdb.rating"
          }
        }
      ]
    }
  }
])
</details>

Challenge
Aggiungi una recommendation: suggerisci 5 film dello stesso genere preferito che l'utente NON ha ancora commentato.

🎯 Feature 3: Analytics e Dashboard
Tempo stimato: 2 ore
Difficoltà: ⭐⭐⭐⭐ Intermedio-Avanzato

Creare analytics per dashboard amministrativa e statistiche pubbliche.

Esercizio 3.1: Statistiche per Genere
Contesto Business: Dashboard mostra statistiche aggregate per ogni genere cinematografico.

Endpoint: GET /api/analytics/genres-stats

Requisiti Funzionali
Per ogni genere, calcolare:
genre: Nome genere
movieCount: Numero totale film
avgRating: Rating IMDB medio
avgRuntime: Durata media (minuti)
totalAwards: Totale premi vinti
topMovie: Film con rating più alto del genere (title + rating)
Ordinare per movieCount decrescente
Top 15 generi
Solo film con rating disponibile (imdb.rating exists)
Criteri di Successo
✅ Usa $unwind su genres array
✅ Calcola tutte le statistiche correttamente
✅ Identifica top movie per genere
✅ Ordinamento corretto
Hints
<details> <summary>💡 Clicca per vedere suggerimenti</summary>

db.movies.aggregate([
  // Match solo con rating
  { $match: { "imdb.rating": { $exists: true, $ne: null } } },
  
  // Unwind genres
  { $unwind: "$genres" },
  
  // Sort per rating (per poter prendere top movie con $first)
  { $sort: { "imdb.rating": -1 } },
  
  // Group per genere
  {
    $group: {
      _id: "$genres",
      movieCount: { $sum: 1 },
      avgRating: { $avg: "$imdb.rating" },
      avgRuntime: { $avg: "$runtime" },
      totalAwards: { $sum: "$awards.wins" },
      topMovieTitle: { $first: "$title" },
      topMovieRating: { $first: "$imdb.rating" }
    }
  },
  
  // Project per rinominare campi
  {
    $project: {
      _id: 0,
      genre: "$_id",
      movieCount: 1,
      avgRating: { $round: ["$avgRating", 2] },
      avgRuntime: { $round: ["$avgRuntime", 0] },
      totalAwards: 1,
      topMovie: {
        title: "$topMovieTitle",
        rating: "$topMovieRating"
      }
    }
  },
  
  // Sort per count
  { $sort: { movieCount: -1 } },
  { $limit: 15 }
])
</details>

Esercizio 3.2: Ranking Registi
Contesto Business: Sezione "Maestri del Cinema" mostra i registi più prolifici e acclamati.

Endpoint: GET /api/analytics/directors-ranking?minMovies=3

Requisiti Funzionali
Per ogni regista, calcolare:
director: Nome regista
movieCount: Numero film diretti
avgRating: Rating IMDB medio dei suoi film
totalAwards: Totale premi vinti
bestMovie: Suo film con rating più alto
genres: Lista generi unici dei suoi film
Filtro: Solo registi con almeno N film (default 3)
Ordinare per:
Prima per avgRating (decrescente)
Poi per movieCount (decrescente)
Top 20 registi
Criteri di Successo
✅ Unwind directors array
✅ Filtra registi con pochi film
✅ Calcola stats correttamente
✅ Identifica best movie
✅ Raccoglie generi unici
Hints
<details> <summary>💡 Clicca per vedere suggerimenti</summary>

Usa $unwind su directors
Per generi unici: usa $addToSet in $group
Per filtrare dopo group: usa $match DOPO $group javascript { $match: { movieCount: { $gte: 3 } } }
</details>

Esercizio 3.3: Trend Temporali
Contesto Business: Visualizzare l'evoluzione del cinema negli anni.

Endpoint: GET /api/analytics/yearly-trends?fromYear=1990&toYear=2020

Requisiti Funzionali
Per ogni anno, calcolare:
year: Anno
movieCount: Numero film prodotti
avgRating: Rating medio
avgRuntime: Durata media
topGenres: Top 3 generi dell'anno (con count)
Range di anni configurabile (default ultimi 30 anni)
Ordinare per anno (crescente)
Solo film con year, rating e runtime validi
Criteri di Successo
✅ Group per anno
✅ Calcola metriche aggregate
✅ Identifica top generi per anno
✅ Filtra dati invalidi
Hints
<details> <summary>💡 Clicca per vedere suggerimenti</summary>

Per top generi per anno, usa $facet o pipeline separata. Alternativa più semplice: usa $push per raccogliere tutti i generi, poi processa in applicazione.

Approccio avanzato con sub-aggregation:

{
  $group: {
    _id: "$year",
    movieCount: { $sum: 1 },
    avgRating: { $avg: "$imdb.rating" },
    allGenres: { $push: "$genres" }  // Array di array
  }
}
// Poi usa $unwind su allGenres e ri-grouppa
</details>

Esercizio 3.4: Produzione Cinematografica per Paese
Contesto Business: Dashboard geografica mostra quali paesi producono più film.

Endpoint: GET /api/analytics/countries-production

Requisiti Funzionali
Per ogni paese, calcolare:
country: Nome paese
movieCount: Numero film prodotti
avgRating: Rating medio
topDirectors: Top 3 registi del paese (nome + film count)
topGenres: Top 3 generi (nome + count)
Multiple views usando $facet:
overall: Statistiche globali top 20 paesi
byDecade: Statistiche per decade (es: 1990s, 2000s, 2010s)
Ordinare per movieCount (decrescente)
Criteri di Successo
✅ Unwind countries array
✅ Usa $facet per multiple views
✅ Calcola top directors e genres per paese
✅ Raggruppa per decade
Hints
<details> <summary>💡 Clicca per vedere suggerimenti</summary>

Per decade, calcola decade da year:

{
  $addFields: {
    decade: {
      $concat: [
        { $toString: { $multiply: [{ $floor: { $divide: ["$year", 10] } }, 10] } },
        "s"
      ]
    }
  }
}
// Esempio: 1994 → "1990s"
</details>

🎯 Feature 4: Sistema di Raccomandazioni
Tempo stimato: 1.5 ore
Difficoltà: ⭐⭐⭐⭐⭐ Avanzato

Implementare algoritmi di raccomandazione film.

Esercizio 4.1: Film Simili
Contesto Business: Nella pagina film, sezione "Ti potrebbero piacere" suggerisce film simili.

Endpoint: GET /api/recommendations/similar/:movieId?limit=10

Requisiti Funzionali
Input: movieId del film di riferimento
Trovare film simili basandosi su:
Generi condivisi (peso: 3 punti per genere)
Stesso regista (peso: 5 punti)
Cast in comune (peso: 2 punti per attore)
Calcolare similarity score totale
Ordinare per similarity score (decrescente)
Escludere il film originale
Filtrare film con rating >= 6.0
Restituire top N film (default 10)
Output per ogni film:
title, year, poster, imdb.rating
similarityScore
matchReasons: array di motivi (es: ["2 genres match", "Same director"])
Criteri di Successo
✅ Algoritmo di scoring funziona
✅ Film ordinati per similarity
✅ Match reasons spiegati
✅ Film originale escluso
Hints
<details> <summary>💡 Clicca per vedere suggerimenti</summary>

Approccio: 1. Trova il film originale e salva i suoi attributi 2. Cerca film con almeno 1 genere in comune o stesso regista o cast 3. Calcola score con $add e operatori condizionali

// Pseudo-codice
db.movies.aggregate([
  { $match: { _id: { $ne: movieId }, "imdb.rating": { $gte: 6 } } },
  
  {
    $addFields: {
      genresScore: {
        $multiply: [
          { $size: { $setIntersection: ["$genres", originalGenres] } },
          3
        ]
      },
      directorScore: {
        $cond: [
          { $gt: [{ $size: { $setIntersection: ["$directors", originalDirectors] } }, 0] },
          5,
          0
        ]
      },
      castScore: {
        $multiply: [
          { $size: { $setIntersection: ["$cast", originalCast] } },
          2
        ]
      }
    }
  },
  
  {
    $addFields: {
      similarityScore: {
        $add: ["$genresScore", "$directorScore", "$castScore"]
      }
    }
  },
  
  { $match: { similarityScore: { $gt: 0 } } },
  { $sort: { similarityScore: -1 } },
  { $limit: 10 }
])
Nota: Devi prima fare una query per ottenere genres, directors, cast del film originale, poi usarli nella pipeline.

</details>

Challenge
Aggiungi al scoring: film dello stesso anno ±3 anni (1 punto).

Esercizio 4.2: Raccomandazioni Personalizzate
Contesto Business: Homepage personalizzata con suggerimenti basati sulla cronologia utente.

Endpoint: GET /api/recommendations/personalized?email=user@example.com&limit=15

Requisiti Funzionali
Input: email utente
Analizza i film che l'utente ha commentato:
Identifica generi preferiti (top 3)
Identifica registi preferiti (top 2)
Suggerisci film che:
Hanno almeno 1 genere preferito
O hanno un regista preferito
Hanno rating IMDB >= 7.5
L'utente NON ha ancora commentato
Priorità:
Prima film con genere E regista preferito
Poi film con solo regista preferito
Poi film con solo genere preferito
Ordinare per rating (decrescente)
Top 15 film
Criteri di Successo
✅ Analizza correttamente preferenze utente
✅ Esclude film già commentati
✅ Priorità corretta
✅ Rating filter applicato
Hints
<details> <summary>💡 Clicca per vedere suggerimenti</summary>

Step 1: Trova preferenze utente

db.comments.aggregate([
  { $match: { email: "user@example.com" } },
  {
    $lookup: {
      from: "movies",
      localField: "movie_id",
      foreignField: "_id",
      as: "movie"
    }
  },
  { $unwind: "$movie" },
  { $unwind: "$movie.genres" },
  {
    $group: {
      _id: "$movie.genres",
      count: { $sum: 1 }
    }
  },
  { $sort: { count: -1 } },
  { $limit: 3 }
])
Step 2: Salva preferenze (array di generi e registi)

Step 3: Query film raccomandati escludendo commentati

// Ottieni lista movieIds commentati
const commentedMovieIds = db.comments.distinct("movie_id", { email: "user@email.com" });

// Query raccomandazioni
db.movies.find({
  _id: { $nin: commentedMovieIds },
  "imdb.rating": { $gte: 7.5 },
  $or: [
    { genres: { $in: preferredGenres } },
    { directors: { $in: preferredDirectors } }
  ]
})
</details>

Esercizio 4.3: Gemme Nascoste
Contesto Business: Sezione "Scopri Gemme Nascoste" evidenzia film ottimi ma poco conosciuti.

Endpoint: GET /api/recommendations/hidden-gems?genre=Drama&minRating=7.5&limit=20

Requisiti Funzionali
Criterio "Gemma Nascosta":
Rating IMDB >= minRating (default 7.5)
Numero commenti BASSO (< 20)
Ratio: rating alto ma pochi commenti = gemma
Filtrare per genere (opzionale)
Calcolare "hidden score": rating * (1 / sqrt(comments))
Ordinare per hidden score (decrescente)
Top N film
Output:
title, year, genres, poster
imdb.rating
commentCount
hiddenScore
Criteri di Successo
✅ Formula hidden score corretta
✅ Filtra per pochi commenti
✅ Alto rating richiesto
✅ Ordinamento corretto
Hints
<details> <summary>💡 Clicca per vedere suggerimenti</summary>

db.movies.aggregate([
  // Match rating alto
  { 
    $match: { 
      "imdb.rating": { $gte: 7.5 },
      genres: "Drama"  // se specificato
    } 
  },
  
  // Lookup count commenti
  {
    $lookup: {
      from: "comments",
      localField: "_id",
      foreignField: "movie_id",
      as: "comments"
    }
  },
  
  // Calcola comment count
  {
    $addFields: {
      commentCount: { $size: "$comments" }
    }
  },
  
  // Filtra pochi commenti
  { $match: { commentCount: { $lt: 20, $gt: 0 } } },
  
  // Calcola hidden score
  {
    $addFields: {
      hiddenScore: {
        $multiply: [
          "$imdb.rating",
          { $divide: [1, { $sqrt: "$commentCount" }] }
        ]
      }
    }
  },
  
  { $sort: { hiddenScore: -1 } },
  { $limit: 20 },
  
  {
    $project: {
      title: 1,
      year: 1,
      genres: 1,
      poster: 1,
      rating: "$imdb.rating",
      commentCount: 1,
      hiddenScore: { $round: ["$hiddenScore", 2] },
      _id: 0
    }
  }
])
</details>

🎯 Feature 5: Performance Optimization
Tempo stimato: 30 minuti
Difficoltà: ⭐⭐⭐⭐ Avanzato

Ottimizzare query esistenti usando indici e analisi.

Esercizio 5.1: Ottimizzazione Query Lente
Contesto: Il team ha identificato 3 query lente in produzione. Ottimizzale!

Query 1: Ricerca Film Recenti per Genere
// QUERY LENTA (NON ottimizzata)
db.movies.aggregate([
  {
    $project: {
      title: 1,
      year: 1,
      genres: 1,
      "imdb.rating": 1,
      runtime: 1,
      cast: 1,
      directors: 1,
      plot: 1,
      poster: 1
    }
  },
  { $unwind: "$genres" },
  { $sort: { "imdb.rating": -1 } },
  { 
    $match: { 
      year: { $gte: 2015 },
      genres: "Action"
    } 
  },
  { $limit: 20 }
])
Task: 1. Analizza con explain("executionStats") 2. Identifica i problemi 3. Riordina gli stage ottimalmente 4. Crea indice appropriato 5. Ri-testa e documenta miglioramento

Metriche da documentare: - Execution time (prima/dopo) - Documents examined (prima/dopo) - Stage type (COLLSCAN vs IXSCAN)

Query 2: Top Commentatori
// QUERY LENTA
db.comments.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "email",
      foreignField: "email",
      as: "user"
    }
  },
  { $unwind: "$user" },
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
    $group: {
      _id: "$email",
      userName: { $first: "$user.name" },
      commentCount: { $sum: 1 },
      avgMovieRating: { $avg: "$movie.imdb.rating" }
    }
  },
  { $match: { commentCount: { $gte: 5 } } },
  { $sort: { commentCount: -1 } },
  { $limit: 50 }
])
Task: 1. Identifica problemi performance (lookup su tutto!) 2. Usa $lookup con pipeline per proiettare presto 3. Crea indici su campi di join 4. Documenta improvement

Query 3: Film per Decade con Stats
// QUERY LENTA
db.movies.aggregate([
  { $unwind: "$genres" },
  { $unwind: "$cast" },
  { $unwind: "$directors" },
  {
    $group: {
      _id: {
        decade: { $subtract: ["$year", { $mod: ["$year", 10] }] },
        genre: "$genres"
      },
      count: { $sum: 1 }
    }
  },
  { $sort: { "_id.decade": 1 } }
])
Task: 1. Identifica problema: troppi $unwind non necessari! 2. Riscrivila senza unwind inutili 3. Ottimizza performance

Esercizio 5.2: Covered Query Challenge
Task: Crea una covered query su movies collection.

Requisiti: 1. Query deve filtrare per year e genres 2. Proiettare solo title, year, genres 3. Query deve essere coperta dall'indice (totalDocsExamined = 0) 4. Verifica con explain()

Steps: 1. Crea indice compound appropriato 2. Scrivi query con proiezione corretta (escludi _id!) 3. Usa explain("executionStats") per verificare 4. Documenta che totalDocsExamined === 0

🏆 Bonus Challenges
Per chi finisce prima!

Bonus 1: Dashboard Completa con $facet
Endpoint: GET /api/analytics/comprehensive-dashboard

Crea una singola aggregation pipeline usando $facet che restituisce:

topMovies: Top 10 film per rating (title, year, rating)
globalStats:
Total movies count
Avg rating globale
Total comments count
moviesByDecade: Count film per decade (1920s, 1930s, ..., 2020s)
topGenres: Top 5 generi (nome + count)
recentActivity: Ultimi 20 commenti con dettagli film
Challenge: Tutto in una SINGOLA pipeline usando $facet!

Bonus 2: Full-Text Search Avanzato
Endpoint: GET /api/movies/text-search?q=space adventure galaxy&limit=20

Crea text index su title, plot, fullplot
Implementa ricerca full-text con $text
Calcola relevance score con $meta: "textScore"
Ordina per score (più rilevanti prima)
Proietta: title, year, plot, poster, relevanceScore
Bonus Extra: Combina text search con filtri (es: text + year range + min rating).

Bonus 3: Recommendation Engine Avanzato
Endpoint: GET /api/recommendations/advanced?userId=...

Crea un sistema di raccomandazione ibrido che combina: 1. Collaborative filtering: Trova utenti simili (hanno commentato film simili), raccomanda film che loro hanno commentato 2. Content-based: Film simili a quelli che l'utente ha preferito (rating alto nei commenti se disponibile) 3. Popularity boost: Aggiungi un piccolo boost per film molto commentati

Combina i 3 score in un weighted score finale.

🧪 Testing e Validazione
Come Testare Le Tue Soluzioni
1. Test Funzionalità
// Esegui la pipeline
const result = db.movies.aggregate([...]).toArray()

// Verifica risultati
print(`Trovati ${result.length} risultati`)
printjson(result[0])  // Stampa primo risultato

// Verifica campi presenti
assert(result[0].title !== undefined, "title mancante")
assert(result[0].year !== undefined, "year mancante")
2. Test Performance
// Analizza performance
const explained = db.movies.aggregate([...], { explain: true })

// Verifica stage type
const stage = explained.stages[0].$cursor.queryPlanner.winningPlan.stage
print(`Stage type: ${stage}`)  // Vuoi IXSCAN, non COLLSCAN

// Verifica execution stats
const stats = db.movies.aggregate([...]).explain("executionStats")
print(`Execution time: ${stats.executionStats.executionTimeMillis}ms`)
print(`Docs examined: ${stats.executionStats.totalDocsExamined}`)
3. Test Edge Cases
// Test con dati mancanti
db.movies.find({ "imdb.rating": { $exists: false } }).count()

// Test con array vuoti
db.movies.find({ genres: { $size: 0 } }).count()

// Test risultati vuoti
const empty = db.movies.find({ year: 1800 }).toArray()
assert(empty.length === 0, "Dovrebbe essere vuoto")
✅ Checklist Completamento
Feature 1: Sistema Ricerca ✅
[ ] Esercizio 1.1 - Ricerca base
[ ] Esercizio 1.2 - Filtri avanzati (+ indice creato)
[ ] Esercizio 1.3 - Ricerca cast/directors (+ indice creato)
Feature 2: Commenti ✅
[ ] Esercizio 2.1 - Film con commenti (+ indice su movie_id)
[ ] Esercizio 2.2 - Top film commentati
[ ] Esercizio 2.3 - Cronologia utente
Feature 3: Analytics ✅
[ ] Esercizio 3.1 - Stats per genere
[ ] Esercizio 3.2 - Ranking registi
[ ] Esercizio 3.3 - Trend temporali
[ ] Esercizio 3.4 - Produzione per paese (con $facet)
Feature 4: Raccomandazioni ✅
[ ] Esercizio 4.1 - Film simili (algoritmo scoring)
[ ] Esercizio 4.2 - Raccomandazioni personalizzate
[ ] Esercizio 4.3 - Gemme nascoste
Feature 5: Performance ✅
[ ] Esercizio 5.1 - Ottimizzazione 3 query lente
[ ] Esercizio 5.2 - Covered query (verificata con explain)
Bonus (Opzionale) 🏆
[ ] Dashboard completa con $facet
[ ] Full-text search
[ ] Recommendation engine avanzato
📝 Consegna
Cosa Consegnare
File con le soluzioni nella tua repository personale (formato .js o .md)
README.md con:
Indici creati (comando + motivazione)
Note su scelte tecniche
Performance improvements documentati
Eventuali difficoltà incontrate
Tempo impiegato per feature
Screenshots (opzionale):
Output explain() per query ottimizzate
Esempi risultati queries
Criteri Valutazione
✅ Correttezza funzionale: Le query restituiscono i dati corretti
✅ Performance: Indici creati appropriatamente, pipeline ottimizzate
✅ Qualità codice: Codice leggibile, commentato, ben strutturato
✅ Completezza: Numero esercizi completati
✅ Problem solving: Approccio ai challenge difficili
💡 Tips Finali
Non aver fretta: 6 ore sono tante, lavora con calma
Testa incrementalmente: Non scrivere tutta la pipeline insieme, costruisci stage per stage
Usa explain() spesso: Verifica sempre cosa sta facendo MongoDB
Sperimenta: Prova approcci diversi, confronta performance
Documenta le scelte: Spiega PERCHÉ hai scelto un approccio
Chiedi aiuto: Se blocco, consulta documentazione MongoDB o chiedi
Divertiti: Sono query su film, goditi i dati! 🎬
📚 Risorse Utili
MongoDB Aggregation Docs
MongoDB $lookup
MongoDB Indexes
Aggregation Pipeline Operators
Query Performance Analysis
Buon lavoro e buon divertimento con MongoDB! 🚀🎬