/** @format */

import { Workbook } from "exceljs";

async function writeExcelFile(
  searchText: string,
  replaceText: string,
  filePath: string
) {
  const workbook = new Workbook();
  await workbook.xlsx.readFile(filePath);

  const sheet = workbook.getWorksheet("Sheet1");

  const output = await readExcelFile(sheet, searchText);

  if (!sheet) {
    console.log("Sheet not found");
    return;
  }

  const cellValue = sheet.getCell(output.row, output.column);
  cellValue.value = replaceText;
  await workbook.xlsx.writeFile(filePath);
}

async function readExcelFile(sheet, searchText) {
  let output = { row: 1, column: 1 };

  sheet.eachRow((row, rowNumber) => {
    // console.log(`Row ${rowNumber}:`);

    row.eachCell((cell, colNumber) => {
      // console.log(`  Col ${colNumber}:`, cell.value);

      if (cell.value === searchText) {
        output.row = rowNumber;
        output.column = colNumber;
      }
    });
  });
  return output;
}

writeExcelFile(
  "Banana",
  "Republic",
  "C:/Users/Acer/OneDrive/Desktop/excelDownload.xlsx"
);
