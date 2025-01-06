import User from "@/models/User"
import ResponseType from "@/types/ResponseType";
import { wrapperEndPoints } from "@/utils/backend-functions";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";

const GET = wrapperEndPoints(async (req: any) => {
  try {
    const session = await getServerSession(options);
    const user = await User.findById(session?.user.id, { "__v": 0, permissions: 0 });

    return Response.json({ user, nom: session?.user.name }, { status: 200 })
  } catch (err: any) {
    return Response.json({ error: true, message: "Erreur de chargement des donnees: " + err.message } as ResponseType, { status: 500 })
  }
})

export default GET