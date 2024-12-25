import mongoose, { InferSchemaType, models, Schema } from "mongoose";

const validateEmail = (email: string) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
const validatePassword = (password: string) => password.length >= 8

const userSchema = new Schema({
  nom: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validateEmail, "Entrez un email valide"],
  },
  password: {
    type: String,
    required: true,
    validate: [validatePassword, "Entrez une password avec longueur superieure ou egale a 8"],
  },
  phone: String,
  date: {
    type: Date,
    default: Date.now()
  },
  permissions: Schema.Types.Mixed,
});

const User = models.User || mongoose.model("User", userSchema);

export default User;

export type UserType = InferSchemaType<typeof userSchema> & { _id: string };