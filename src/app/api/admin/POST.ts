import User, { UserType } from "@/models/User";
import ResponseType from "@/types/ResponseType";
import { wrapperEndPoints } from "@/utils/backend-functions";
import bcrypt from "bcryptjs"

const POST = wrapperEndPoints(async (req: Request) => {
  try {
    const admin = await User.findOne({ permissions: '*' });
    if (admin) return Response.json({ error: true, message: "Vous n'avez pas le droit de creer un autre compte" } as ResponseType, { status: 401 });

    const { email, nom, password, phone }: UserType = await req.json();

    await User.create({
      email, nom, password: await bcrypt.hash(password, 16), phone, permissions: "*"
    });

    return Response.json({ error: false, message: "Cree avec succes" } as ResponseType, { status: 201 });
  } catch ({ message }: any) {
    return Response.json({ error: true, message: "Erreur lors de la creation de ce document " + message } as ResponseType, { status: 500 })
  }
})

export default POST;
