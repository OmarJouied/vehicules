import Prix, { PrixType } from "@/models/Prix";
import ResponseType from "@/types/ResponseType";
import { NormalDate, wrapperEndPoints } from "@/utils/backend-functions";

const POST = wrapperEndPoints(async (req: Request) => {
  try {
    const data = await req.json();

    const refData = typeof data.length === "undefined" ? [await createPrix(data)] : await Promise.all(data.map((row: any) => createPrix(row)));

    return Response.json({ error: false, message: "Cree avec succes", refData } as ResponseType, { status: 201 });
  } catch ({ message }: any) {
    return Response.json({ error: true, message } as ResponseType, { status: 500 })
  }
})

const createPrix = async ({
  date, est_carburant, prix_name, prix_valeur
}: PrixType) => {
  const vehicule = await Prix.findOne({ prix_name, date: new NormalDate(date as any).parse() });
  if (vehicule) throw new Error(`Cet article existe deja, prix_name: ${prix_name}, date: ${date}`);

  try {
    const newPrix = await Prix.create({
      date: new NormalDate(date as any).parse(), est_carburant, prix_name, prix_valeur
    });

    return { prix_name, _id: newPrix._id }
  } catch (err: any) {
    throw new Error("Erreur lors de la creation de ce document: " + err.message);
  }
}

export default POST;
