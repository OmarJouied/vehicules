import mongoose, { InferSchemaType, models, Schema } from "mongoose";

const prixSchema = new Schema({
  prix_name: {
    type: String,
    required: true,
  },
  prix_valeur: {
    type: Number,
    required: true,
  },
  est_carburant: Boolean,
  date: {
    type: Date,
    default: Date.now()
  },
});

const Prix = models.Prix || mongoose.model("Prix", prixSchema);

export default Prix;

export type PrixType = InferSchemaType<typeof prixSchema>;