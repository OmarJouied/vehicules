export type Vehicule = {
  matricule: string
  marque: string
  status: "pending" | "processing" | "success" | "failed"
  email: string
}