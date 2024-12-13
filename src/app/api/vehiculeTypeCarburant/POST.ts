import VehiculeTypeCarburant, { VehiculeTypeCarburantType } from "@/models/VehiculeTypeCarburant";
import ResponseType from "@/types/ResponseType";
import { NormalDate, wrapperEndPoints } from "@/utils/backend-functions";

const POST = wrapperEndPoints(async (req: Request) => {
  try {
    const data = await req.json();

    const refData = typeof data.length === "undefined" ? [await createVehiculeTypeCarburant(data)] : await Promise.all(data.map((row: any) => createVehiculeTypeCarburant(row)));

    return Response.json({ error: false, message: "Cree avec succes", refData } as ResponseType, { status: 201 });
  } catch ({ message }: any) {
    return Response.json({ error: true, message } as ResponseType, { status: 500 })
  }
})

const createVehiculeTypeCarburant = async ({
  date, matricule, type_carburant
}: VehiculeTypeCarburantType) => {
  const vehicule = await VehiculeTypeCarburant.findOne({ matricule, date: new NormalDate(date as any).parse() });
  if (vehicule) throw new Error(`Cet article existe deja, matricule: ${matricule}, date: ${date}`);

  try {
    const newVehiculeTypeCarburant = await VehiculeTypeCarburant.create({
      date: new NormalDate(date as any).parse(), matricule, type_carburant
    });

    return { matricule, _id: newVehiculeTypeCarburant._id }
  } catch {
    throw new Error("Erreur lors de la creation de ce document")
  }
}

export default POST;
