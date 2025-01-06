import User from "@/models/User"
import ResponseType from "@/types/ResponseType";
import { wrapperEndPoints } from "@/utils/backend-functions";

const GET = wrapperEndPoints(async (req: any) => {
  try {
    const admin = await User.findOne({ permissions: '*' });

    return Response.json({ admin }, { status: 200 })
  } catch (err: any) {
    return Response.json({ error: true, message: "Erreur de chargement des donnees: " + err.message } as ResponseType, { status: 500 })
  }
})

export default GET