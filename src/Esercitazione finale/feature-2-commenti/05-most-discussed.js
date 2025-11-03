// ### 5.1
// Io creo indici e ottimizo tre query, misurando con explain per vedere miglioramenti in tempo e documenti esaminati.

db.movies.createIndex({ genres: 1 });

db.movies.aggregate([
  { $match: { genres: { $exists: true } } },  
  { $unwind: "$genres" },
  {
    $group: {
      _id: "$genres",
      movieCount: { $sum: 1 },
      avgRating: { $avg: "$imdb.rating" },
      totalAwards: { $sum: "$awards.wins" }
    }
  },
  { $sort: { movieCount: -1 } },
  {
    $project: {
      genre: "$_id",
      movieCount: 1,
      avgRating: { $round: ["$avgRating", 1] },
      totalAwards: 1,
      _id: 0
    }
  }
]).explain("executionStats"); 

db.movies.createIndex({ genres: 1, directors: 1, cast: 1 });

const movieId = ObjectId("573a1390f29313caabcd4135");
const targetMovie = db.movies.findOne({ _id: movieId }, { genres: 1, directors: 1, cast: 1, _id: 0 });

db.movies.aggregate([
  { $match: { _id: { $ne: movieId }, genres: { $in: targetMovie.genres } } }, 
  {
    $addFields: {
      similarityScore: {
        $add: [
          { $size: { $setIntersection: ["$genres", targetMovie.genres] } },
          { $size: { $setIntersection: ["$directors", targetMovie.directors] } },
          { $size: { $setIntersection: ["$cast", targetMovie.cast] } }
        ]
      }
    }
  },
  { $match: { similarityScore: { $gt: 0 } } },
  { $sort: { similarityScore: -1 } },
  { $limit: 10 },
  {
    $project: {
      title: 1,
      year: 1,
      poster: 1,
      "imdb.rating": 1,
      similarityScore: 1,
      _id: 0
    }
  }
]).explain("executionStats"); 

db.comments.createIndex({ movie_id: 1, date: -1 });

db.movies.aggregate([
  { $match: { _id: movieId } },
  {
    $lookup: {
      from: "comments",
      let: { movieId: "$_id" },
      pipeline: [
        { $match: { $expr: { $eq: ["$movie_id", "$$movieId"] } } },
        { $sort: { date: -1 } },
        { $limit: 10 }
      ],
      as: "comments"
    }
  },
  {
    $project: {
      title: 1,
      year: 1,
      plot: 1,
      comments: 1,
      _id: 0
    }
  }
]).explain("executionStats");  

// Soluzioni:

