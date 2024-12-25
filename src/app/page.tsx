import Vehicule, { VehiculeType } from "@/models/Vehicule";
import GET from "./api/vehicules/GET";
import GETPrix from "./api/prix/GET";
import MainContent from "@/containers/MainContent";
import { NextRequest } from "next/server";
import Unauthorize from "@/components/Unauthorize";

export default async function Home() {
  const vehiculeColumns: string[] = [...Object.keys(Vehicule.schema.paths).filter(path => !path.startsWith("_")), "type_carburant", "vignte", "taxe_tenage", "assurance", "visite_technique", "carnet_metrologe", "onssa",];
  const res = await GET({ url: '/', method: 'GET' } as Request);
  const { vehicules, message } = await res.json();
  const resPrix = await GETPrix({ url: '/prix?currentPrix=1', method: 'GET' } as NextRequest);
  const { prix } = await resPrix.json();

  if (message) {
    return <Unauthorize message={message} />
  }

  return (
    <MainContent
      dataColumns={vehiculeColumns}
      data={
        vehicules.map((vehicule: VehiculeType) => ({
          ...vehicule,
          type_carburant: ((vehicule as any).type_carburant?.[0] as any)?.type_carburant,
          ...Object.fromEntries((vehicule as any).depensesupplementaires.map((item: { _id: any; valeur: any; }) => [item._id, item.valeur]))
        }))}
      title="vehicules" externalData={prix}
    />
  )
}
