import { connectToMongo } from '../src/mongo/connections.js';

export const connectToDatabase = connectToMongo;

export const closeConnection = async () => {
  // MongoDB client handles connection closing automatically
  // Nota: Se necessario, aggiungi logica per chiudere la connessione esplicitamente,
  // ad es. se connectToMongo restituisce un client, chiama client.close()
};