import { options } from "@/app/api/auth/[...nextauth]/options";
import { pages } from "@/consts";
import { connectDB } from "@/lib/db";
import { DepenseSupplementaireType } from "@/models/DepenseSupplementaire";
import { DeplacementType } from "@/models/Deplacement";
import { PrixType } from "@/models/Prix";
import { RechangeType } from "@/models/Rechange";
import { TaxeType } from "@/models/Taxe";
import ResponseType from "@/types/ResponseType";
import { getServerSession } from "next-auth";

export const wrapperEndPoints = (endpoint: (req: Request) => Promise<Response>) => async (req: Request) => {
  await connectDB();
  const session = await getServerSession(options);
  const actionPath = req?.url?.split('/')?.pop()?.split("?")?.[0] ?? "";
  const method = req.method;
  const { permissions } = session?.user ?? { permissions: null };

  if (actionPath && method && permissions !== "*" && permissions[actionPath] !== "*" && !permissions[actionPath]?.includes(method)) return Response.json({ error: true, message: "Unauthorize" } as ResponseType, { status: 401 })

  return endpoint(req);
}

export const simplifyRechanges = (rechange: RechangeType) => {
  const rechangeSimplified: any[] = [];
  rechange.products.forEach(product => {
    const productBase = {
      n_bon: rechange.n_bon,
      date: new NormalDate(rechange.date as any).simplify(),
      specification: product.specification,
      reference: product.reference,
      qte: product.qte,
      prix_unitere: product.prix_unitere,
    };

    rechange.consommateurs.forEach(consommateur => rechangeSimplified.push(
      {
        ...productBase,
        matricule: consommateur.matricule,
        destination: consommateur.destination,
      }
    ));
  });
  return rechangeSimplified
}

export const simplifyPermissions = (permissions: any) => {
  return permissions ? (permissions === "*" ? Object.fromEntries(pages.map(page => ([page, 'Tous']))) : Object.fromEntries(Object.entries(permissions).map(permission => [permission[0], permission[1] === "*" ? "Tous" : (permission[1] as string[]).join(', ').replace('GET', 'Lire').replace('POST', 'Ecrire').replace('PATCH', 'Modifier').replace('DELETE', 'Supprimer')]))) : Object.fromEntries(pages.map(page => ([page, ''])))
}

