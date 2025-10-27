import { MongoClient, MongoCursorInUseError, MongoDBCollectionNamespace } from "mongodb";

export const connectToMongo = async () => {
    const  mongoUrl = process.env.MONGODB_URI;
    if(!mongoUrl) {
        throw new Error("MONGODB_URI is not defined in environment variables");
    }

    const dbName = process.env.MONGODB_DB_NAME;

    try{
        const client = new MongoClient(mongoUrl, {
            maxPoolSize: 10,
        });

        // Connetto il client a mongodb
        const connection = await client.connect();

        // Ottengo il database
        const db = connection.db(dbName);

        // Restituisco il DB
        return db;



    }
    catch (error) {
        console.error("Errore di connessione a MongoDB:", error);
        throw error;
    }
}