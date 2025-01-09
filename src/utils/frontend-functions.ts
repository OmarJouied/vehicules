import { PrixType } from "@/models/Prix"
import { VehiculeType } from "@/models/Vehicule"
import { Table } from "@tanstack/react-table"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { utils, writeFile } from "xlsx"
import InputOTPDate from "../components/InputOTPDate"
import InputDate from "../components/InputDate"
import { SelectChoise } from "@/components/SelectChoise"
import { SearchSelectChoise } from "@/components/SearchSelectChoise"
import { DeplacementType } from "@/models/Deplacement"
import CheckboxPrix from "@/components/CheckboxPrix"
import { VehiculeTypeCarburantType } from "@/models/VehiculeTypeCarburant"
import { DepenseSupplementaireType } from "@/models/DepenseSupplementaire"
import { UserType } from "@/models/User"
import PasswordInput from "@/components/PasswordInput"
import { pages } from "@/consts"
import { RechangeType } from "@/models/Rechange"
import { TaxeType } from "@/models/Taxe"

export const getIds = (table: Table<{ _id: string }>) => {
  return table.getSelectedRowModel().rows.map(row => row.original._id)
}

export const recalcule = (table: Table<any>, fields: string[]) => {
  const fieldsToCalcule = table.getAllColumns().slice(1).filter(col => col.getIsVisible()).map(col => col.id).filter(col => fields.includes(col));
  return Object.fromEntries(table.getRowModel().rows
    .map(row => ([[row.id], fieldsToCalcule.map(field => row.original[field]).reduce((prev, next) => prev + +next, 0).toFixed(2)])))
}

export const jsonToPdf = (title: string, body: string[][], head: string[][], date?: any) => {
  const doc = new jsPDF("landscape", "mm", "a4");

  const img = new Image;
  img.onload = function () {
    doc.addImage(this as any, 'JPEG', 3.32, 2, 15, 12);
    doc.setFontSize(12);
    doc.setFillColor(120, 120, 120);
    doc.text(title, doc.internal.pageSize.getWidth() / 2, 10, {
      align: "center"
    })
    doc.setFontSize(6);
    doc.setFillColor(120, 120, 120);
    doc.text(date, 6, 10, {
      align: "left"
    })

    doc.setDisplayMode("fullwidth")
    autoTable(doc, {
      head,
      body,
      margin: {
        left: 4, right: 4, top: 15
      },
      styles: {
        fontSize: 4.5,
        cellPadding: 1,
        overflow: "linebreak",
        cellWidth: "wrap",
        halign: "justify",
        lineWidth: .1,
        fontStyle: "normal"
      },
      headStyles: {
        cellPadding: 1,
        overflow: "linebreak",
        cellWidth: "wrap",
        halign: "center",
        lineWidth: .1,
        fontStyle: "bold"
      },
    })

    doc.autoPrint();
    doc.output("dataurlnewwindow", { filename: `${title}.pdf` });
  };

  img.crossOrigin = "";
  img.src = "/logo.png";
}

export const toXlsx = (title: string, data: any[]) => {
  const ws = utils.json_to_sheet(data);
  const wb = utils.book_new();

  utils.book_append_sheet(wb, ws, "Data");

  writeFile(wb, `${title}.xlsx`);
}

export const simplify = (data: any) => {
  return Object.fromEntries(Object.entries(data).filter(item => item[1] !== ""))
}

export class SpecificActions {
  target: "prix" | "vehicules";
  vehicules: any
  deplacements: any
  analytics: any
  prix: any
  vehiculeTypeCarburant: any
  depensesSupplementaires: any
  vidange: any
  users: any
  rechanges: any
  taxe: any

