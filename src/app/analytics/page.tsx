import MainContent from "@/containers/MainContent";
import GET from "../api/analytics/GET";
import { Metadata } from "next";
import Unauthorize from "@/components/Unauthorize";

export const metadata: Metadata = {
  title: 'Analytics'
}

export default async function Home({ searchParams: { du, au } }: { searchParams: { du: string; au: string } }) {
  console.log({ url: `/analytics?${du !== undefined && "du=" + du}&${au !== undefined && "au=" + au}` })
  const res = await GET({ url: `/analytics?${du !== undefined && "du=" + du}&${au !== undefined && "au=" + au}`, method: 'GET' } as Request);
  const { data: analytics, message } = await res.json();

  if (message) {
    return <Unauthorize message={message} />
  }

  const analyticsColumns: string[] = [
    "matricule",
    "marque",
    "kilometrage",
    "qte_lub",
    "vidange",
    "val_lub_ttc",
    "val_lub",
    "qte_carburant",
    "val_carburant_ttc",
    "val_carburant",
    "qte_carburant_ext",
    "val_carburant_ext_ttc",
    "val_carburant_ext",
    "val_rechange_ttc",
    "val_rechange",
    "val_rechange_ext_ttc",
    "val_rechange_ext",
    "con%",
    "visite_technique",
    "carnet_metrologe",
    "taxe_tenage",
    "assurance",
    "vignte",
    "onssa",
    "total",
  ];

  return (
    <MainContent dataColumns={analyticsColumns} data={analytics} title="analytics" />
  )
}