export const simplifyAnalytics = ({
  matricule,
  marque,
  vehiculeDeplacements,
  typecarburants,
  vehiculeDepenseSupplementaires,
}:
  { matricule: string, marque: string, typecarburants: { date: Date; type_carburant: string }[], vehiculeDeplacements: DeplacementType[], vehiculeDepenseSupplementaires: DepenseSupplementaireType[] },
  prix: PrixType[],
  taxe: TaxeType[]
) => {
  const prix_lub = prix.filter(pr => pr.prix_name === "lub");
  const prix_carburant = prix.filter(pr => pr.prix_name !== "lub"); // يجب تحديثها لتتماشى مع تغيير مكان العربة
  const carburant_base = typecarburants[0].type_carburant;

  const getTaxeCarb = (date: any) => {
    return taxe.find(t => t.taxe_name === carburant_base && t.date <= date!)?.taxe_valeur ?? 0;
  }

  let qte_lub = 0,
    vidange = 0,

    curr_val_lub = 0,
    val_lub_ttc = 0,
    val_lub = 0,

    curr_val_carburant = 0,
    val_carburant_ttc = 0,
    val_carburant = 0,

    kilometrage = 0,
    qte_carburant = 0,
    qte_carburant_ext = 0,

    curr_val_carburant_ext = 0,
    val_carburant_ext_ttc = 0,
    val_carburant_ext = 0;

  // (PRIX_VALEUR/(1+(ttc/100))).toFixed(2)

  vehiculeDeplacements.forEach(vehiculeDeplacement => {
    kilometrage += vehiculeDeplacement.kilometrage ?? 0;
    qte_lub += vehiculeDeplacement.qte_lub ?? 0;
    vidange += vehiculeDeplacement.vidange ?? 0;
    qte_carburant += vehiculeDeplacement.qte_carburant ?? 0;
    qte_carburant_ext += vehiculeDeplacement.qte_carburant_ext ?? 0;

    curr_val_lub = (prix_lub.find(p => p.date <= (vehiculeDeplacement.date ?? 0))?.prix_valeur ?? 0) * ((vehiculeDeplacement.qte_lub ?? 0) + (vehiculeDeplacement.vidange ?? 0));
    val_lub_ttc += curr_val_lub;
    val_lub += curr_val_lub / (1 + (taxe.find(t => t.taxe_name === 'lub' && t.date <= vehiculeDeplacement.date!)?.taxe_valeur ?? 0) / 100);
    // console.log({ taxe: taxe.find(t => t.taxe_name === 'lub' && t.date <= vehiculeDeplacement.date!)?.taxe_valeur ?? 0 })
    curr_val_carburant = (
      prix_carburant.filter(
        p => typecarburants.find(
          typecarburant => typecarburant.date <= vehiculeDeplacement.date!
        )?.type_carburant === p.prix_name
      ).find(p => p.date <= (vehiculeDeplacement.date ?? 0))?.prix_valeur ?? 0
    ) * (vehiculeDeplacement.qte_carburant ?? 0);
    val_carburant_ttc += curr_val_carburant;
    val_carburant += curr_val_carburant / (1 + (getTaxeCarb(vehiculeDeplacement.date) / 100));

    curr_val_carburant_ext = (vehiculeDeplacement.qte_carburant_ext ?? 0) * (vehiculeDeplacement.prix_carburant_ext ?? 0);
    val_carburant_ext_ttc += curr_val_carburant_ext;
    val_carburant_ext += curr_val_carburant_ext / (1 + (getTaxeCarb(vehiculeDeplacement.date) / 100));
  })

  return Object.fromEntries(Object.entries({
    matricule,
    marque,
    kilometrage,
    "con%": (qte_carburant * 100 / (kilometrage || 1)).toFixed(1),
    qte_lub: qte_lub.toFixed(2),
    vidange: vidange.toFixed(2),
    val_lub_ttc: val_lub_ttc.toFixed(2),
    val_lub: val_lub.toFixed(2),
    qte_carburant: qte_carburant.toFixed(2),
    val_carburant_ttc: val_carburant_ttc.toFixed(2),
    val_carburant: val_carburant.toFixed(2),
    qte_carburant_ext: qte_carburant_ext.toFixed(2),
    val_carburant_ext_ttc: val_carburant_ext_ttc.toFixed(2),
    val_carburant_ext: val_carburant_ext.toFixed(2),
    ...Object.fromEntries([
      ["visite_technique", "0.00"],
      ["carnet_metrologe", "0.00"],
      ["taxe_tenage", "0.00"],
      ["assurance", "0.00"],
      ["vignte", "0.00"],
      ["onssa", "0.00"],
      ...vehiculeDepenseSupplementaires.map(item => [item._id, (item.valeur).toFixed(2)])
    ]),
    total: (val_lub + val_lub_ttc + val_carburant + val_carburant_ttc + val_carburant_ext + val_carburant_ext_ttc + vehiculeDepenseSupplementaires.map(item => item.valeur).reduce((prev, curr) => prev + curr, 0)).toFixed(2)
  }).map(item => [item[0], item[1] ?? 0]))
}

export const simplifyVidange = (kilometrages: { _id: string, depls: { kilometrage: number, vidange: number, filter_changer: boolean }[] }[]) => {
  const result: { kilometrage: number, matricule: string, vidange_changer: "oui" | "no", filter_changer: "oui" | "no" }[] = [];

  for (const kilometrage of kilometrages) {
    result.push({ matricule: kilometrage._id, kilometrage: 0, vidange_changer: "no", filter_changer: "no" });
    for (const depl of kilometrage.depls) {
      result[result.length - 1].kilometrage += depl.kilometrage;
      if (result[result.length - 1].kilometrage >= 15000) {
        result[result.length - 1].vidange_changer = "oui";
        result[result.length - 1].filter_changer = depl.filter_changer ? "no" : "oui";
      }
      if (depl.vidange) break;
    }
  }

  return result;
}

export const simplifyGraph = (deplacementsGraph: {
  _id: {
    date: number
  },
  kilometrage: number,
  lub: number,
  carburant: number,
  carb_ext: number
}[], { month, year }: { month: string; year: string }, years: string[]) => {
  const dates = Object.fromEntries(deplacementsGraph.map(deplacementGraph => ([deplacementGraph._id.date, { ...deplacementGraph, _id: deplacementGraph._id.date }])));

  return Array.from(!month && !year ? years : {
    length: month ? new Date(+year || new Date().getFullYear(), +month, 0).getDate() : 12
  }, (v, k) => !month && !year ? v : k + 1).map((num) => ({ ...{ _id: num, kilometrage: 0, lub: 0, carburant: 0, carb_ext: 0 }, ...dates[num] }))
}

export class NormalDate {
  date: string;
  constructor(date: string) {
    this.date = date;
  }

  parse() {
    if (!this.date) return undefined;
    if (!this.date.match(/\d{1,2}\/\d{1,2}\/\d{4}$/)) throw new Error("Entrez une valide valeur pour date. " + this.date);
    const [day, month, year] = (this.date + "").split('/');
    return new Date(`${month}/${day}/${year} 12:00`);
  }

  simplify() {
    if (!this.date) return "";
    return new Intl.DateTimeFormat(['ban', 'id'], { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(this.date));
  }
}