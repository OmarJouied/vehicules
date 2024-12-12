import { PrixType } from "@/models/Prix"
import { VehiculeType } from "@/models/Vehicule"
import { Table } from "@tanstack/react-table"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { utils, writeFile } from "xlsx"
import InputOTPDate from "../components/InputOTPDate"
import InputDate from "../components/InputDate"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { SelectChoise } from "@/components/SelectChoise"
import { SearchSelectChoise } from "@/components/SearchSelectChoise"
import { DeplacementType } from "@/models/Deplacement"
import { Checkbox } from "@/components/ui/checkbox"
import CheckboxPrix from "@/components/CheckboxPrix"
import { VehiculeTypeCarburantType } from "@/models/VehiculeTypeCarburant"
import { DepenseSupplementaireType } from "@/models/DepenseSupplementaire"
import html2canvas from "html2canvas"

export const getIds = (table: Table<{ _id: string }>) => {
  return table.getSelectedRowModel().rows.map(row => row.original._id)
}

export const recalcule = (table: Table<any>, fields: string[]) => {
  const fieldsToCalcule = table.getAllColumns().slice(1).filter(col => col.getIsVisible()).map(col => col.id).filter(col => fields.includes(col));
  return Object.fromEntries(table.getRowModel().rows
    .map(row => ([[row.id], fieldsToCalcule.map(field => row.original[field]).reduce((prev, next) => prev + +next, 0).toFixed(2)])))
}

