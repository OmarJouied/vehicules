import GET from "../api/graphiques/GET";
import { Metadata } from "next";
import GraphiquesContent from "@/components/GraphiquesContent";
import Unauthorize from "@/components/Unauthorize";

export const metadata: Metadata = {
  title: 'Graphiques'
}

const page = async ({ searchParams: { matricules, year, month } }: { searchParams: { year: string; month: string; matricules: string } }) => {
  const res = await GET({ url: `/graphiques?matricules=${matricules ?? ""}&year=${year ?? ""}&month=${month ?? ""}`, method: 'GET' } as Request);
  const { deplacementsGraph, years, matriculesDepls, message } = await res.json();

  if (message) {
    return <Unauthorize message={message} />
  }

  return (
    <GraphiquesContent data={deplacementsGraph} years={years} matriculesDepls={matriculesDepls} />
  )
}

export default page