import mongoose, { InferSchemaType, models, Schema } from "mongoose";

const prixSchema = new Schema({
  type_curburant: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  value: Number,
});

const Prix = models.Prix || mongoose.model("Prix", prixSchema);

export default Prix;

export type PrixType = InferSchemaType<typeof prixSchema>;