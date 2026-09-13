/** @format */

import { Workbook } from "exceljs";

async function readExcelFile() {
  const workbook = new Workbook();
  await workbook.xlsx.readFile(
    "C:/Users/Acer/OneDrive/Desktop/excelDownload.xlsx"
  );

  const sheet = workbook.getWorksheet("Sheet1");

  if (!sheet) {
    console.log("Sheet not found");
    return;
  }

  sheet.eachRow((row, rowNumber) => {
    console.log(`Row ${rowNumber}:`);

    row.eachCell((cell, colNumber) => {
      console.log(`  Col ${colNumber}:`, cell.value);
    });
  });
}

readExcelFile();
