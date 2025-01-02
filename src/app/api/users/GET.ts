import User from "@/models/User"
import ResponseType from "@/types/ResponseType";
import { wrapperEndPoints } from "@/utils/backend-functions";
import { pageRowsLength } from "..";

const GET = wrapperEndPoints(async (req: any) => {
  try {
    const { searchParams } = new URL(`http://localhost/${req.url}`)
    const name = searchParams.get("name") ?? "";
    const more = searchParams.get("more") ?? "";
    let data = [];
    if (name) {
      data = await User.findOne({ nom: name }, { "__v": 0 })
    } else {
      data = await User.find({}, { "__v": 0 })
        .skip(pageRowsLength * Number(more))
        .limit(pageRowsLength)
        .sort({ date: -1 })
    }

    return Response.json({ data }, { status: 200 })
  } catch {
    return Response.json({ error: true, message: "Erreur de chargement des donnees" } as ResponseType, { status: 500 })
  }
})

export default GET