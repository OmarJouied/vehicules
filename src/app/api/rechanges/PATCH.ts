import Rechange, { RechangeType } from "@/models/Rechange";
import ResponseType from "@/types/ResponseType";
import { NormalDate, wrapperEndPoints } from "@/utils/backend-functions";

const PATCH = wrapperEndPoints(async (req: Request) => {
  try {
    const data: RechangeType[] = await req.json();
    await Promise.all(data.map(row => updateVehicule(row)));

    return Response.json({ error: false, message: "Mis a jour avec succes" } as ResponseType, { status: 202 });
  } catch ({ message }: any) {
    return Response.json({ error: true, message } as ResponseType, { status: 500 });
  }
})

const updateVehicule = async ({
  consommateurs, products, date, n_bon, _id
}: RechangeType) => {
  const rechange = await Rechange.findById(_id);
  if (!rechange) throw new Error("Ce document n'existe pas, n_bon: " + n_bon);

  Object.entries({
    consommateurs, products, date, n_bon,
  }).forEach(item => {
    rechange[item[0]] = item[0] === "date" ? new NormalDate(item[1] as any).parse() : item[1];
  });

  try {
    await rechange.save();
  } catch {
    throw new Error("Erreur lors de la mise a jour du document")
  }
}

export default PATCH;
