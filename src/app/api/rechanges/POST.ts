import Rechange, { RechangeType } from "@/models/Rechange";
import ResponseType from "@/types/ResponseType";
import { NormalDate, wrapperEndPoints } from "@/utils/backend-functions";

const POST = wrapperEndPoints(async (req: Request) => {
  try {
    const data = await req.json();

    const refData = typeof data.length === "undefined" ? [await createRechange(data)] : await Promise.all(data.map((row: any) => createRechange(row)));

    return Response.json({ error: false, message: "Cree avec succes", refData } as ResponseType, { status: 201 });
  } catch ({ message }: any) {
    return Response.json({ error: true, message } as ResponseType, { status: 500 });
  }
})

const createRechange = async ({
  n_bon, matricule, destination, specification, reference, qte, prix_unitere, date, extern,
}: RechangeType) => {
  try {
    const newRechange = await Rechange.create({
      n_bon, matricule, destination, specification, reference, qte, prix_unitere, date: new NormalDate(date as any).parse(), extern: (extern as any) === "oui" ? true : undefined,
    });
    return { n_bon, _id: newRechange._id }
  } catch (err: any) {
    throw new Error("Erreur lors de la creation de ce document: " + err.message);
  }
}

export default POST;
