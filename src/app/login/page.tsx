import { LoginForm } from "@/components/LoginForm"
import { Metadata } from "next"
import GET from "../api/admin/GET"
import Unauthorize from "@/components/Unauthorize"

export const metadata: Metadata = {
  title: 'Login - page'
}

const page = async () => {
  console.log(process.env.MONGODB_URI as string)
  const res = await GET({} as Request);
  const { admin, message } = await res.json();

  if (message) {
    return <Unauthorize message={message} />
  }

  return (
    <main className="container">
      <LoginForm asAdmin={!admin} />
    </main>
  )
}

export default page