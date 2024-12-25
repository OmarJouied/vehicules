import GET from "../api/profile/GET";
import { Metadata } from "next";
import ProfileCard from "@/components/ProfileCard";

export const metadata: Metadata = {
  title: 'Profile'
}

const page = async () => {
  const userColumns: string[] = ["nom", "email", "password", "phone",];
  const res = await GET({} as Request);
  const { user } = await res.json();

  return (
    <ProfileCard user={user} userColumns={userColumns} />
  )
}

export default page