import { pages } from "@/consts";
import User, { UserType } from "@/models/User";
import ResponseType from "@/types/ResponseType";
import { NormalDate, wrapperEndPoints } from "@/utils/backend-functions";
import bcrypt from "bcryptjs";

const PATCH = wrapperEndPoints(async (req: Request) => {
  try {
    const data: UserType[] = await req.json();
    await Promise.all(data.map((row: any) => updateUser(row)));

    return Response.json({ error: false, message: "Mis a jour avec succes" } as ResponseType, { status: 202 });
  } catch ({ message }: any) {
    return Response.json({ error: true, message } as ResponseType, { status: 500 });
  }
})

const updateUser = async ({
  nom, email, password, phone, date, _id, ...permissions
}: UserType & { _id: string }) => {
  const user = await User.findById(_id);
  if (!user) throw new Error("Ce document n'existe pas, pour modifier le nom avec: " + nom);

  const permissionsArray = Object.entries({ ...permissions, profile: `Lire, Modifier` });

  const isAll = (per: string) => per.includes('Tous') || per.includes('Lire') && per.includes('Ecrire') && per.includes('Modifier') && per.includes('Supprimer');

  Object.entries({
    nom, email, ...(password !== user.password && password !== "xxxxxxxxxx" ? { password: await bcrypt.hash(password, 16) } : {}), phone, date: new NormalDate(date as any).parse(), permissions: pages.every(page => permissionsArray.find(p => p[0] === page)) ?
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
  }).forEach(item => {
    user[item[0]] = item[1];
  });

  try {
    await user.save();
  } catch (err: any) {
    throw new Error("Erreur lors de la mise a jour du document: " + err.message);
  }
}

export default PATCH;
