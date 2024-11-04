import MainContent from "@/containers/MainContent"
import Prix from "@/models/Prix";
import GET from "../api/prix/GET";

const page = async () => {
  const prixColumns: string[] = Object.keys(Prix.schema.paths).filter(path => !path.startsWith("_"));
  const res = await GET({} as Request);
  const { prixes } = await res.json();

  return (
    <MainContent data={prixes} dataColumns={prixColumns} title="Prix" />
  )
}

export default page