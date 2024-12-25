import mongoose, { InferSchemaType, models, Schema } from "mongoose";

const taxeSchema = new Schema({
  taxe_name: {
    type: String,
    required: true,
  },
  taxe_valeur: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now()
  },
});

const Taxe = models.Taxe || mongoose.model("Taxe", taxeSchema);

export default Taxe;

export type TaxeType = InferSchemaType<typeof taxeSchema>;