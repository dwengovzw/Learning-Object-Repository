import mongoose from "mongoose"
import crypto from "crypto"

const UserRoles = {
    ADMIN: "admin",
    USER: "user"
}

const Schema = mongoose;

const userSchema = new mongoose.Schema({
    username: {      // UUID (different from the automatically generated _id)
        type: String,
        required: true,
        trim: true
    },
    password_salt: {
        type: String,
        required: true,
        trim: true
    },
    password_hash: {    // Human readable unique id, can be any string chosen by the user -> generates error if chosen id exists. Should be different for each version of the same document.
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        required: true,
        trim: true,
        default: UserRoles.USER
    },
    approved: {
        type: Boolean,
        required: true,
        default: true  // This is to future proof the application. Currently we only support one admin user for managing the application.
    }
}, { timestamps: { createdAt: 'created_at' } });


// Method to set salt and hash the password for a user 
userSchema.methods.setPassword = function (password) {

    // Creating a unique salt for a particular user 
    this.password_salt = crypto.randomBytes(16).toString('hex');

    // Hashing user's salt and password with 1000 iterations, 

    this.password_hash = crypto.pbkdf2Sync(password, this.password_salt,
        1000, 64, `sha512`).toString(`hex`);
};

// Method to check the entered password is correct or not 
userSchema.methods.validPassword = function (password) {
    var hash = crypto.pbkdf2Sync(password,
        this.password_salt, 1000, 64, `sha512`).toString(`hex`);
    return this.password_hash === hash;
};


const User = mongoose.model('User', userSchema);

export default User
export { UserRoles }
