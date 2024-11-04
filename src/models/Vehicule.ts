import mongoose, { InferSchemaType, models, Schema } from "mongoose";

const vehiculeSchema = new Schema({
  matricule: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  marque: String,
  numchassis: String,
  poids: Number,
  dateachat: Date,
  affectation: String,
  type: String,
  type_curburant: String,
  datemc: Date,
  genre: String,
  prix_aquisiti: Number,
  observation: String,
  vignte: Number,
  taxe_tenage: Number,
  assurance: Number,
  visite_technique: Number,
  carnet_metrologe: Number,
});

const Vehicule = models.Vehicule || mongoose.model("Vehicule", vehiculeSchema);

export default Vehicule;

export type VehiculeType = InferSchemaType<typeof vehiculeSchema>;