import LearningObject from "./learning_object.js";
import LearningPath from "./learning_path.js";
import NonceStore from "./nonce_store.js";
import ContentRequest from "./content_request.js";
import ProcessingHistory from "./processing_history.js";
import User from "./user.js"
import mongoose from "mongoose"

const connectDb = () => {
    return mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true ,useFindAndModify: false });
}

const dropDb = () => {
    mongoose.connection.dropDatabase();
}

const models = { LearningObject, LearningPath, NonceStore, ContentRequest, ProcessingHistory, User }; // TODO: add other models ex. learning path

export { connectDb, dropDb , models }