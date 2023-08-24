import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    id: {type: String, required: true},
    lastname: { type: String, required:true},
    name: {type: String, required:true},
    image: String,
    bio: String,
    onboarded: {
        type: Boolean,
        default: false
    },
    investments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Investment',
    }],  
      role: {
        type: String,
        enum: ["USER","ADMIN"],
        default: "USER"
      }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;