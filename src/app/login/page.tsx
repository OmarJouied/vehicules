import { LoginForm } from "@/components/LoginForm"
import { Metadata } from "next"
import GET from "../api/admin/GET"

export const metadata: Metadata = {
  title: 'Login - page'
}

const page = async () => {
  const res = await GET({} as Request);
  const { admin } = await res.json();

  return (
    <main className="container">
      <LoginForm asAdmin={!admin} />
    </main>
  )
}

export default page