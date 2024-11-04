import Vehicule from "@/models/Vehicule";
import GET from "./api/vehicule/GET";
import MainContent from "@/containers/MainContent";

export default async function Home() {
  const vehiculeColumns: string[] = Object.keys(Vehicule.schema.paths).filter(path => !path.startsWith("_"));
  const res = await GET({} as Request);
  const { vehicules } = await res.json();

  return (
    <MainContent dataColumns={vehiculeColumns} data={vehicules} title="Vehicules" />
  )
}
