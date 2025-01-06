import User from "@/models/User";
import ResponseType from "@/types/ResponseType";
import { wrapperEndPoints } from "@/utils/backend-functions";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";

const PATCH = wrapperEndPoints(async (req: Request) => {
  try {
    const {
      nom, email, password, phone,
    } = await req.json();
    const session = await getServerSession(options);
    const user = await User.findById(session?.user.id);
    if (!user) throw new Error("Ce document n'existe pas, pour modifier le nom avec: " + nom);

    Object.entries({
      nom,
      email,
      ...(password !== user.password ? { password: await bcrypt.hash(password, 16) } : {}),
      phone
    }).forEach(item => {
      user[item[0]] = item[1];
    });

    try {
      await user.save();
    } catch (err: any) {
      throw new Error("Erreur lors de la mise a jour du document: " + err.message);
    }

    return Response.json({ error: false, message: "Mis a jour avec succes" } as ResponseType, { status: 202 });
  } catch ({ message }: any) {
    return Response.json({ error: true, message } as ResponseType, { status: 500 });
  }
})

export default PATCH;
