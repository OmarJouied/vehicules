import MainContent from "@/containers/MainContent"
import { Metadata } from "next";
import Unauthorize from "@/components/Unauthorize";
import GET from "../api/rechanges/GET";
import { NormalDate } from "@/utils/backend-functions";
import Vehicule from "@/models/Vehicule";

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

  const matricules = (await Vehicule.find({}, { matricule: 1, _id: 0 })).map(item => item.matricule);

  return (
    <MainContent
      data={rechanges.map((rechange: any) => ({ ...rechange, date: new NormalDate(rechange.date).simplify() }))}
      dataColumns={rechangeColumns}
      title="rechanges"
      externalData={matricules}
    />
  )
}

export default page