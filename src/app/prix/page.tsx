import MainContent from "@/containers/MainContent"
import GET from "../api/prix/GET";
import { NormalDate } from "@/utils/backend-functions";
import { Metadata } from "next";
import Unauthorize from "@/components/Unauthorize";

export const metadata: Metadata = {
  title: 'Prix'
}

const page = async () => {
  const prixColumns: string[] = ["prix_name", "prix_valeur", "date",];
  const res = await GET({ url: '/prix', method: 'GET' } as Request);
  const { prix, message } = await res.json();

  if (message) {
    return <Unauthorize message={message} />
  }

  return (
    <MainContent
      data={prix.map((item: { date: any; }) => ({ ...item, date: new NormalDate(item.date as any).simplify() }))}
      dataColumns={prixColumns} title="prix" />
  )
}

export default page