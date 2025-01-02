import MainContent from "@/containers/MainContent"
import Deplacement from "@/models/Deplacement";
import GET from "../api/deplacements/GET";
import GETPrix from "../api/prix/GET";
import GETVehicule from "../api/vehicules/GET";
import GETVehiculeTypeCarburant from '../api/vehiculeTypeCarburant/GET'
import { NormalDate } from "@/utils/backend-functions";
import { VehiculeTypeCarburantType } from "@/models/VehiculeTypeCarburant";
import { Metadata } from "next";
import Unauthorize from "@/components/Unauthorize";

export const metadata: Metadata = {
  title: 'Deplacements'
}

const page = async () => {
  const deplacementColumns: string[] = Object.keys(Deplacement.schema.paths).filter(path => !path.startsWith("_"));
  const res = await GET({ url: '/deplacements', method: 'GET' } as Request);
  const { data: deplacements, message } = await res.json();

  if (message) {
    return <Unauthorize message={message} />
  }

  const resVehicule = await GETVehicule({} as any);
  const { data: vehicules } = await resVehicule.json();

  const resVehiculeTypeCarburant = await GETVehiculeTypeCarburant({} as any);
  const { data: vehiculeTypeCarburant }: { data: VehiculeTypeCarburantType[] } = await resVehiculeTypeCarburant.json();

  const resPrix = await GETPrix({ url: '?currentPrix=1' } as any);
  const { data: prix } = await resPrix.json();

  const prixCurburant = prix.filter((item: any) => item.prix.est_carburant)

  const schema = {
    lub: prix?.find((item: any) => item._id === "lub").prix.valeur,
    vehiculeCurburants: vehicules.map(({ matricule }: any) => (matricule)).map((matr: string) => ({ matricule: matr, carburantValeur: prixCurburant?.find((item: any) => item._id === vehiculeTypeCarburant.find(({ matricule }) => matr === matricule)?.type_carburant)?.prix?.valeur }))
  }

  return (
    <MainContent data={deplacements.map((deplacement: any) => ({ ...deplacement, date: new NormalDate(deplacement.date).simplify() }))} dataColumns={deplacementColumns} title="deplacements" externalData={schema as any} />
  )
}

export default page