// {
//   explainVersion: '1',
//   stages: [
//     {
//       '$cursor': {
//         queryPlanner: {
//           namespace: 'sample_mflix.movies',
//           parsedQuery: {
//             _id: {
//               '$eq': ObjectId('573a1390f29313caabcd4135')
//             }
//           },
//           indexFilterSet: false,
//           queryHash: '65A31566',
//           planCacheShapeHash: '65A31566',
//           planCacheKey: '164085F7',
//           optimizationTimeMillis: 0,
//           maxIndexedOrSolutionsReached: false,
//           maxIndexedAndSolutionsReached: false,
//           maxScansToExplodeReached: false,
//           prunedSimilarIndexes: false,
//           winningPlan: {
//             isCached: false,
//             stage: 'EXPRESS_IXSCAN',
//             keyPattern: '{ _id: 1 }',
//             indexName: '_id_'
//           },
//           rejectedPlans: []
//         },
//         executionStats: {
//           executionSuccess: true,
//           nReturned: 0,
//           executionTimeMillis: 0,
//           totalKeysExamined: 0,
//           totalDocsExamined: 0,
//           executionStages: {
//             isCached: false,
//             stage: 'EXPRESS_IXSCAN',
//             keyPattern: '{ _id: 1 }',
//             indexName: '_id_',
//             keysExamined: 0,
//             docsExamined: 0,
//             nReturned: 0
//           }
//         }
//       },
//       nReturned: 0,
//       executionTimeMillisEstimate: 0
//     },
//     {
//       '$lookup': {
//         from: 'comments',
//         as: 'comments',
//         let: {
//           movieId: '$_id'
//         },
//         pipeline: [
//           {
//             '$match': {
//               '$expr': {
//                 '$eq': [
//                   '$movie_id',
//                   '$$movieId'
//                 ]
//               }
//             }
//           },
//           {
//             '$sort': {
//               date: -1
//             }
//           },
//           {
//             '$limit': 10
//           }
//         ]
//       },
//       totalDocsExamined: 0,
//       totalKeysExamined: 0,
//       collectionScans: 0,
//       indexesUsed: [],
//       nReturned: 0,
//       executionTimeMillisEstimate: 0
//     },
//     {
//       '$project': {
//         title: true,
//         year: true,
//         plot: true,
//         comments: true,
//         _id: false
//       },
//       nReturned: 0,
//       executionTimeMillisEstimate: 0
//     }
//   ],
//   queryShapeHash: '2F18440DC0A8C76F74CD8213598C2E3501C3627DFD12913CD1D2346DC1D06EDE',
//   serverInfo: {
//     host: 'ac-j0gcpwz-shard-00-02.htoy7aj.mongodb.net',
//     port: 27017,
//     version: '8.0.15',
//     gitVersion: 'f79b970f08f60c41491003cd55a3dd459a279c39'
//   },
//   serverParameters: {
//     internalQueryFacetBufferSizeBytes: 104857600,
//     internalQueryFacetMaxOutputDocSizeBytes: 104857600,
//     internalLookupStageIntermediateDocumentMaxSizeBytes: 16793600,
//     internalDocumentSourceGroupMaxMemoryBytes: 104857600,
//     internalQueryMaxBlockingSortMemoryUsageBytes: 33554432,
//     internalQueryProhibitBlockingMergeOnMongoS: 0,
//     internalQueryMaxAddToSetBytes: 104857600,
//     internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600,
//     internalQueryFrameworkControl: 'trySbeRestricted',
//     internalQueryPlannerIgnoreIndexWithCollationForRegex: 1
//   },
//   command: {
//     aggregate: 'movies',
//     pipeline: [
//       {
//         '$match': {
//           _id: ObjectId('573a1390f29313caabcd4135')
//         }
//       },
//       {
//         '$lookup': {
//           from: 'comments',
//           let: {
//             movieId: '$_id'
//           },
//           pipeline: [
//             {
//               '$match': {
//                 '$expr': {
//                   '$eq': [
//                     '$movie_id',
//                     '$$movieId'
//                   ]
//                 }
//               }
//             },
//             {
//               '$sort': {
//                 date: -1
//               }
//             },
//             {
//               '$limit': 10
//             }
//           ],
//           as: 'comments'
//         }
//       },
//       {
//         '$project': {
//           title: 1,
//           year: 1,
//           plot: 1,
//           comments: 1,
//           _id: 0
//         }
//       }
//     ],
//     cursor: {},
//     '$db': 'sample_mflix'
//   },
//   ok: 1,
//   '$clusterTime': {
//     clusterTime: Timestamp({ t: 1762178482, i: 44 }),
//     signature: {
//       hash: Binary.createFromBase64('N61ebr16kY/VF7T/ig6iVYTJgg8=', 0),
//       keyId: 7506953249669251000
//     }
//   },
//   operationTime: Timestamp({ t: 1762178482, i: 44 })
// }

// ### 5.2
// Io creo un indice coperto per la query di ricerca base e verifico che non esamina documenti con explain.

db.movies.createIndex({ title: 1, year: 1, "imdb.rating": 1 });


db.movies.find(
  { title: { $regex: /^The/ } },
  { title: 1, year: 1, "imdb.rating": 1, _id: 0 } 
).explain("executionStats");

// Soluzione: 

