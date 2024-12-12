import mongoose, { InferSchemaType, models, Schema } from "mongoose";

const vehiculeSchema = new Schema({
  matricule: {
    type: String,
    required: true,
    unique: true,
  },
  marque: String,
  numchassis: String,
  poids: Number,
  dateachat: String,
  affectation: String,
  type: String,
  datemc: String,
  genre: String,
  prix_aquisiti: Number,
  observation: String,
});

const Vehicule = models.Vehicule || mongoose.model("Vehicule", vehiculeSchema);

export default Vehicule;

export type VehiculeType = InferSchemaType<typeof vehiculeSchema> & { _id: string };