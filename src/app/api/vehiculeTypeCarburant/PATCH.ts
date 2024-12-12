import VehiculeTypeCarburant, { VehiculeTypeCarburantType } from "@/models/VehiculeTypeCarburant";
import ResponseType from "@/types/ResponseType";
import { NormalDate, wrapperEndPoints } from "@/utils/backend-functions";

const PATCH = wrapperEndPoints(async (req: Request) => {
  try {
    const data: VehiculeTypeCarburantType[] = await req.json();
    await Promise.all(data.map((row: any) => updateVehiculeTypeCarburant(row)));

    return Response.json({ error: false, message: "Mis a jour avec succes" } as ResponseType, { status: 202 });
  } catch ({ message }: any) {
    return Response.json({ error: true, message } as ResponseType, { status: 500 });
  }
})

const updateVehiculeTypeCarburant = async ({
  date, matricule, type_carburant, _id
}: VehiculeTypeCarburantType & { _id: string }) => {
  const prix = await VehiculeTypeCarburant.findById(_id);
  if (!prix) throw new Error("Ce document n'existe pas, pour modifier la matricule avec: " + matricule + " et " + date);

  Object.entries({
    date: new NormalDate(date as any).parse(), matricule, type_carburant
  }).forEach(item => {
    prix[item[0]] = item[1];
  });

  try {
    await prix.save();
  } catch (error) {
    throw new Error("Erreur lors de la mise a jour du document")
  }
}

export default PATCH;
