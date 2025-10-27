import { connectToMongo } from "./connections"

export const createOne = async (document: any) => {
    try {
        const db = await connectToMongo();

        const collection = db.collection("products");

        const result = await collection.insertOne(document); 

        return result;


    }catch (error) {
        console.error("Errore durante la creazione del documento:", error);
        throw error;
    }
}

export const updateOne = async (filter: any, update: any) => {
    try {
        const db = await connectToMongo();
        const collection = db.collection("products");
        const result = await collection.updateOne(filter, update);
        return result;
        
    }catch (error) {
        console.error(error);
        throw new Error("Errore durante l'aggiornamento del documento");
    }
}

export const deleteOne = async (filter: any) => {
    try {
        const db = await connectToMongo();
        const collection = db.collection("products");
        const result = await collection.deleteOne(filter);
        return result;
    } catch (error) {
        console.error("Errore durante l'eliminazione del documento:", error);
        throw error;
    }
}

export const createMany = async (documents: any[]) => {
    try {
        const db = await connectToMongo();
        const collection = db.collection("products");
        const result = await collection.insertMany(documents);
        return result;
    } catch (error) {
        console.error("Errore durante la creazione dei documenti:", error);
        throw error;
    }
}

