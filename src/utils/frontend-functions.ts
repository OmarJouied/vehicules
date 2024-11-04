import { VehiculeType } from "@/models/Vehicule"
import { Table } from "@tanstack/react-table"

export const getMarticules = (table: Table<VehiculeType>) => {
  return table.getFilteredSelectedRowModel().rows.map(row => row.original.matricule)
}

export const generateReport = (id: string) => {
  const table = document.getElementById(id);
  const newWin = window.open("");
  newWin?.document.write(table?.outerHTML ?? "");
  newWin?.print();
  // newWin?.close()
}

export const scaleTable = () => {

  //This hacky stuff is used because the table is invisible in IE.  
  function realWidth(obj: HTMLElement) {
    var clone = obj.cloneNode();
    clone.style.visibility = "hidden";
    document.body.append(clone);
    var width = clone.cl.outerWidth();
    clone.remove();
    return width;
  }
  function realHeight(obj: HTMLElement) {
    var clone = obj.cloneNode();
    clone.style.visibility = "hidden";
    document.body.append(clone);
    var height = clone.outerHeight();
    clone.remove();
    return height;
  }

  var table = document.getElementById("vehicules")!;

  var tablecontainer = table?.parentElement!;
  var scalex = tablecontainer.clientWidth / realWidth(table);
  var scaley = tablecontainer.clientHeight / realHeight(table);

  var scale = Math.min(scalex, scaley);

  if (scale < 1.0) {
    var fontsize = 12.0 * scale;
    var padding = 5.0 * scale;
    // $("#"+markupId+" table tbody").css("font-size", fontsize + "px");
    document.querySelector("#vehicules tbody")!.style.fontSize = fontsize + "px";
    document.querySelector("#vehicules tbody td")!.style.padding = padding + "px";
    document.querySelector("#vehicules tbody th")!.style.padding = padding + "px";



    // $("#"+markupId+" table tbody TD").css("padding",padding + "px");
    // $("#"+markupId+" table TH").css("padding",padding + "px");
  }
};