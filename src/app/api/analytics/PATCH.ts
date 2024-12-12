import Prix from "@/models/Prix";
import ResponseType from "@/types/ResponseType";
import { wrapperEndPoints } from "@/utils/backend-functions";

const POST = wrapperEndPoints(async (req: Request) => {
  try {
    const [{ lub, diesel, essence_ksar, essence_tetouan }] = await req.json();

    await Prix.findOneAndReplace({}, { lub, type_carburant: { diesel, essence_tetouan, essence_ksar } });
    return Response.json({ error: false, message: "Mis a jour avec succes" } as ResponseType, { status: 201 });
  } catch {
    return Response.json({ error: true, message: "Erreur lors de la mise a jour du document" } as ResponseType, { status: 500 })
  }
})

export default POST;
