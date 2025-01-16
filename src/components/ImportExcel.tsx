import React, { ChangeEventHandler, useState } from 'react'
import { Label } from './ui/label'
import { read, utils } from 'xlsx';
import ImportData from './ImportData';
import { columns } from './columns';

const ImportExcel = ({ fields, target }: { fields: string[]; target: string }) => {
  const [data, setData] = useState<any[]>([]);

  const parseExcel = async (file: File) => {
    return await new Promise(async (res, rej) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e) => {
        const bufferArray = e.target?.result;
        const wb = read(bufferArray, { type: "buffer" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = utils.sheet_to_json(ws, {
          raw: false
        });
        res(data);
      };
      fileReader.onerror = (e) => {
        rej(e);
      }
    });
  };

  const toXlsx: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files && e.target.files[0];
    const extension = file?.name.split(".").pop();

    if (file && ["csv", "xlsx", ".xls"].includes(extension + "")) {
      const data = await parseExcel(file) as any[];

      setData(
        data.map(
          row => (
            {
              ...Object.fromEntries(fields.map(i => [i, ""])),
              ...Object.fromEntries(Object.entries(row).map(([key, value]) => [key.toLowerCase(), value]))
            }
          )
        )
      )
    }
    e.target.value = ''
  };

  return (
    <>
      <Label className='bg-primary hover:bg-primary/90 text-white p-4 rounded-md cursor-pointer'>
        <span>importer excel</span>
        <input onChange={toXlsx} type="file" className='hidden' accept='.xlsx, .xls, .csv' />
      </Label>
      {data.length > 0 && (
        <ImportData data={data} columns={columns(fields)} target={target} />
      )}
    </>
  )
}

export default ImportExcel