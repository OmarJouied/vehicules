import mongoose, { InferSchemaType, models, Schema } from "mongoose";

const deplacementSchema = new Schema({
  matricule: String,
  destination: String,
  conductor: String,
  date: Date,
  vidange: Number,
  filter_changer: Boolean,
  qte_lub: Number,
  qte_carburant: Number,
  qte_carburant_ext: Number,
  prix_carburant_ext: Number,
  kilometrage: Number,
});

const Deplacement = models.Deplacement || mongoose.model("Deplacement", deplacementSchema);

export default Deplacement;

export type DeplacementType = InferSchemaType<typeof deplacementSchema> & { _id: string };