import mongoose, { InferSchemaType, models, Schema } from "mongoose";

const vehiculeTypeCarburantSchema = new Schema({
  matricule: {
    type: String,
    required: true,
  },
  type_carburant: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now()
  },
});

const VehiculeTypeCarburant = models.VehiculeTypeCarburant || mongoose.model("VehiculeTypeCarburant", vehiculeTypeCarburantSchema);

export default VehiculeTypeCarburant;

export type VehiculeTypeCarburantType = InferSchemaType<typeof vehiculeTypeCarburantSchema>;