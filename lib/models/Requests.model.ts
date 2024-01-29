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


const Request = mongoose.models.Request || mongoose.model("Requests", requestSchema);

export default Request;
