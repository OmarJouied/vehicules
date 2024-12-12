import VehiculeTypeCarburant from "@/models/VehiculeTypeCarburant"
import ResponseType from "@/types/ResponseType";
import { wrapperEndPoints } from "@/utils/backend-functions";

const GET = wrapperEndPoints(async () => {
  try {
    const vehiculeTypeCarburant = await VehiculeTypeCarburant.find({}, { "__v": 0 }).sort({ date: -1 })

    return Response.json({ vehiculeTypeCarburant }, { status: 200 })
  } catch (err: any) {
    return Response.json({ error: true, message: "Erreur de chargement des donnees " + err.message } as ResponseType, { status: 500 })
  }
})

export default GET