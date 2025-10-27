import { connectToDatabase, closeConnection } from '../../utils/connection.js';

const esercizio04 = async () => {
  try {
    const db = await connectToDatabase();
    const products = db.collection('products');
    
    console.log('Esercizio 04: Sorting con Pagination\n');
    
    // Parte A: Pagination base
    const PAGE_SIZE = 5;
    const currentPage = 2;
    
    const skip = (currentPage - 1) * PAGE_SIZE;
    
    const resultA = await products.find()
      .sort({ name: 1 })
      .skip(skip)
      .limit(PAGE_SIZE)
      .toArray();
    
    const totalDocuments = await products.countDocuments();
    const totalPages = Math.ceil(totalDocuments / PAGE_SIZE);
    
    console.log(`A) Pagina ${currentPage} di ${totalPages} (totale documenti: ${totalDocuments}):\n`);
    resultA.forEach((product: any, index: number) => {
      console.log(`${index + 1}. ${product.name}`);
    });
    console.log('');
    
    // Parte B: Funzione riutilizzabile
    const paginate = async (page: number, pageSize: number) => {
      const skip = (page - 1) * pageSize;
      const data = await products.find()
        .sort({ name: 1 })
        .skip(skip)
        .limit(pageSize)
        .toArray();
      const totalDocuments = await products.countDocuments();
      const totalPages = Math.ceil(totalDocuments / pageSize);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;
      return {
        data,
        pagination: {
          currentPage: page,
          pageSize,
          totalDocuments,
          totalPages,
          hasNextPage,
          hasPrevPage
        }
      };
    };
    
    // Testa la funzione con pagina 3
    const resultB = await paginate(3, 5);
    console.log('B) Risultato funzione paginate per pagina 3:');
    console.log(`   Pagina corrente: ${resultB.pagination.currentPage}`);
    console.log(`   Pagine totali: ${resultB.pagination.totalPages}`);
    console.log(`   Ha pagina successiva: ${resultB.pagination.hasNextPage}`);
    console.log(`   Ha pagina precedente: ${resultB.pagination.hasPrevPage}`);
    console.log(`   Documenti nella pagina: ${resultB.data.length}`);
    resultB.data.forEach((product: any, index: number) => {
      console.log(`   ${index + 1}. ${product.name}`);
    });
    
  } catch (error) {
    console.error('Errore:', error);
  } finally {
    await closeConnection();
  }
};

esercizio04();