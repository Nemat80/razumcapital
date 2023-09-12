import mongoose from "mongoose";


const investmentSchema = new mongoose.Schema({
    amount: {
      type: Number,
      required: true, 
    },
    investor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    date: {
      type: String,
      required: true,
    },
    contract: {type: String},
  });
  
  const Investment = mongoose.models.Investment || mongoose.model('Investment', investmentSchema);

  export default Investment;  