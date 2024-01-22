export const LOCATION_ID = 100200;

export const generateCSV = (deliveryNote) => {
  console.log("GenerateCSV: ", deliveryNote);
  let csvFile = "data:text/csv;charset=utf-8,";

  deliveryNote?.parts?.forEach((partItem, index) => {
    csvFile += `${LOCATION_ID},${partItem.part.articleNr},${partItem.amount},${'K133296'}\r\n`;
  });

  console.log(csvFile);
  return csvFile;
};
