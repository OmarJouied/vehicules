import mongoose, { InferSchemaType, models, Schema } from "mongoose";

const depenseSupplementaireSchema = new Schema({
  matricule: {
    type: String,
    required: true,
  },
  type_depense: String,
  valeur: {
    type: Number,
    default: 0
  },
  date: Date,
});

const DepenseSupplementaire = models.DepenseSupplementaire || mongoose.model("DepenseSupplementaire", depenseSupplementaireSchema);

export default DepenseSupplementaire;

export type DepenseSupplementaireType = InferSchemaType<typeof depenseSupplementaireSchema> & { _id: string };