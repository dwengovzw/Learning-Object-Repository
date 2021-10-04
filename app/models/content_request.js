import mongoose from "mongoose"

const Schema = mongoose;

const contentRequestSchema = new mongoose.Schema({
    user_id: {      // UUID (different from the automatically generated _id)
        type: String,
        required: true,
        trim: true
    },
    content_id: {    // Human readable unique id, can be any string chosen by the user -> generates error if chosen id exists. Should be different for each version of the same document.
        type: String,
        required: true,
        trim: true
    },
    

}, { timestamps: { createdAt: 'created_at' } });


const ContentRequest = mongoose.model('ContentRequest', contentRequestSchema);

export default ContentRequest
