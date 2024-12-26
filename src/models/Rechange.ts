import mongoose, { InferSchemaType, models, Schema } from "mongoose";

const rechangeSchema = new Schema({
  matricule: {
    type: String,
    required: true,
  },
  destination: String,
  specification: {
    type: String,
    required: true,
  },
  reference: String,
  qte: Number,
  prix_unitere: Number,
  n_bon: {
    type: Number,
    required: true,
  },
  extern: Boolean,
  date: {
    type: Date,
    default: Date.now()
  },
});

const Rechange = models.Rechange || mongoose.model("Rechange", rechangeSchema);

export default Rechange;

export type RechangeType = InferSchemaType<typeof rechangeSchema> & { _id: string };