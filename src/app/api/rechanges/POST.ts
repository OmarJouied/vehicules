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
  consommateurs, products, date, n_bon,
}: RechangeType) => {
  const rechange = await Rechange.findOne({ n_bon });
  if (rechange) throw new Error(`Cet article existe deja, n_bon: ${n_bon}`);

  try {
    const newRechange = await Rechange.create({
      consommateurs, products, date: new NormalDate(date as any).parse(), n_bon,
    });
    return { n_bon, _id: newRechange._id }
  } catch {
    throw new Error("Erreur lors de la creation de ce document");
  }
}

export default POST;
