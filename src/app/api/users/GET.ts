import User from "@/models/User"
import ResponseType from "@/types/ResponseType";
import { wrapperEndPoints } from "@/utils/backend-functions";

const GET = wrapperEndPoints(async (req: any) => {
  try {
    const { searchParams } = new URL(`http://localhost/${req.url}`)
    const name = searchParams.get("name") ?? "";
    let users = [];
    if (name) {
      users = await User.findOne({ nom: name }, { "__v": 0 })
    } else {
      users = await User.find({}, { "__v": 0 }).sort({ date: -1 })
    }

    return Response.json({ users }, { status: 200 })
  } catch {
    return Response.json({ error: true, message: "Erreur de chargement des donnees" } as ResponseType, { status: 500 })
  }
})

export default GET