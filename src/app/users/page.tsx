import MainContent from "@/containers/MainContent"
import GET from "../api/users/GET";
import { NormalDate, simplifyPermissions } from "@/utils/backend-functions";
import { Metadata } from "next";
import User, { UserType } from "@/models/User";
import { pages } from "@/consts";
import ResponseType from "@/types/ResponseType";
import Unauthorize from "@/components/Unauthorize";

export const metadata: Metadata = {
  title: 'Users'
}

const page = async () => {
  const userColumns: string[] = [...Object.keys(User.schema.paths).filter(path => !path.startsWith("_") && !path.startsWith("permissions")), ...pages];
  const res = await GET({ url: '/users', method: 'GET' } as Request);
  const { users, message } = await res.json() as { users: UserType[] } & ResponseType;

  if (message) {
    return <Unauthorize message={message} />
  }

  return (
    <MainContent
      data={
        users.map(({
          date, email, nom, password, permissions, phone, _id
        }) => ({
          date: new NormalDate(date as unknown as string).simplify(),
          email, _id, nom, password, ...simplifyPermissions(permissions), phone
        }))
      }
      dataColumns={userColumns} title="users" />
  )
}

export default page