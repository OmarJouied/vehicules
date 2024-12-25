import User from "@/models/User";
import ResponseType from "@/types/ResponseType";
import { wrapperEndPoints } from "@/utils/backend-functions";

const DELETE = wrapperEndPoints(async (req: Request) => {
  try {
    const ids: string[] = await req.json();

    await User.deleteMany({ _id: ids });

    return Response.json({ error: false, message: "Supprime avec succes" } as ResponseType, { status: 202 });
  } catch {
    return Response.json({ error: true, message: "Erreur lors de la suppression du document" } as ResponseType, { status: 500 })
  }
})

export default DELETE;
