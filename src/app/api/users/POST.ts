import { pages } from "@/consts";
import User, { UserType } from "@/models/User";
import ResponseType from "@/types/ResponseType";
import { NormalDate, wrapperEndPoints } from "@/utils/backend-functions";
import bcrypt from "bcryptjs"

const POST = wrapperEndPoints(async (req: Request) => {
  try {
    const data = await req.json();

    const refData = typeof data.length === "undefined" ? [await createUser(data)] : await Promise.all(data.map((row: any) => createUser(row)));

    return Response.json({ error: false, message: "Cree avec succes", refData } as ResponseType, { status: 201 });
  } catch ({ message }: any) {
    return Response.json({ error: true, message } as ResponseType, { status: 500 })
  }
})

const createUser = async ({
  nom, email, password, phone, date, ...permissions
}: UserType) => {
  try {
    const permissionsArray = Object.entries({ ...permissions, profile: `Lire, Modifier` });

    const isAll = (per: string) => per.includes('Tous') || per.includes('Lire') && per.includes('Ecrire') && per.includes('Modifier') && per.includes('Supprimer');
    const newUser = await User.create({
      nom, email, password: await bcrypt.hash(password, 16), phone, date: new NormalDate(date as any).parse(), permissions: pages.every(page => permissionsArray.find(p => p[0] === page)) ?
        (
          permissionsArray.every(permission => isAll(permission[1])) ? (
            "*"
          ) : (
            Object.fromEntries(permissionsArray.map(pagePermission => isAll(pagePermission[1]) ? [pagePermission[0], "*"] : [pagePermission[0], pagePermission[1].replace('Lire', 'GET').replace('Ecrire', 'POST').replace('Modifier', 'PATCH').replace('Supprimer', 'DELETE').split(', ').filter((p: any) => p)]))
          )
        )
        : (
          Object.fromEntries(permissionsArray.map(pagePermission => isAll(pagePermission[1]) ? [pagePermission[0], "*"] : [pagePermission[0], pagePermission[1].replace('Lire', 'GET').replace('Ecrire', 'POST').replace('Modifier', 'PATCH').replace('Supprimer', 'DELETE').split(', ').filter((p: any) => p)]))
        )
    });

    return { nom, _id: newUser._id }
  } catch {
    throw new Error("Erreur lors de la creation de ce document")
  }
}

export default POST;
