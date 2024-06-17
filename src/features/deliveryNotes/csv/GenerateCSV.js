export const LOCATION_ID = "K133296";

const CRLF = "\r\n";
const SEPARATOR = ";";

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
      ].join(SEPARATOR),
    `data:text/csv;charset=utf-8;header=present,Kundennr.${SEPARATOR}Artikelnr.${SEPARATOR}Menge${SEPARATOR}Lagerort`
  );

  return csvFileString;
};
