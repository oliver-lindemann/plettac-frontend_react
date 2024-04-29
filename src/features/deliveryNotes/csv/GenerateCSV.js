export const LOCATION_ID = 100200;

export const generateCSV = (deliveryNote) => {
  let csvFile = "data:text/csv;charset=utf-8,";

  deliveryNote?.parts?.forEach((partItem, index) => {
    csvFile += `
        ${deliveryNote.customer?.customerNr},
        ${partItem.part.articleNr},
        ${partItem.amount},
        ${"K133296"}
        \r\n
    `;
  });

  return csvFile;
};
