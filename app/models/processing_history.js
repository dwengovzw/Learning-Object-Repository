import mongoose from "mongoose"


const processingHistorySchema = new mongoose.Schema({
    hruid: {    // Human readable unique id, can be any string chosen by the user -> generates error if chosen id exists. Should be different for each version of the same document.
        type: String,
        required: true,
        trim: true,
    },
    version: {
        type: Number,
        required: true,
        trim: true
    },
    language: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        enum: ["aa", "ab", "af", "ak", "sq", "am", "ar", "an", "hy", "as", "av", "ae", "ay", "az", "ba", "bm", "eu", "be", "bn", "bh", "bi", "bs", "br", "bg", "my", "ca", "ch", "ce", "zh", "cu", "cv", "kw", "co", "cr", "cs", "da", "dv", "nl", "dz", "en", "eo", "et", "ee", "fo", "fj", "fi", "fr", "fy", "ff", "ka", "de", "gd", "ga", "gl", "gv", "el", "gn", "gu", "ht", "ha", "he", "hz", "hi", "ho", "hr", "hu", "ig", "is", "io", "ii", "iu", "ie", "ia", "id", "ik", "it", "jv", "ja", "kl", "kn", "ks", "kr", "kk", "km", "ki", "rw", "ky", "kv", "kg", "ko", "kj", "ku", "lo", "la", "lv", "li", "ln", "lt", "lb", "lu", "lg", "mk", "mh", "ml", "mi", "mr", "ms", "mg", "mt", "mn", "na", "nv", "nr", "nd", "ng", "ne", "nn", "nb", "no", "ny", "oc", "oj", "or", "om", "os", "pa", "fa", "pi", "pl", "pt", "ps", "qu", "rm", "ro", "rn", "ru", "sg", "sa", "si", "sk", "sl", "se", "sm", "sn", "sd", "so", "st", "es", "sc", "sr", "ss", "su", "sw", "sv", "ty", "ta", "tt", "te", "tg", "tl", "th", "bo", "ti", "to", "tn", "ts", "tk", "tr", "tw", "ug", "uk", "ur", "uz", "ve", "vi", "vo", "cy", "wa", "wo", "xh", "yi", "yo", "za", "zu"],
    },
    wasUpdated:{
        type: Boolean,
        default: false,
        required: true
    },
    errorList:[String],
    infoList: [String]
    
}, { _id: false, timestamps: { updatedAt: 'updated_at' } });

processingHistorySchema.index({ hruid: 1, version: 1, language: 1 }, { unique: true });


// Bad code, refactor!!!!
processingHistorySchema.statics.info = async function(hruid, version, language, message, title=null){
    const session = await this.startSession();
    session.withTransaction(async () => {
        // Each time processing is run, the errorlist and infoList should be cleared the first time new information is logged
        // If the entry has been updated before during this processing step, the log does not have to be cleared
        let previousEntry = await this.findOne({hruid: hruid, version: version, language: language}).exec()
        if (previousEntry && !previousEntry.wasUpdated){
            await this.updateOne({hruid: hruid, version: version, language: language},
                {infoList: [], errorList: []},
                {upsert: true})
        }

        message = (new Date()).toISOString() + " [INFO]: " + (title ? title + "\n" : "") + message + "\n"
                + (message.charAt(message.length - 1) == "\n" ? "" : "\n");
        await this.findOneAndUpdate({hruid: hruid, version: version, language: language},
            {$push: { infoList: message }, wasUpdated: true}, 
            {upsert: true}
        )
    })
    session.endSession();
}

processingHistorySchema.statics.error = async function(hruid, version, language, message, title=null){
    const session = await this.startSession();
    session.withTransaction(async () => {
        let previousEntry = await this.findOne({hruid: hruid, version: version, language: language}).exec()
        if (previousEntry && !previousEntry.wasUpdated){
            await this.updateOne({hruid: hruid, version: version, language: language},
                {errorList: [], infoList: []},
                {upsert: true})
        }

        message = (new Date()).toISOString() + " [ERROR]: " + (title ? title + "\n" : "") + message + "\n"
                + (message.charAt(message.length - 1) == "\n" ? "" : "\n");
        await this.findOneAndUpdate({hruid: hruid, version: version, language: language},
            {$push: { errorList: message }, wasUpdated: true}, 
            {upsert: true}
        )
    })
    session.endSession();
}

processingHistorySchema.statics.markAsNew = async function(hruid, version, language){
    await this.findOneAndUpdate({
            hruid: hruid,
            version: version,
            language: language
        },{
            wasUpdated: true 
        }, {
            upsert: true
        }
    )
}

processingHistorySchema.statics.removeOldEntries = async function(){
    return await this.deleteOne({wasUpdated: false})
}

processingHistorySchema.statics.markAllAsOld = async function(){
    let res = await this.updateMany({wasUpdated: true}, {wasUpdated: false})
}

processingHistorySchema.statics.getLastProcessedTime = async function(hruid, version, language){
    let entry = await this.findOne({hruid: hruid, version: version, language: language}).exec()
    if (entry){
        return entry.updated_at.getTime()
    }else{
        return 0
    }
}

const ProcessingHistory = mongoose.model('ProcessingHistory', processingHistorySchema);


export default ProcessingHistory
