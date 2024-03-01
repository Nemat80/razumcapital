import mongoose from "mongoose"

const requestSchema = new mongoose.Schema({
  investmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Investment",
    required: true,
  },
    index: { 
      type: Number,  
      required: true,
    },
    method: {
      type: String,
      required: true,
    },
    initials: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
})


const IRequest = mongoose.models.IRequest || mongoose.model("IRequest", requestSchema);

export default IRequest;
