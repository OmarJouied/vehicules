import MainContent from "@/containers/MainContent"
import Deplacement from "@/models/Deplacement";
import GET from "../api/deplacements/GET";
import GETPrix from "../api/prix/GET";
import GETVehicule from "../api/vehicules/GET";
import GETVehiculeTypeCarburant from '../api/vehiculeTypeCarburant/GET'
import { NormalDate } from "@/utils/backend-functions";
import { VehiculeType } from "@/models/Vehicule";
import { VehiculeTypeCarburantType } from "@/models/VehiculeTypeCarburant";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Deplacements'
}

const page = async () => {
  const deplacementColumns: string[] = Object.keys(Deplacement.schema.paths).filter(path => !path.startsWith("_"));
  const res = await GET({} as Request);
  const { deplacements } = await res.json();

  const resVehicule = await GETVehicule({} as any);
  const { vehicules }: { vehicules: VehiculeType[] } = await resVehicule.json();

  const resVehiculeTypeCarburant = await GETVehiculeTypeCarburant({} as any);
  const { vehiculeTypeCarburant }: { vehiculeTypeCarburant: VehiculeTypeCarburantType[] } = await resVehiculeTypeCarburant.json();

  const resPrix = await GETPrix({ nextUrl: new URL('https://vehicules.com/?currentPrix=1') } as any);
  const { prix } = await resPrix.json();

  const prixCurburant = prix.filter((item: any) => item.prix.est_carburant)

  const schema = {
    lub: prix?.find((item: any) => item._id === "lub").prix.valeur,
    vehiculeCurburants: vehicules.map(({ matricule }: any) => (matricule)).map(matr => ({ matricule: matr, carburantValeur: prixCurburant?.find((item: any) => item._id === vehiculeTypeCarburant.find(({ matricule }) => matr === matricule)?.type_carburant)?.prix?.valeur }))
  }

  return (
    <MainContent data={deplacements.map((deplacement: any) => ({ ...deplacement, date: new NormalDate(deplacement.date).simplify() }))} dataColumns={deplacementColumns} title="deplacements" externalData={schema as any} />
  )
}

export default page