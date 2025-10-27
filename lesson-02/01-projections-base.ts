import { connectToDatabase, closeConnection } from '../../utils/connection';

const esercizio01 = async () => {
  try {
    const db = await connectToDatabase();
    const products = db.collection('products');
    
    console.log(' Esercizio 01: Projections Base\n');
    
    // ========================================
    // SCRIVI LA TUA QUERY QUI
    // ========================================
    
    const result = await products
      .find(
        // TODO: Aggiungi filtro
        { status: 'active' },
        { 
          projection: {
            // TODO: Aggiungi projection
            name: 1,
            price: 1,
            category: 1,
            _id: 0
          }
        }
      )
      .limit(10)
      .toArray();
    
    // ========================================
    // OUTPUT
    // ========================================
    
    console.log(`Trovati ${result.length} prodotti:\n`);
    result.forEach((product: any, index: number) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Categoria: ${product.category}`);
      console.log(`   Prezzo: $${product.price.toFixed(2)}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('Errore:', error);
  } finally {
    // await closeConnection();
  }
};

esercizio01();