// {
//   explainVersion: '1',
//   queryPlanner: {
//     namespace: 'sample_mflix.movies',
//     parsedQuery: {
//       title: BSONRegExp('^The', '')
//     },
//     indexFilterSet: false,
//     queryHash: 'BB76393F',
//     planCacheShapeHash: 'BB76393F',
//     planCacheKey: '98E1BFC0',
//     optimizationTimeMillis: 0,
//     maxIndexedOrSolutionsReached: false,
//     maxIndexedAndSolutionsReached: false,
//     maxScansToExplodeReached: false,
//     prunedSimilarIndexes: false,
//     winningPlan: {
//       isCached: false,
//       stage: 'PROJECTION_DEFAULT',
//       transformBy: {
//         title: 1,
//         year: 1,
//         'imdb.rating': 1,
//         _id: 0
//       },
//       inputStage: {
//         stage: 'IXSCAN',
//         keyPattern: {
//           title: 1,
//           year: 1,
//           'imdb.rating': 1
//         },
//         indexName: 'title_1_year_1_imdb.rating_1',
//         isMultiKey: false,
//         multiKeyPaths: {
//           title: [],
//           year: [],
//           'imdb.rating': []
//         },
//         isUnique: false,
//         isSparse: false,
//         isPartial: false,
//         indexVersion: 2,
//         direction: 'forward',
//         indexBounds: {
//           title: [
//             '["The", "Thf")',
//             '[/^The/, /^The/]'
//           ],
//           year: [
//             '[MinKey, MaxKey]'
//           ],
//           'imdb.rating': [
//             '[MinKey, MaxKey]'
//           ]
//         }
//       }
//     },
//     rejectedPlans: []
//   },
//   executionStats: {
//     executionSuccess: true,
//     nReturned: 4032,
//     executionTimeMillis: 11,
//     totalKeysExamined: 4033,
//     totalDocsExamined: 0,
//     executionStages: {
//       isCached: false,
//       stage: 'PROJECTION_DEFAULT',
//       nReturned: 4032,
//       executionTimeMillisEstimate: 10,
//       works: 4034,
//       advanced: 4032,
//       needTime: 1,
//       needYield: 0,
//       saveState: 0,
//       restoreState: 0,
//       isEOF: 1,
//       transformBy: {
//         title: 1,
//         year: 1,
//         'imdb.rating': 1,
//         _id: 0
//       },
//       inputStage: {
//         stage: 'IXSCAN',
//         nReturned: 4032,
//         executionTimeMillisEstimate: 3,
//         works: 4034,
//         advanced: 4032,
//         needTime: 1,
//         needYield: 0,
//         saveState: 0,
//         restoreState: 0,
//         isEOF: 1,
//         keyPattern: {
//           title: 1,
//           year: 1,
//           'imdb.rating': 1
//         },
//         indexName: 'title_1_year_1_imdb.rating_1',
//         isMultiKey: false,
//         multiKeyPaths: {
//           title: [],
//           year: [],
//           'imdb.rating': []
//         },
//         isUnique: false,
//         isSparse: false,
//         isPartial: false,
//         indexVersion: 2,
//         direction: 'forward',
//         indexBounds: {
//           title: [
//             '["The", "Thf")',
//             '[/^The/, /^The/]'
//           ],
//           year: [
//             '[MinKey, MaxKey]'
//           ],
//           'imdb.rating': [
//             '[MinKey, MaxKey]'
//           ]
//         },
//         keysExamined: 4033,
//         seeks: 2,
//         dupsTested: 0,
//         dupsDropped: 0
//       }
//     }
//   },
//   queryShapeHash: '4C3F917309D0227D2E9932AD54FED5B49BAC7C5E701D75630470DB2CE5449FEC',
//   command: {
//     find: 'movies',
//     filter: {
//       title: {
//         '$regex': BSONRegExp('^The', '')
//       }
//     },
//     projection: {
//       title: 1,
//       year: 1,
//       'imdb.rating': 1,
//       _id: 0
//     },
//     '$db': 'sample_mflix'
//   },
//   serverInfo: {
//     host: 'ac-j0gcpwz-shard-00-02.htoy7aj.mongodb.net',
//     port: 27017,
//     version: '8.0.15',
//     gitVersion: 'f79b970f08f60c41491003cd55a3dd459a279c39'
//   },
//   serverParameters: {
//     internalQueryFacetBufferSizeBytes: 104857600,
//     internalQueryFacetMaxOutputDocSizeBytes: 104857600,
//     internalLookupStageIntermediateDocumentMaxSizeBytes: 16793600,
//     internalDocumentSourceGroupMaxMemoryBytes: 104857600,
//     internalQueryMaxBlockingSortMemoryUsageBytes: 33554432,
//     internalQueryProhibitBlockingMergeOnMongoS: 0,
//     internalQueryMaxAddToSetBytes: 104857600,
//     internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600,
//     internalQueryFrameworkControl: 'trySbeRestricted',
//     internalQueryPlannerIgnoreIndexWithCollationForRegex: 1
//   },
//   ok: 1,
//   '$clusterTime': {
//     clusterTime: Timestamp({ t: 1762176140, i: 5 }),
//     signature: {
//       hash: Binary.createFromBase64('bY+voC/Bi547icpu9JIqFZ5anYk=', 0),
//       keyId: 7506953249669251000
//     }
//   },
//   operationTime: Timestamp({ t: 1762176140, i: 5 })
// }

