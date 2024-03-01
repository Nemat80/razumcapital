import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    id: {type: String, required: true},
    name: {type: String, required:true},
    lastname: { type: String, required:true},
    image: String,
    bio: String,
      mail: {
        type: String,
        required: true
      },
      tel: {
        type: String,
        required: true,
        match: /^(\+7|8)\s?\(\d{3}\)\s?\d{3}-\d{2}-\d{2}$/
      },
      city: {
        type: String,
        required: true    
      },
      passport_series: {
        type: String, 
        required: true    
      },  
      passport_number: {
        type: String,
        required: true,
        match: /^\d{6}$/
      },
      cardNumber: { type: String },
      role: {
        type: String,
        enum: ["USER","ADMIN"],
        default: "USER"
      },
      investments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Investment',
      }],  
      onboarded: {
        type: Boolean,
        default: false
    },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;