  constructor(target: "prix" | "vehicules") {
    this.users = {
      defaultData: {
        nom: "", password: "", email: "", phone: "", date: "", ...Object.fromEntries(pages.map(page => [page, ""]))
      },
      requiredField: ["nom", "password", "email",],
      inputsSpecial(data: any, setData: any) {
        return {
          date: InputOTPDate({
            date: data.date ? data.date + "" : "",
            setDate: (value: any) => setData((prev: any) => ({ ...prev, date: value }))
          }),
          password: PasswordInput({ data, setData, }),
        }
      },
      validate(data: UserType) {
        if (!data.nom) return "Merci de remplir le champ nom.";
        if (!data.password) return "Merci de remplir le champ password.";
        if (data.password.length < 8) return "Entrez une password avec longueur superieure ou egale a 8.";
        if (!data.email) return "Merci de remplir le champ email.";
        if (!data.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) return "Entrez un email valide.";
        if (data.date && !(data.date + "").match(/^\d{2}\/\d{2}\/\d{4}$/)) return "Entrez une date valide pour date.";
      },
      getFields(fields: string[]) {
        return fields;
      },
    };
    this.vehicules = {
      defaultData: {
        matricule: "", affectation: "", assurance: "", carnet_metrologe: "", dateachat: "",
        datemc: "", genre: "", marque: "", numchassis: "", observation: "", poids: "", prix_aquisiti: "",
        taxe_tenage: "", type: "", type_carburant: "", vignte: "", visite_technique: "", onssa: ""
      },
      requiredField: ["matricule"],
      inputsSpecial(data: any, setData: any, choises?: string[]) {
        return {
          datemc: InputOTPDate({
            date: data.datemc ? data.datemc + "" : "",
            setDate: (value: any) => setData((prev: any) => ({ ...prev, datemc: value }))
          }),
          dateachat: InputDate({
            id: "dateachat",
            onChange: ({ target: { value } }) => setData((prev: any) => ({ ...prev, dateachat: value })),
            placeholder: "2022",
            value: data.dateachat ? data.dateachat + "" : "",
            errorCondition: !!(data.dateachat && !`${data.dateachat}`.match(/^\d{4}$/))
          }),
          type_carburant: SelectChoise({
            choises: (choises ?? []).filter((item: any) => item.prix.est_carburant).map((p: any) => p.prix.name),
            label: "type",
            value: data.type_carburant,
            onChange: ({ target: { value } }) => setData((prev: any) => ({ ...prev, type_carburant: value })),
          }),
        }
      },
      validate(data: VehiculeType & { type_carburant: string }) {
        if (!data.matricule) return "Merci de remplir le champ matricule.";
        if (!data.type_carburant) return "Merci de remplir le champ type_carburant.";
        if (data.datemc && !(data.datemc + "").match(/^\d{2}\/\d{2}\/\d{4}$/)) return "Entrez une date valide pour datemc.";
        if (data.dateachat && !`${data.dateachat}`.match(/^\d{4}$/)) return "Entrez une date valide pour dateachat.";
      },
      getFields(fields: string[]) {
        return fields;
      },
    };
    this.deplacements = {
      defaultData: {
        matricule: "", destination: "", conductor: "", date: "",
        qte_lub: "", vidange: "", qte_carburant: "", qte_carburant_ext: "",
        prix_carburant_ext: "", kilometrage_sorte: "", kilometrage_entre: "",
        kilometrage: "", carburant_valeur: "", lub_valeur: "",
        filter_changer: undefined
      },
      requiredField: ["matricule", "carburant_valeur", "lub_valeur",],
      inputsSpecial(data: DeplacementType & { carburant_valeur: string, lub_valeur: string, kilometrage_entre: string, kilometrage_sorte: string }, setData: any, choises?: any) {
        return {
          kilometrage_entre: InputDate({
            id: "lub_valeur",
            onChange: ({ target: { value } }) => setData((prev: any) => ({ ...prev, kilometrage_entre: value, kilometrage: (+value || 0) - (+prev.kilometrage_sorte || 0) })),
            placeholder: "",
            value: data.kilometrage_entre,
            errorCondition: false
          }),
          kilometrage_sorte: InputDate({
            id: "lub_valeur",
            onChange: ({ target: { value } }) => setData((prev: any) => ({ ...prev, kilometrage_sorte: value, kilometrage: (+prev.kilometrage_entre || 0) - (+value || 0) })),
            placeholder: "",
            value: data.kilometrage_sorte,
            errorCondition: false
          }),
          lub_valeur: InputDate({
            id: "lub_valeur",
            onChange: ({ target: { value } }) => setData((prev: any) => ({ ...prev, lub_valeur: value })),
            placeholder: "",
            value: ((+(data.qte_lub ?? 0) + +(data.vidange ?? 0)) || 1) * +(data.lub_valeur ?? 0) + "",
            errorCondition: false
          }),
          carburant_valeur: InputDate({
            id: "carburant_valeur",
            onChange: ({ target: { value } }) => setData((prev: any) => ({ ...prev, carburant_valeur: value })),
            placeholder: "",
            value: (+(data.qte_carburant ?? 0) || 1) * +(data.carburant_valeur ?? 0) + "",
            errorCondition: false
          }),
          matricule: SearchSelectChoise({
            name: "matricule",
            choises: (choises.vehiculeCurburants ?? []).map((p: any) => p.matricule),
            value: data.matricule as string,
            onChange: ({ target: { value } }) => setData((prev: any) => ({ ...prev, matricule: value })),
          }),
          date: InputOTPDate({
            date: data.date ? data.date + "" : "",
            setDate: (value: any) => setData((prev: any) => ({ ...prev, date: value }))
          }),
          filter_changer: CheckboxPrix({ id: "filter_changer", isChecked: (data.vidange ?? 0) <= 0 ? false : !!data.filter_changer, disabled: (data.vidange ?? 0) <= 0, onCheckedChange: () => setData((prev: any) => ({ ...prev, filter_changer: !prev.filter_changer || undefined })) }),
        }
      },
      validate(data: DeplacementType) {
        if (!data.matricule) return "Merci de remplir le champ matricule.";
        if (data.vidange && +data.vidange < 0) return "Entrez une valeur positive pour vidange.";
        if (data.qte_lub && +data.qte_lub < 0) return "Entrez une valeur positive pour qte_lub.";
        if (data.qte_carburant && +data.qte_carburant < 0) return "Entrez une valeur positive pour qte_carburant.";
        if (data.kilometrage && +data.kilometrage < 0) return "Entrez une valeur positive pour kilometrage.";
        if (data.date && !`${data.date}`.match(/^\d{2}\/\d{2}\/\d{4}$/)) return "Entrez une valide valeur pour date.";
      },
      getFields(fields: string[]) {
        return [...fields.slice(0, -1), "kilometrage_sorte", "kilometrage_entre", ...fields.slice(-1), "carburant_valeur", "lub_valeur"];
      },
    };
    this.vidange = {
      defaultData: {},
      requiredField: [],
      inputsSpecial() {
        return {}
      },
      validate() { },
      getFields(fields: string[]) {
        return fields;
      }
    };
    this.prix = {
      defaultData: {
        prix_name: "",
        prix_valeur: "",
        est_carburant: undefined,
        date: '//'
      },
      requiredField: ["prix_name", "prix_valeur"],
      inputsSpecial(data: PrixType, setData: any) {
        return {
          prix_name: InputDate({
            id: "prix_name",
            onChange: ({ target: { value } }) => setData((prev: any) => ({ ...prev, prix_name: value.toLowerCase() })),
            placeholder: "",
            value: data.prix_name,
            errorCondition: false
          }),
          date: InputOTPDate({
            date: data.date ? data.date + "" : "",
            setDate: (value: any) => setData((prev: any) => ({ ...prev, date: value }))
          }),
          est_carburant: CheckboxPrix({ id: "est_carburant", isChecked: !!data.est_carburant, onCheckedChange: () => setData((prev: any) => ({ ...prev, est_carburant: !prev.est_carburant || undefined })) })
        }
      },
      validate(data: PrixType) {
        if (!data.prix_name) return "Merci de remplir le champ prix_name.";
        if (!data.prix_valeur || (+data.prix_valeur || 0) < 0) return "Entrez une valeur positive pour prix_valeur.";
        if (data.date && !`${data.date}`.match(/^\d{2}\/\d{2}\/\d{4}$/)) return "Entrez une valide valeur pour date.";
      },
      getFields(fields: string[]) {
        return [...fields, "est_carburant"];
      }
    };
    this.taxe = {
      defaultData: {
        taxe_name: "",
        taxe_valeur: "",
        date: '//'
      },
      requiredField: ["taxe_name", "taxe_valeur"],
      inputsSpecial(data: TaxeType, setData: any, choises?: any) {
        return {
          taxe_name: SelectChoise({
            choises: choises ?? [],
            label: "option",
            value: data.taxe_name,
            onChange: ({ target: { value } }) => setData((prev: any) => ({ ...prev, taxe_name: value })),
          }),
          date: InputOTPDate({
            date: data.date ? data.date + "" : "",
            setDate: (value: any) => setData((prev: any) => ({ ...prev, date: value }))
          }),
        }
      },
      validate(data: TaxeType) {
        if (!data.taxe_name) return "Merci de remplir le champ taxe_name.";
        if (!data.taxe_valeur || (+data.taxe_valeur || 0) < 0) return "Entrez une valeur positive pour taxe_valeur.";
        if (data.date && !`${data.date}`.match(/^\d{2}\/\d{2}\/\d{4}$/)) return "Entrez une valide valeur pour date.";
      },
      getFields(fields: string[]) {
        return fields;
      }
    };
    this.analytics = {
      defaultData: {},
      requiredField: [],
      inputsSpecial() {
        return {}
      },
      validate() {
      },
      getFields(fields: string[]) {
        return fields;
      },
    };
    this.depensesSupplementaires = {
      defaultData: {
        matricule: "",
        type_depense: "",
        valeur: "",
        date: '//',
      },
      requiredField: ["matricule", "type_depense", "valeur", "date",],
      inputsSpecial(data: { date: string; matricule: string; type_depense: string }, setData: any, choises: any) {
        return {
          date: InputOTPDate({
            date: data.date ? data.date + "" : "",
            setDate: (value: any) => setData((prev: any) => ({ ...prev, date: value }))
          }),
          matricule: SearchSelectChoise({
            name: "matricule",
            choises: choises.matricules ?? [],
            value: data.matricule as string,
            onChange: ({ target: { value } }) => setData((prev: any) => ({ ...prev, matricule: value })),
          }),
          type_depense: SearchSelectChoise({
            name: "type_depense",
            choises: choises.type_depenses ?? [],
            value: data.type_depense as string,
            onChange: ({ target: { value } }) => setData((prev: any) => ({ ...prev, type_depense: value })),
          }),
        }
      },
      validate(data: DepenseSupplementaireType) {
        if (!data.matricule) return "Merci de remplir le champ matricule.";
        if (!data.type_depense) return "Merci de remplir le champ type_depense.";
        if (!data.valeur || (+data.valeur || 0) < 0) return "Entrez une valeur positive pour valeur.";
        if (!`${data.date}`.match(/^\d{2}\/\d{2}\/\d{4}$/)) return "Entrez une valide valeur pour date.";
      },
      getFields(fields: string[]) {
        return fields;
      }
    };
    this.vehiculeTypeCarburant = {
      defaultData: {
        matricule: "",
        type_carburant: "",
        date: '//'
      },
      requiredField: ["matricule", "type_carburant"],
      inputsSpecial(data: { matricule: string; type_carburant: string; date: string; est_carburant?: boolean }, setData: any, choises: any) {
        return {
          date: InputOTPDate({
            date: data.date ? data.date + "" : "",
            setDate: (value: any) => setData((prev: any) => ({ ...prev, date: value }))
          }),
          matricule: SearchSelectChoise({
            name: "matricule",
            choises: (choises.matricules ?? []),
            value: data.matricule as string,
            onChange: ({ target: { value } }) => setData((prev: any) => ({ ...prev, matricule: value })),
          }),
          type_carburant: SearchSelectChoise({
            name: "type_carburant",
            choises: (choises.type_carburants ?? []),
            value: data.type_carburant as string,
            onChange: ({ target: { value } }) => setData((prev: any) => ({ ...prev, type_carburant: value })),
          }),
        }
      },
      validate(data: VehiculeTypeCarburantType) {
        if (!data.matricule) return "Merci de remplir le champ matricule.";
        if (!data.type_carburant) return "Merci de remplir le champ type_carburant.";
        if (data.date && !`${data.date}`.match(/^\d{2}\/\d{2}\/\d{4}$/)) return "Entrez une valide valeur pour date.";
      },
      getFields(fields: string[]) {
        return fields;
      }
    };
    this.rechanges = {
      defaultData: {
        matricule: "",
        date: '//',
        n_bon: "",
        destination: "",
        specification: "",
        reference: "",
        qte: "",
        prix_unitere: "",
        extern: "no"
      },
      requiredField: ["matricule", "n_bon", "specification", "qte", "prix_unitere", "destination",],
      inputsSpecial(data: RechangeType, setData: any, choises: any) {
        return {
          date: InputOTPDate({
            date: data.date ? data.date + "" : "",
            setDate: (value: any) => setData((prev: any) => ({ ...prev, date: value }))
          }),
          matricule: SearchSelectChoise({
            name: "matricule",
            choises: (choises ?? []),
            value: data.matricule as string,
            onChange: ({ target: { value } }) => setData((prev: any) => ({ ...prev, matricule: value })),
          }),
          extern: CheckboxPrix({ id: "extern", isChecked: (data.extern as any) === "oui", onCheckedChange: () => setData((prev: any) => ({ ...prev, extern: (data.extern as any) === "oui" ? "no" : "oui" })) })
        }
      },
      validate(data: RechangeType) {
        if (!data.n_bon) return "Merci de remplir le champ n_bon.";
        if (!data.matricule) return "Merci de remplir le champ matricule.";
        if (!data.destination) return "Merci de remplir le champ destination.";
        if (!data.specification) return "Merci de remplir le champ specification.";
        if (!data.qte) return "Merci de remplir le champ qte.";
        if (!data.prix_unitere) return "Merci de remplir le champ prix_unitere.";
        if (data.date && !`${data.date}`.match(/^\d{2}\/\d{2}\/\d{4}$/)) return "Entrez une valide valeur pour date.";
      },
      getFields(fields: string[]) {
        return fields;
      }
    };

    this.target = target;
    this.validation = this.validation.bind(this);
    this.getRequiredField = this.getRequiredField.bind(this);
    this.getDefaultData = this.getDefaultData.bind(this);
    this.getInputsSpecial = this.getInputsSpecial.bind(this);
    this.getFields = this.getFields.bind(this);
  }

  validation(data: any) {
    return this?.[this.target]?.validate(data);
  }

  getRequiredField() {
    return this?.[this.target]?.requiredField;
  }

  getDefaultData() {
    return this?.[this.target]?.defaultData;
  }

  getInputsSpecial(data: any, setData: any, choises?: string[]) {
    return this?.[this.target]?.inputsSpecial(data, setData, choises);
  }

  getFields(fields: string[]) {
    return this?.[this.target]?.getFields(fields);
  }
}