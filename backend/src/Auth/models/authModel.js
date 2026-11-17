const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({


username: {  type: String, required: true, trim: true
},

email: {  type: String, required: true, unique: true,lowercase: true,trim: true
},

password: {
    type: String,
    required: function () {
        return !this.googleId;
    },
    minlength: 8
},

googleId: {
    type: String,
    sparse: true,
    default: null
},

isEmailVerified: {  type: Boolean, default: false
},

role: { type: String, enum: ["customer", "admin", "superadmin"], default: "customer"
},

phone: { type: String, trim: true }


}, {
timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;
