import mongoose, { InferSchemaType, models, Schema } from "mongoose";

const rechangeSchema = new Schema({
  n_bon: {
    type: Number,
    required: true,
    unique: true,
  },
  consommateurs: [new Schema({
    matricule: String,
    destination: String,
  })],
  products: [new Schema({
    specification: String,
    reference: String,
    qte: Number,
    prix_unitere: Number
  })],
  date: Date,
});

const Rechange = models.Rechange || mongoose.model("Rechange", rechangeSchema);

export default Rechange;

export type RechangeType = InferSchemaType<typeof rechangeSchema> & { _id: string };