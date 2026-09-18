/** @format */

import { test, expect } from "@playwright/test";
import { writeExcelFile } from "../../excelTS/excelDemo";

test(
  "Download upload excel file",
  { tag: ["@ui", "@data", "@excel"] },
  async ({ page }, testInfo) => {
    await page.goto(
      "https://www.rahulshettyacademy.com/upload-download-test/index.html"
    );

    const downloadBtn = page.getByRole("button", { name: "Download" });
    await expect(downloadBtn).toBeVisible();

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      downloadBtn.click(),
    ]);
    const filePath = testInfo.outputPath("download.xlsx");
    await download.saveAs(filePath);

    await writeExcelFile(
      "Banana",
      350,
      { rowChange: 0, colChange: 2 },
      filePath
    );

    await page.locator("#fileinput").setInputFiles(filePath);

    const bananaRow = page
      .getByRole("row")
      .filter({ has: page.getByRole("cell", { name: "Banana", exact: true }) });
    await expect(bananaRow).toContainText("350");
  }
);
