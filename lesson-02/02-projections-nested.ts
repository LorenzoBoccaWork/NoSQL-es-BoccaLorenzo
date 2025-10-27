import { connectToDatabase, closeConnection } from '../../utils/connection.js';

const esercizio02 = async () => {
  try {
    const db = await connectToDatabase();
    const products = db.collection('products');
    const users = db.collection('users');
    
    console.log('📝 Esercizio 02: Projections Nested\n');
    
    // Parte A: Nested fields nei prodotti
    console.log('A) Prodotti con rating medio:\n');
    
    const resultA = await products.aggregate([
      {
        $addFields: {
          averageRating: { $avg: "$reviews.rating" }
        }
      },
      {
        $project: {
          name: 1,
          averageRating: 1,
          _id: 0
        }
      },
      { $limit: 10 }
    ]).toArray();
    
    resultA.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Rating medio: ${product.averageRating ? product.averageRating.toFixed(2) : 'N/A'}`);
      console.log('');
    });
    
    // Parte B: $slice per limitare array
    console.log('\n\nB) Prodotti con primi 3 tags:\n');
    
    const resultB = await products.find(
      {},
      { 
        projection: {
          name: 1,
          tags: { $slice: 3 },
          _id: 0
        }
      }
    ).limit(10).toArray();
    
    resultB.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Tags: ${product.tags ? product.tags.join(', ') : 'Nessuno'}`);
      console.log('');
    });
    
    // Parte C: Utenti con indirizzo parziale
    console.log('\n\nC) Utenti con città e stato:\n');
    
    const resultC = await users.find(
      {},
      { 
        projection: {
          name: 1,
          "address.city": 1,
          "address.state": 1,
          _id: 0
        }
      }
    ).limit(10).toArray();
    
    resultC.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name}`);
      console.log(`   Città: ${user.address?.city || 'N/A'}`);
      console.log(`   Stato: ${user.address?.state || 'N/A'}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Errore:', error);
  } finally {
    await closeConnection();
  }
};

esercizio02();