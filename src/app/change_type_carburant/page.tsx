import MainContent from "@/containers/MainContent"
import { NormalDate } from "@/utils/backend-functions";
import GET from "../api/vehiculeTypeCarburant/GET";
import GETVehicules from "../api/vehicules/GET";
import GETPrix from "../api/prix/GET";
import VehiculeTypeCarburant from "@/models/VehiculeTypeCarburant";
import { Metadata } from "next";
import Unauthorize from "@/components/Unauthorize";

export const metadata: Metadata = {
  title: 'Vehicule Type Carburant'
}

const page = async () => {
  const vehiculeTypeCarburantColumns: string[] = Object.keys(VehiculeTypeCarburant.schema.paths).filter(path => !path.startsWith("_"));;
  const res = await GET({ url: '/vehiculeTypeCarburant', method: 'GET' } as Request);
  const { data: vehiculeTypeCarburant, message } = await res.json();

  if (message) {
    return <Unauthorize message={message} />
  }

  const resMatricules = await GETVehicules({} as Request);
  const { data: vehicules } = await resMatricules.json();

  const resPrix = await GETPrix({} as Request);
  const { data: prix } = await resPrix.json();

  return (
    <MainContent
      data={vehiculeTypeCarburant.map((item: { date: any; }) => ({ ...item, date: new NormalDate(item.date as any).simplify() }))}
      dataColumns={vehiculeTypeCarburantColumns}
      title="vehiculeTypeCarburant"
      externalData={{ matricules: vehicules.map(({ matricule }: any) => matricule), type_carburants: Array.from(new Set(prix.filter((p: any) => p.est_carburant).map((p: any) => p.prix_name))) }} />
  )
}

export default page