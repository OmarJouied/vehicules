import MainContent from "@/containers/MainContent";
import GET from "../api/vidange/GET";
import { Metadata } from "next";
import Unauthorize from "@/components/Unauthorize";

export const metadata: Metadata = {
  title: 'Vidange'
}

export default async function Home() {
  const vehiculeColumns: string[] = [
    "matricule",
    "kilometrage",
    "vidange_changer",
    "filter_changer",
  ];
  const res = await GET({ url: "/vidange", method: 'GET' } as Request);
  const { data: vidangeState, message } = await res.json();

  if (message) {
    return <Unauthorize message={message} />
  }

  return (
    <MainContent
      dataColumns={vehiculeColumns}
      data={vidangeState}
      title="vidange"
    />
  )
}
