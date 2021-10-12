import LearningObject from "./learning_object.js";
import mongoose from "mongoose"

const connectDb = () => {
    return mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true ,useFindAndModify: false });
}

const models = { LearningObject }; // TODO: add other models ex. learning path

export { connectDb , models }