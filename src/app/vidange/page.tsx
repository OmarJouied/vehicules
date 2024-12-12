import MainContent from "@/containers/MainContent";
import GET from "../api/vidange/GET";
import { Metadata } from "next";

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
  const res = await GET({} as Request);
  const { vidangeState } = await res.json();

  return (
    <MainContent
      dataColumns={vehiculeColumns}
      data={vidangeState}
      title="vidange"
    />
  )
}
