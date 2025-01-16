import DepenseSupplementaire from "@/models/DepenseSupplementaire";
import MainContent from "@/containers/MainContent";
import GET from "../api/depensesSupplementaires/GET";
import { NormalDate } from "@/utils/backend-functions";
import { Metadata } from "next";
import Unauthorize from "@/components/Unauthorize";
import Vehicule from "@/models/Vehicule";

export const metadata: Metadata = {
  title: 'Depenses Supplementaires'
}

export default async function Home() {
  const vehiculeColumns: string[] = Object.keys(DepenseSupplementaire.schema.paths).filter(path => !path.startsWith("_"));
  const res = await GET({ url: '/depensesSupplementaires', method: 'GET' } as Request);
  const { data: depensesSupplementaires, message } = await res.json();

  if (message) {
    return <Unauthorize message={message} />
  }

  const matricules = (await Vehicule.find({}, { matricule: 1, _id: 0 })).map(item => item.matricule);

  return (
    <MainContent
      dataColumns={vehiculeColumns}
      data={depensesSupplementaires.map((deplacement: any) => ({ ...deplacement, date: new NormalDate(deplacement.date).simplify() }))}
      title="depensesSupplementaires"
      externalData={{ matricules, type_depenses: ["vignte", "taxe_tenage", "assurance", "visite_technique", "carnet_metrologe", "onssa",] }} />
  )
}
