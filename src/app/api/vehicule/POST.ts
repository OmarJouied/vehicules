import Vehicule, { VehiculeType } from "@/models/Vehicule";
import ResponseType from "@/types/ResponseType";
import { wrapperEndPoints } from "@/utils/backend-functions";

const POST = wrapperEndPoints(async (req: Request) => {
  try {
    const {
      matricule, affectation, assurance, carnet_metrologe,
      dateachat, datemc, genre, marque, numchassis, poids,
      observation, prix_aquisiti, taxe_tenage, type, vignte,
      type_curburant, visite_technique
    }: VehiculeType = await req.json();

    const vehicule = await Vehicule.findOne({ matricule });
    if (vehicule) return Response.json({ error: true, message: "Cet article existe deja" } as ResponseType, { status: 500 })

    await Vehicule.create({
      matricule, affectation, assurance, carnet_metrologe,
      dateachat, datemc: (datemc as unknown as string).split('/').reverse(), genre, marque, numchassis, poids,
      observation, prix_aquisiti, taxe_tenage, type, vignte,
      type_curburant, visite_technique
    });

    return Response.json({ error: false, message: "Cree avec succes" } as ResponseType, { status: 201 });
  } catch {
    return Response.json({ error: true, message: "Erreur lors de la creation de ce document" } as ResponseType, { status: 500 })
  }
})

export default POST;
