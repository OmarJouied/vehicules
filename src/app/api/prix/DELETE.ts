import Prix from "@/models/Prix";
import ResponseType from "@/types/ResponseType";
import { wrapperEndPoints } from "@/utils/backend-functions";

const DELETE = wrapperEndPoints(async (req: Request) => {
  try {
    const ids: string[] = await req.json();

    await Prix.deleteMany({ _id: ids });

    return Response.json({ error: false, message: "Supprime avec succes" } as ResponseType, { status: 202 });
  } catch (err: any) {
    return Response.json({ error: true, message: "Erreur lors de la suppression du document: " + err.message } as ResponseType, { status: 500 })
  }
})

export default DELETE;
