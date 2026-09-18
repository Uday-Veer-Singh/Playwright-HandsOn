/** @format */

import { Workbook, type Worksheet } from "exceljs";

type CellChange = {
  rowChange: number;
  colChange: number;
};

type CellPosition = {
  row: number;
  column: number;
};

export async function writeExcelFile(
  searchText: string,
  replaceText: string | number,
  change: CellChange,
  filePath: string
) {
  const workbook = new Workbook();
  await workbook.xlsx.readFile(filePath);

  const sheet = workbook.getWorksheet("Sheet1");

  if (!sheet) {
    throw new Error("Sheet1 was not found");
  }

  const output = findCell(sheet, searchText);

  if (!output) {
    throw new Error(`"${searchText}" was not found`);
  }

  const cell = sheet.getCell(
    output.row + change.rowChange,
    output.column + change.colChange
  );

  cell.value = replaceText;
  await workbook.xlsx.writeFile(filePath);
}

function findCell(
  sheet: Worksheet,
  searchText: string
): CellPosition | undefined {
  let output: CellPosition | undefined;

  sheet.eachRow((row, rowNumber) => {
    row.eachCell((cell, colNumber) => {
      if (cell.value === searchText) {
        output = { row: rowNumber, column: colNumber };
      }
    });
  });

  return output;
}
