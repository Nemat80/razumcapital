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
    irequests: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'IRequest',
    }],  
    perMonth: {
      type: String,
      default: "PER_SIX_MONTH",
    },
  });
  
  const Investment = mongoose.models.Investment || mongoose.model('Investment', investmentSchema);

  export default Investment;  