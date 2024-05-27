export const LOCATION_ID = "K133296";

const CRLF = "\r\n";

export const generateCSV = (deliveryNote) => {
  const csvFileString = deliveryNote?.parts?.reduce(
    (result, partItem) =>
      result +
      CRLF +
      [
        `"${deliveryNote.customer?.customerNr}"`,
        `"${partItem.part.articleNr}"`,
        partItem.amount,
        `"${LOCATION_ID}"`,
      ].join(","),
    `data:text/csv;charset=utf-8;header=present,Kundennr.,Artikelnr.,Menge,Lagerort`
  );

  return csvFileString;
};
