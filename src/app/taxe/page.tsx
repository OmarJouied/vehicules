import MainContent from "@/containers/MainContent"
import GET from "../api/taxe/GET";
import GETPrix from "../api/prix/GET";
import { NormalDate } from "@/utils/backend-functions";
import { Metadata } from "next";
import Unauthorize from "@/components/Unauthorize";
import Taxe from "@/models/Taxe";

export const metadata: Metadata = {
  title: 'Taxe'
}

const page = async () => {
  const taxeColumns: string[] = Object.keys(Taxe.schema.paths).filter(path => !path.startsWith("_"));
  const res = await GET({ url: '/taxe', method: 'GET' } as Request);
  const { data: taxe, message } = await res.json();

  if (message) {
    return <Unauthorize message={message} />
  }
  const resPrix = await GETPrix({ url: '/prix?currentPrix=1', method: 'GET' } as Request);
  const { data: prix } = await resPrix.json();

  return (
    <MainContent
      data={taxe.map((item: { date: any; }) => ({ ...item, date: new NormalDate(item.date as any).simplify() }))}
      dataColumns={taxeColumns} title="taxe"
      externalData={[...prix.map((p: any) => p._id), "rechange"]}
    />
  )
}

export default page