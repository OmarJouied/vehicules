import { LoginForm } from "@/components/LoginForm"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Login - page'
}

const page = () => {
  return (
    <main className="container">
      <LoginForm />
    </main>
  )
}

export default page