export const jsonToPdf = (title: string, body: string[][], head: string[][]) => {
  const doc = new jsPDF("p", "mm", "a4")

  doc.setFontSize(12)
  doc.setFillColor(120, 120, 120)
  doc.text(title, doc.internal.pageSize.getWidth() / 2, 10, {
    align: "center"
  })
  doc.setDisplayMode("fullwidth")
  autoTable(doc, {
    head,
    body,
    margin: {
      left: 4, right: 4
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
      // fontSize: 4,
      cellPadding: 1,
      overflow: "linebreak",
      cellWidth: "wrap",
      halign: "center",
      // lineColor: '#000',
      lineWidth: .1,
      fontStyle: "bold"

    },
  })

  doc.autoPrint()
  doc.output("dataurlnewwindow")
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

export const printJSONTable = (header: string[], data: any[]) => {
  data.map(row => header.map(head => row[head] ?? ""));
  const wind = window.open();
  const div = document.createElement("div");
  div.innerHTML = `<table border=1 style="width: 100%;border-collapse: collapse"><thead>
  <tr style="background: #ccc">
    ${header.map(head => `<th style="text-transform: capitalize; padding: 0.1875rem .5rem 0.1875rem .25rem;">${head}</th>`).join("")}
  </tr>
  </thead>
  <tbody>
  ${data.map(row => `
    <tr>${header.map(head => `
      <td style="white-space: nowrap; padding: 0.1875rem .5rem 0.1875rem .25rem; line-height: 1;">
        ${row[head] ?? ""}
      </td>
      `).join("")}
    </tr>
  `).join("")}
  </tbody>
</table>`;
  div.className = "fixed p-4"
  document.body.appendChild(div)
  const zoomIn = div.getBoundingClientRect().width / window.outerWidth;


  wind?.document?.write(`<div style="transform: scale(${zoomIn > 1 ? 1 / zoomIn : zoomIn}); transform-origin: center;position: absolute; top: 0; left: 0; padding: 1rem"><table border=1 style="width: 100%;border-collapse: collapse"><thead>
  <tr style="background: #ccc">
    ${header.map(head => `<th style="text-transform: capitalize; padding: 0.1875rem .5rem 0.1875rem .25rem;">${head}</th>`).join("")}
  </tr>
  </thead>
  <tbody>
  ${data.map(row => `
    <tr>${header.map(head => `
      <td style="white-space: nowrap; padding: 0.1875rem .5rem 0.1875rem .25rem; line-height: 1;">
        ${row[head] ?? ""}
      </td>
      `).join("")}
    </tr>
  `).join("")}
  </tbody>
</table>
</div>
`);
  wind?.window.print();
  console.log({ innerwidth: wind?.innerWidth, outerwidth: wind?.outerWidth })
}

export const printGraph = async () => {
  const element = document.querySelector("[data-chart=chart-graph]");
  if (!element) return;

  const canvas = await html2canvas(element as any);
  const data = canvas.toDataURL("image/png");

  return data

  const pdfDoc = new jsPDF(
    //   {
    //   orientation: "landscape",
    //   unit: "px",
    //   format: "a4"
    // }
  );
  pdfDoc.addImage(data, 'PNG', 0, 0, 100, 100);

  pdfDoc.autoPrint();
  pdfDoc.output("dataurlnewwindow")
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

  constructor(target: "prix" | "vehicules") {
    this.vehicules = {
      defaultData: {
        matricule: "", affectation: "", assurance: 0, carnet_metrologe: 0, dateachat: "",
        datemc: "", genre: "", marque: "", numchassis: "", observation: "", poids: 0, prix_aquisiti: 0,
        taxe_tenage: 0, type: "", type_carburant: "", vignte: 0, visite_technique: 0, onssa: 0
      },
      requiredField: ["matricule"],
      inputsSpecial(data: any, setData: any, choises?: string[], editing?: boolean) {
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
        qte_lub: 0, vidange: 0, qte_carburant: 0, kilometrage: 0,
        carburant_valeur: 0, lub_valeur: 0, filter_changer: undefined
      },
      requiredField: ["matricule", "carburant_valeur", "lub_valeur",],
      inputsSpecial(data: DeplacementType & { carburant_valeur: string, lub_valeur: string, kilometrage_entre: string, kilometrage_sorte: string }, setData: any, choises?: any, editing?: boolean) {
        return {
          kilometrage_entre: InputDate({
            id: "lub_valeur",
            onChange: ({ target: { value } }) => setData((prev: any) => ({ ...prev, kilometrage_entre: value, kilometrage: +((value + "").match(/^-?\d+$/) ? value : 0) - +(prev.kilometrage_sorte ?? 0) })),
            placeholder: "",
            value: data.kilometrage_entre,
            errorCondition: false
          }),
          kilometrage_sorte: InputDate({
            id: "lub_valeur",
            onChange: ({ target: { value } }) => setData((prev: any) => ({ ...prev, kilometrage_sorte: value, kilometrage: +(prev.kilometrage_entre ?? 0) - +((value + "").match(/^-?\d+$/) ? value : 0) })),
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
      defaultData: {
        matricule: "",
        kilometrage: 0,
      },
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
        prix_valeur: 0,
        est_carburant: undefined,
        date: '//'
      },
      requiredField: ["prix_name", "prix_valeur"],
      inputsSpecial(data: { date: string; est_carburant?: boolean }, setData: any) {
        console.log({ data })
        return {
          date: InputOTPDate({
            date: data.date ? data.date + "" : "",
            setDate: (value: any) => setData((prev: any) => ({ ...prev, date: value }))
          }),
          est_carburant: CheckboxPrix({ id: "est_carburant", isChecked: !!data.est_carburant, onCheckedChange: () => setData((prev: any) => ({ ...prev, est_carburant: !prev.est_carburant || undefined })) })
        }
      },
      validate(data: PrixType) {
        console.log({ data })
        if (!data.prix_name) return "Merci de remplir le champ prix_name.";
        if (!data.prix_valeur || data.prix_valeur < 0) return "Entrez une valeur positive pour vidange.";
        if (data.date && !`${data.date}`.match(/^\d{2}\/\d{2}\/\d{4}$/)) return "Entrez une valide valeur pour date.";
      },
      getFields(fields: string[]) {
        return [...fields, "est_carburant"];
      }
    };
    this.analytics = {
      defaultData: {
        type_carburant: {
          diesel: 0,
          essence_ksar: 0,
          essence_tetouan: 0,
        },
        lub: 0
      },
      requiredField: ["type_carburant", "valeur"],
      inputsSpecial() {
        return {}
      },
      validate(data: any) {
        for (const item of Object.values(data)) {
          if (!(item + "").match(/^\d*\.?\d*$/)) return "Merci de obtenir une valeur numerique superieure.";
        }
      },
      getFields(fields: string[]) {
        return fields;
      },
    };
    this.depensesSupplementaires = {
      defaultData: {
        matricule: "",
        type_depense: "",
        valeur: 0,
        date: '//',
      },
      requiredField: ["matricule", "type_depense", "valeur", "date",],
      inputsSpecial(data: { date: string; matricule: string; type_depense: string }, setData: any, choises: any) {
        console.log({ data })
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
        if (!data.valeur || data.valeur < 0) return "Entrez une valeur positive pour valeur.";
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
        console.log({ data })
        if (!data.matricule) return "Merci de remplir le champ matricule.";
        if (!data.type_carburant) return "Merci de remplir le champ type_carburant.";
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

  getInputsSpecial(data: any, setData: any, choises?: string[], editing?: boolean) {
    return this?.[this.target]?.inputsSpecial(data, setData, choises, editing);
  }

  getFields(fields: string[]) {
    return this?.[this.target]?.getFields(fields);
  }
}