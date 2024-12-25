import MainContent from "@/containers/MainContent"
import Rechange from "@/models/Rechange";
import { Metadata } from "next";
import Unauthorize from "@/components/Unauthorize";
import GET from "../api/rechanges/GET";

export const metadata: Metadata = {
  title: 'Rechanges'
}

const page = async () => {
  const rechangeColumns: string[] = ["n_bon", "matricule", "distination", "specification", "reference", "qte", "prix_unitere", "date",];
  const res = await GET({ url: '/rechanges', method: 'GET' } as Request);
  const { rechanges, message } = await res.json();

  if (message) {
    return <Unauthorize message={message} />
  }

  return (
    <MainContent
      data={rechanges}
      dataColumns={rechangeColumns}
      title="rechanges"
    />
  )
}

export default page