import MainContent from "@/containers/MainContent"
import Deplacement from "@/models/Deplacement";
import GET from "../api/deplacements/GET";
import GETPrix from "../api/prix/GET";
import { NormalDate } from "@/utils/backend-functions";
import VehiculeTypeCarburant from "@/models/VehiculeTypeCarburant";
import { Metadata } from "next";
import Unauthorize from "@/components/Unauthorize";
import Vehicule from "@/models/Vehicule";

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

  const matricules = (await Vehicule.find({}, { matricule: 1, _id: 0 })).map(item => item.matricule);

  const vehiculeTypeCarburant = await VehiculeTypeCarburant.find({}, { matricule: 1, type_carburant: 1, _id: 0 });

  const resPrix = await GETPrix({ url: '?currentPrix=1' } as any);
  const { data: prix } = await resPrix.json();

  const prixCurburant = prix.filter((item: any) => item.prix.est_carburant)

  const schema = {
    lub: prix?.find((item: any) => item._id === "lub")?.prix?.valeur ?? 0,
    vehiculeCurburants: matricules.map((matr: string) => ({ matricule: matr, carburantValeur: prixCurburant?.find((item: any) => item._id === vehiculeTypeCarburant.find(({ matricule }) => matr === matricule)?.type_carburant)?.prix?.valeur ?? 0 }))
  }

  return (
    <MainContent data={deplacements.map((deplacement: any) => ({ ...deplacement, date: new NormalDate(deplacement.date).simplify() }))} dataColumns={deplacementColumns} title="deplacements" externalData={schema as any} />
  )
}

export default page