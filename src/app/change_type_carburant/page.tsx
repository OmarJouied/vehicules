import MainContent from "@/containers/MainContent"
import { NormalDate } from "@/utils/backend-functions";
import GET from "../api/vehiculeTypeCarburant/GET";
import GETPrix from "../api/prix/GET";
import VehiculeTypeCarburant from "@/models/VehiculeTypeCarburant";
import { Metadata } from "next";
import Unauthorize from "@/components/Unauthorize";
import Vehicule from "@/models/Vehicule";

export const metadata: Metadata = {
  title: 'Vehicule Type Carburant'
}

const page = async () => {
  const vehiculeTypeCarburantColumns: string[] = Object.keys(VehiculeTypeCarburant.schema.paths).filter(path => !path.startsWith("_"));;
  const res = await GET({ url: '/change_type_carburant', method: 'GET' } as Request);
  const { data: vehiculeTypeCarburant, message } = await res.json();

  if (message) {
    return <Unauthorize message={message} />
  }

  const matricules = (await Vehicule.find({}, { matricule: 1, _id: 0 })).map(item => item.matricule);

  const resPrix = await GETPrix({} as Request);
  const { data: prix } = await resPrix.json();

  return (
    <MainContent
      data={vehiculeTypeCarburant.map((item: { date: any; }) => ({ ...item, date: new NormalDate(item.date as any).simplify() }))}
      dataColumns={vehiculeTypeCarburantColumns}
      title="vehiculeTypeCarburant"
      externalData={{ matricules, type_carburants: Array.from(new Set(prix.filter((p: any) => p.est_carburant).map((p: any) => p.prix_name))) }} />
  )
}

export default page