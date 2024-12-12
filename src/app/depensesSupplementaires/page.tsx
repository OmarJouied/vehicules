import DepenseSupplementaire from "@/models/DepenseSupplementaire";
import MainContent from "@/containers/MainContent";
import GET from "../api/depensesSupplementaires/GET";
import GETMatricules from "../api/vehicules/GET";
import { VehiculeType } from "@/models/Vehicule";
import { NormalDate } from "@/utils/backend-functions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Depenses Supplementaires'
}

export default async function Home() {
  const vehiculeColumns: string[] = Object.keys(DepenseSupplementaire.schema.paths).filter(path => !path.startsWith("_"));
  const res = await GET({} as Request);
  const { depensesSupplementaires } = await res.json();

  const resMatricules = await GETMatricules({} as Request);
  const { vehicules }: { vehicules: VehiculeType[] } = await resMatricules.json();

  return (
    <MainContent
      dataColumns={vehiculeColumns}
      data={depensesSupplementaires.map((deplacement: any) => ({ ...deplacement, date: new NormalDate(deplacement.date).simplify() }))}
      title="depensesSupplementaires"
      externalData={{ matricules: vehicules.map(vehicule => vehicule.matricule), type_depenses: ["vignte", "taxe_tenage", "assurance", "visite_technique", "carnet_metrologe", "onssa",] }} />
  )
}
