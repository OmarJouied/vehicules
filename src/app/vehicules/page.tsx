import Vehicule from "@/models/Vehicule";
import GET from "../api/vehicules/GET";
import GETPrix from "../api/prix/GET";
import MainContent from "@/containers/MainContent";
import { NextRequest } from "next/server";
import Unauthorize from "@/components/Unauthorize";

export default async function Home() {
  const vehiculeColumns: string[] = [...Object.keys(Vehicule.schema.paths).filter(path => !path.startsWith("_")), "type_carburant", "vignte", "taxe_tenage", "assurance", "visite_technique", "carnet_metrologe", "onssa",];
  const res = await GET({ url: '/vehicules', method: 'GET' } as Request);
  const { data, message } = await res.json();
  const resPrix = await GETPrix({ url: '/?currentPrix=1', method: 'GET' } as NextRequest);
  const { data: prix } = await resPrix.json();

  if (message) {
    return <Unauthorize message={message} />
  }

  return (
    <MainContent
      dataColumns={vehiculeColumns}
      data={data}
      title="vehicules" externalData={prix}
    />
  )
}
