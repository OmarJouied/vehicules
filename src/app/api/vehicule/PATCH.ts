import Vehicule, { VehiculeType } from "@/models/Vehicule";
import ResponseType from "@/types/ResponseType";
import { wrapperEndPoints } from "@/utils/backend-functions";

const PATCH = wrapperEndPoints(async (req: Request) => {
  try {
    const {
      matricule, affectation, assurance, carnet_metrologe,
      dateachat, datemc, genre, marque, numchassis, poids,
      observation, prix_aquisiti, taxe_tenage, type, vignte,
      type_curburant, visite_technique
    }: VehiculeType = await req.json();

    const vehicule = await Vehicule.findOne({ matricule });
    if (!vehicule) return Response.json({ error: true, message: "Ce document n'existe pas" } as ResponseType, { status: 400 });

    Object.entries({
      matricule, affectation, assurance, carnet_metrologe,
      dateachat, datemc, genre, marque, numchassis, poids,
      observation, prix_aquisiti, taxe_tenage, type, vignte,
      type_curburant, visite_technique
    }).forEach(item => {
      vehicule[item[0]] = item[1];
    });

    await vehicule.save();

    return Response.json({ error: false, message: "Mis a jour avec succes" } as ResponseType, { status: 202 });
  } catch (error) {
    return Response.json({ error: true, message: "Erreur lors de la mise a jour du document" } as ResponseType, { status: 500 });
  }
})

export default PATCH;
