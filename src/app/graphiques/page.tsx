import GET from "../api/graphiques/GET";
import { Metadata } from "next";
import GraphiquesContent from "@/components/GraphiquesContent";

export const metadata: Metadata = {
  title: 'Graphiques'
}

const page = async ({ searchParams: { matricules, year, month } }: { searchParams: { year: string; month: string; matricules: string } }) => {
  const req = new Request(`https://exemple.com/?matricules=${matricules ?? ""}&year=${year ?? ""}&month=${month ?? ""}`)
  const res = await GET(req);
  const { deplacementsGraph, years, matriculesDepls } = await res.json();

  return (
    <GraphiquesContent data={deplacementsGraph} years={years} matriculesDepls={matriculesDepls} />
  )
}

export default page