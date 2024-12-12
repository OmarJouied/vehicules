import MainContent from "@/containers/MainContent";
import GET from "../api/analytics/GET";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Analytics'
}

export default async function Home({ searchParams: { du, au } }: { searchParams: { du: string; au: string } }) {
  const req = new Request(`https://exemple.com/?du=${du ?? ""}&au=${au ?? ""}`)
  const res = await GET(req);
  const { analytics } = await res.json();
  const analyticsColumns: string[] = [
    "matricule",
    "marque",
    "kilometrage",
    "qte_lub",
    "vidange",
    "val_lub",
    "qte_carburant",
    "val_carburant",
    "qte_carburant_ext",
    "val_carburant_ext",
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
