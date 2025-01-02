import MainContent from "@/containers/MainContent"
import { Metadata } from "next";
import Unauthorize from "@/components/Unauthorize";
import GET from "../api/rechanges/GET";
import GETVehicules from "../api/vehicules/GET";
import { NormalDate } from "@/utils/backend-functions";

export const metadata: Metadata = {
  title: 'Rechanges'
}

const page = async () => {
  const rechangeColumns: string[] = ["n_bon", "matricule", "destination", "specification", "reference", "qte", "prix_unitere", "extern", "date",];
  const res = await GET({ url: '/rechanges', method: 'GET' } as Request);
  const { data: rechanges, message } = await res.json();

  if (message) {
    return <Unauthorize message={message} />
  }

  const resVehicules = await GETVehicules({} as Request);
  const { data: vehicules } = await resVehicules.json();

  return (
    <MainContent
      data={rechanges.map((deplacement: any) => ({ ...deplacement, date: new NormalDate(deplacement.date).simplify() }))}
      dataColumns={rechangeColumns}
      title="rechanges"
      externalData={vehicules.map((vehicule: any) => vehicule.matricule)}
    />
  )
}

export default page