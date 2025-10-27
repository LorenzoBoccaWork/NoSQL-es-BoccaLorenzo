import { connectToDatabase, closeConnection } from '../../utils/connection.js';

const esercizio03 = async () => {
  try {
    const db = await connectToDatabase();
    const products = db.collection('products');
    
    console.log('Esercizio 03: Sorting Base\n');
    
    // A) Sort per prezzo (crescente)
    console.log('A) Prodotti dal più economico al più costoso:\n');
    
    const resultA = await products.find(
      { status: 'active' },
      { projection: { name: 1, price: 1, category: 1, _id: 0 } }
    ).sort({ price: 1 }).limit(5).toArray();
    
    resultA.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Prezzo: $${product.price.toFixed(2)}`);
      console.log(`   Categoria: ${product.category}`);
      console.log('');
    });
    
    // B) Sort per prezzo (decrescente)
    console.log('\n\nB) Top 5 prodotti più costosi:\n');
    
    const resultB = await products.find(
      { status: 'active' },
      { projection: { name: 1, price: 1, category: 1, _id: 0 } }
    ).sort({ price: -1 }).limit(5).toArray();
    
    resultB.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Prezzo: $${product.price.toFixed(2)}`);
      console.log(`   Categoria: ${product.category}`);
      console.log('');
    });
    
    // C) Multi-field sort
    console.log('\n\nC) Prodotti per categoria (A-Z), poi per prezzo (alto-basso):\n');
    
    const resultC = await products.find(
      { status: 'active' },
      { projection: { name: 1, price: 1, category: 1, _id: 0 } }
    ).sort({ category: 1, price: -1 }).limit(10).toArray();
    
    let currentCategory = '';
    resultC.forEach((product) => {
      if (product.category !== currentCategory) {
        console.log(`--- ${product.category} ---`);
        currentCategory = product.category;
      }
      console.log(`  ${product.name} - $${product.price.toFixed(2)}`);
    });
    console.log('');
    
    // D) Sort per nested field (rating)
    console.log('\n\nD) Top 5 prodotti per rating:\n');
    
    const resultD = await products.find(
      { 'rating.count': { $gte: 10 } },
      { projection: { name: 1, 'rating.average': 1, 'rating.count': 1, _id: 0 } }
    ).sort({ 'rating.average': -1 }).limit(5).toArray();
    
    resultD.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Rating medio: ${product.rating.average.toFixed(2)}`);
      console.log(`   Numero recensioni: ${product.rating.count}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Errore:', error);
  } finally {
    await closeConnection();
  }
};

esercizio03();