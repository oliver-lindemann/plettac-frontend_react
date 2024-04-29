import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'

import { formatDate } from '../../../utils/StringUtils';
import { formatNumber, formatWeight } from '../../../utils/NumberUtils';
import { getWeightSumOf, groupPartsByOrigin } from '../../../utils/checklist/ChecklistPartsUtils';
import { DELIVERY_NOTE_LOGISTICS, DELIVERY_NOTE_LOGISTICS_LANG, formatDeliveryNoteNumber } from '../../../config/deliveryNote';
import { getGroupAsString } from '../../../components/parts/list/DefaultPartItemsListHeader';

const GMW_LOGO = new Image();
const PLETTAC_LOGO = new Image();
GMW_LOGO.src = require('../../../images/GMW_Logo_Web_cropped.jpg');
PLETTAC_LOGO.src = require('../../../images/PlettacAssco_Logo_cropped.jpg');

// Margin on Left and Right
const MARGIN_X = 14.11;

// A4-Size
const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;

const IMAGE_GMW_WIDTH = 38.23;
const IMAGE_GMW_HEIGHT = 23;

const IMAGE_PLETTAC_WIDTH = 66.93;
const IMAGE_PLETTAC_HEIGHT = 28;

const CELL_PADDING = 1;
const SIGNATURE_BREAK = 218;

const totalPagesExp = '{total_pages_count_string}';

const HEADER_FONT_NAME = 'Verdana';
const HEADER_FONT_NORMAL = require('../../../resources/fonts/VERDANA.TTF');
const HEADER_FONT_BOLD = require('../../../resources/fonts/VERDANAB.TTF');

const TEXT_FONT_NAME = 'Arial';
const TEXT_FONT_NORMAL = require('../../../resources/fonts/ARIAL.TTF');
const TEXT_FONT_BOLD = require('../../../resources/fonts/ARIALBD.TTF');

const SIGNATURE_MAX_WIDTH = 55;
const SIGNATURE_MAX_HEIGHT = 30;

export const generatePlettacPDF = async (deliveryNote) => {
    console.log("Generate PDF");
    const pdf = new jsPDF();

    pdf.addFont(HEADER_FONT_NORMAL, HEADER_FONT_NAME, 'normal');
    pdf.addFont(HEADER_FONT_BOLD, HEADER_FONT_NAME, 'bold');

    pdf.addFont(TEXT_FONT_NORMAL, TEXT_FONT_NAME, 'normal');
    pdf.addFont(TEXT_FONT_BOLD, TEXT_FONT_NAME, 'bold');

    pdf.setFont(TEXT_FONT_NAME);
    pdf.setTextColor(0)

    const tableHeader = [[
        { content: 'Pos.', styles: { halign: 'center' } },
        'Artikelnr.',
        'Bezeichnung',
        { content: 'Menge', styles: { halign: 'right' } },
        { content: 'Gewicht', styles: { halign: 'right' } }
    ]];

    const originRow = (origin) => (
        [
            { content: '', styles: { lineWidth: { left: 0.1, right: 0 } } },
            { content: '', styles: { lineWidth: { left: 0, right: 0 } } },
            { content: origin, styles: { fontStyle: 'bold', lineWidth: { left: 0, right: 0 } } },
            { content: '', styles: { lineWidth: { left: 0, right: 0 } } },
            { content: '', styles: { lineWidth: { left: 0, right: 0.1 } } },
        ]
    )

    let previousOrigin = null;
    let lastIndex = 0;
    const tableData = Object.values(groupPartsByOrigin(deliveryNote.parts)).map(entry => {
        const origin = entry.id;
        const partItems = entry.parts;

        const rows = [];

        if (previousOrigin !== origin) {
            rows.push(originRow(getGroupAsString(origin)));
        }

        partItems.forEach((partItem, index) => {
            rows.push([
                (lastIndex + index + 1).toString(),
                partItem.part.articleNr?.toString(),
                `${partItem.part.name}${partItem.part.length ? ' ' + formatNumber(partItem.part.length) : ''}`,
                partItem.amount.toString() + ' Stk.',
                formatWeight(partItem.amount * partItem.part?.weight)
            ])
        })

        lastIndex += partItems.length;
        previousOrigin = origin;
        return rows;
    }).reduce((rows, currentRows) => rows.concat(currentRows), []);

    const customPartsTableData = [originRow('Weitere')];
    deliveryNote.customParts?.forEach((partItem, index) => {
        customPartsTableData.push([
            (lastIndex + index + 1).toString(),
            partItem.part.articleNr?.toString(),
            `${partItem.part.name}${partItem.part.length ? ', ' + formatNumber(partItem.part.length) : ''}`,
            partItem.amount.toString() + ' Stk.',
            "-"
        ])
    });


    const finalData = tableData.concat(customPartsTableData.length > 1 ? customPartsTableData : []);
    // const tableData = deliveryNote.parts.map((partItem, index) =>
    //     [
    //         (index + 1).toString(),
    //         partItem.part.articleNr?.toString(),
    //         `${partItem.part.name}${partItem.part.length ? ', ' + formatNumber(partItem.part.length) : ''}`,
    //         partItem.amount.toString() + ' Stk.',
    //         formatNumber(partItem.amount * partItem.part?.weight) + " kg"
    //     ]
    // );

    const headStyles = {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0]
    };
    const columnStyles = {
        0: { halign: 'center' },
        3: { halign: 'right' },
        4: { halign: 'right' }
    };

    // Store last cell to check for enough space for signature field
    let lastCell;

    pdf.setFont('Arial', 'normal');

    autoTable(pdf, {
        // Head and body data
        head: tableHeader,
        body: finalData,

        theme: 'grid',

        // Styles
        headStyles: headStyles,
        columnStyles: columnStyles,
        styles: { cellPadding: { top: CELL_PADDING, right: CELL_PADDING, bottom: CELL_PADDING, left: CELL_PADDING } },
        margin: { top: 115, bottom: 50 },

        didParseCell: function (data) {
            if (
                data.row.section === 'head'
            ) {
                data.cell.styles.lineColor = 'black'
                data.cell.styles.lineWidth = {
                    bottom: 0.5,
                }
            }
        },

        // Add Table Body
        didDrawPage: (data) => {
            addHeaderAndFooter(pdf, deliveryNote);
            addPageNumber(pdf);
        },
        // Save last cell y-coordinate
        didDrawCell: (data) => {
            lastCell = data.cell;
        },
    });

    // Add PageBreak if there is not enough space for signature field
    const lastCellY = lastCell.y + lastCell.height;

    // Add weight summary
    pdf.line(PAGE_WIDTH - MARGIN_X - 50, lastCellY + 5, PAGE_WIDTH - MARGIN_X, lastCellY + 5);
    pdf.line(PAGE_WIDTH - MARGIN_X - 50, lastCellY + 6, PAGE_WIDTH - MARGIN_X, lastCellY + 6);

    pdf.setFontSize(10);
    pdf.text(`Gesamtgewicht: ${getWeightSumOf(deliveryNote.parts)} kg`, 195, lastCellY + 10, null, null, 'right')

    if (lastCellY + 15 > SIGNATURE_BREAK) {
        pdf.addPage();
        // If Page added, add also header, footer and page number
        addHeaderAndFooter(pdf, deliveryNote);
        addPageNumber(pdf);
    }

    await addSignatures(pdf, deliveryNote);

    // The putTotalPages does not work with custom fonts
    performWithDefaultFont(pdf, () => {
        if (typeof pdf.putTotalPages === 'function') {
            pdf.putTotalPages(totalPagesExp)
        }
    });

    console.log("Finished generation")
    return pdf;
}

const addHeaderAndFooter = (pdf, deliveryNote) => {
    addStaticHeader(pdf);
    addCustomerInfo(pdf, deliveryNote);
    addStaticFooter(pdf);
}

const addStaticHeader = (pdf) => {
    const imageX = pdf.internal.pageSize.getWidth() - (MARGIN_X + IMAGE_GMW_WIDTH);

    pdf.setFontSize(8);
    pdf.setFont(TEXT_FONT_NAME, 'normal');
    const textLength = pdf.getTextWidth('in Kooperation mit');
    pdf.text('in Kooperation mit', PAGE_WIDTH - MARGIN_X - textLength, 10);


    pdf.addImage(GMW_LOGO, 'JPEG', imageX, 12, IMAGE_GMW_WIDTH, IMAGE_GMW_HEIGHT)


    pdf.addImage(PLETTAC_LOGO, 'JPEG', MARGIN_X, 10, IMAGE_PLETTAC_WIDTH, IMAGE_PLETTAC_HEIGHT)

    // pdf.setFontSize(22);
    // pdf.setFont(HEADER_FONT_NAME, 'bold');
    // pdf.text("Gerüstbau Werdermann", MARGIN_X, 20);
    // pdf.text("GmbH & Co. KG", MARGIN_X, 30);


    pdf.setFontSize(8);
    pdf.setFont(TEXT_FONT_NAME, 'normal');
    let plettacInfoY = IMAGE_GMW_HEIGHT + 15;
    const plettacInfoX = (PAGE_WIDTH / 2) + 20;

    let maxTextWidth = pdf.getTextWidth('Telefonnr.') + 3;
    pdf.text('Vertreter', plettacInfoX, plettacInfoY += 8);
    pdf.text('Steffen Hoffmann-Daehn', plettacInfoX + maxTextWidth, plettacInfoY)

    pdf.text('Telefonnr.', plettacInfoX, plettacInfoY += 4);
    pdf.text('+49 171 6477000', plettacInfoX + maxTextWidth, plettacInfoY)

    pdf.text('Faxnr.', plettacInfoX, plettacInfoY += 4);
    pdf.text('+49 2391 815 - 344', plettacInfoX + maxTextWidth, plettacInfoY)

    pdf.text('E-Mail', plettacInfoX, plettacInfoY += 4);
    pdf.text('steffen.hoffmann-daehn@plettac-assco.de', plettacInfoX + maxTextWidth, plettacInfoY)


    pdf.text('Verkäufer', plettacInfoX, plettacInfoY += 8);
    pdf.text('Christopher Woeste', plettacInfoX + maxTextWidth, plettacInfoY)

    pdf.text('Telefonnr.', plettacInfoX, plettacInfoY += 4);
    pdf.text('+49 2391 815 - 350', plettacInfoX + maxTextWidth, plettacInfoY)

    pdf.text('Faxnr.', plettacInfoX, plettacInfoY += 4);
    pdf.text('+49 2391 815 - 344', plettacInfoX + maxTextWidth, plettacInfoY)

    pdf.text('E-Mail', plettacInfoX, plettacInfoY += 4);
    pdf.text('christopher.woeste@plettac-assco.de', plettacInfoX + maxTextWidth, plettacInfoY)


    pdf.setFontSize(8);
    pdf.setFont(TEXT_FONT_NAME, 'normal');

    pdf.setFontSize(6.5);
    pdf.text('ALTRAD plettac assco GmbH, Postfach 5242, 58829 Plettenberg', MARGIN_X, 54);
}

const addStaticFooter = (pdf) => {
    const footerLine = PAGE_HEIGHT - 31
    const lineHeight = 3;

    const row1 = footerLine + lineHeight;
    const row2 = row1 + lineHeight;
    const row3 = row2 + lineHeight;
    const row4 = row3 + lineHeight;
    const row5 = row4 + lineHeight;
    const row6 = row5 + lineHeight;
    const row7 = row6 + lineHeight;

    const column1 = MARGIN_X;
    const column2 = column1 + 60;
    const column3 = column2 + 70;

    pdf.line(MARGIN_X, footerLine, PAGE_WIDTH - MARGIN_X, footerLine); // horizontal line

    pdf.setFontSize(6);
    pdf.setFont(HEADER_FONT_NAME, 'normal');
    pdf.text('Unsere allgemeinen Geschäftsbedingungen finden Sie unter: www.plettac-assco.de', column1, row1);

    pdf.setFont(HEADER_FONT_NAME, 'bold');
    pdf.text('ALTRAD plettac assco GmbH', column1, row2);

    pdf.setFont(HEADER_FONT_NAME, 'normal');
    pdf.text('Postfach 5242', column1, row3);
    pdf.text('58829 Plettenberg', column1, row4);


    let maxTextLength = pdf.getTextWidth('Telefonnr.');
    pdf.text('Telefonnr.', column1, row6);
    pdf.text('02391 / 815 - 01', column1 + maxTextLength + 3, row6)
    pdf.text('Faxnr.', column1, row7);
    pdf.text('02391 / 815 - 376', column1 + maxTextLength + 3, row7)

    maxTextLength = pdf.getTextWidth('Geschäftsführer');

    pdf.text('USt-IdNr.', column2, row3);
    pdf.text('DE813876548', column2 + maxTextLength + 3, row3)
    pdf.text('Geschäftsführer', column2, row4);
    pdf.text('Ralf Deitenberg', column2 + maxTextLength + 3, row4)

    pdf.text('Homepage', column2, row6);
    pdf.text('www.plettac-assco.de', column2 + maxTextLength + 3, row6)
    pdf.text('Email', column2, row7);
    pdf.text('info@plettac-assco.de', column2 + maxTextLength + 3, row7)

    maxTextLength = pdf.getTextWidth('IBAN');

    pdf.setFont(HEADER_FONT_NAME, 'bold');
    pdf.text('Bank', column3, row2);
    pdf.text('Commerzbank AG', column3 + maxTextLength + 3, row2);

    pdf.setFont(HEADER_FONT_NAME, 'normal');
    pdf.text('IBAN', column3, row3);
    pdf.text('DE69 4584 1031 0810 1065 00', column3 + maxTextLength + 3, row3)
    pdf.text('BIC', column3, row4);
    pdf.text('COBADEFFXXX', column3 + maxTextLength + 3, row4)

    pdf.setFont(TEXT_FONT_NAME, 'normal');

    pdf.line(MARGIN_X, row7 + lineHeight, PAGE_WIDTH - MARGIN_X, row7 + lineHeight); // horizontal line
}

const addCustomerInfo = (pdf, deliveryNote) => {
    const anschriftY = 67;

    pdf.setFontSize(12);
    pdf.text(deliveryNote.customer?.name || '', MARGIN_X, anschriftY);
    pdf.text(deliveryNote.customer?.street || '', MARGIN_X, anschriftY + 5);
    pdf.text(deliveryNote.customer?.city || '', MARGIN_X, anschriftY + 10);

    pdf.setFont(pdf.getFont().fontName, 'bold');
    const isOutbound = deliveryNote.logistics === DELIVERY_NOTE_LOGISTICS.OUTBOUND;
    const deliveryNoteTitle = `Lieferschein ${formatDeliveryNoteNumber(deliveryNote)} - ${DELIVERY_NOTE_LOGISTICS_LANG[deliveryNote.logistics]} ${deliveryNote.logistics === DELIVERY_NOTE_LOGISTICS.CANCELLATION ? `zu ${formatDeliveryNoteNumber(deliveryNote.relatedDeliveryNote)}` : ''}`;
    const deliveryNoteTitleLength = pdf.getTextWidth(deliveryNoteTitle);
    pdf.text(deliveryNoteTitle, MARGIN_X, anschriftY + 25);
    pdf.line(MARGIN_X, anschriftY + 27, MARGIN_X + deliveryNoteTitleLength, anschriftY + 27);
    pdf.setFont(pdf.getFont().fontName, 'normal');
    pdf.text(`Datum: ${formatDate(new Date(deliveryNote.dateOfIssue))} `, 195, anschriftY + 25, null, null, 'right');

    pdf.setFontSize(10);
    const namesOffsetX = pdf.getTextWidth("Empfänger") + 3;
    pdf.text('Empfänger:', MARGIN_X, anschriftY + 34);
    pdf.text(isOutbound ? deliveryNote.personInCharge : deliveryNote.warehouseWorker?.name, MARGIN_X + namesOffsetX, anschriftY + 34)

    pdf.text('Lieferant:', MARGIN_X, anschriftY + 38);
    pdf.text(isOutbound ? deliveryNote.warehouseWorker?.name : deliveryNote.personInCharge, MARGIN_X + namesOffsetX, anschriftY + 38)

    pdf.text('Bemerkung:', MARGIN_X, anschriftY + 42);
    const wrappedNote = pdf.splitTextToSize(deliveryNote.note, 100);
    pdf.text(wrappedNote, MARGIN_X + namesOffsetX, anschriftY + 42);

    const baseOffsetX = 70;
    const constructionProjectOffsetX = pdf.getTextWidth("Bauvorhaben") + 3;
    pdf.text('Kennzeichen:', baseOffsetX, anschriftY + 34);
    pdf.text(deliveryNote.licensePlate, baseOffsetX + constructionProjectOffsetX, anschriftY + 34);

    pdf.text('Bauvorhaben:', baseOffsetX, anschriftY + 38);
    pdf.text(deliveryNote.constructionProject, baseOffsetX + constructionProjectOffsetX, anschriftY + 38);


    const storageOffsetX = pdf.getTextWidth("Ab Lager") + 3;
    pdf.text('Ab Lager:', baseOffsetX + 55, anschriftY + 34);
    pdf.text('Gerüstbau Werdermann\nGmbH & Co. KG\nMühlenberg 4, 17235 Neustrelitz', baseOffsetX + 55 + storageOffsetX, anschriftY + 34)


}

const addSignatures = async (pdf, deliveryNote) => {
    const isOutbound =
      deliveryNote.logistics === DELIVERY_NOTE_LOGISTICS.OUTBOUND;
  
    pdf.setFontSize(10);
  
    const leftSignatureImage = isOutbound
      ? deliveryNote.signatures?.customer
      : deliveryNote.signatures?.warehouseWorker;
    const leftSignatureLabel = `Empfänger: ${
      isOutbound
        ? deliveryNote.personInCharge
        : deliveryNote.warehouseWorker?.name
    }`;
    await addSignature({
      pdf,
      signatureX: 25,
      signatureY: 210,
      signatureBase64: leftSignatureImage,
      label: leftSignatureLabel,
    });
  
    const rightSignatureImage = isOutbound
      ? deliveryNote.signatures?.warehouseWorker
      : deliveryNote.signatures?.customer;
    const rightSignatureLabel = `Lieferant: ${
      isOutbound
        ? deliveryNote.warehouseWorker?.name
        : deliveryNote.personInCharge
    }`;
    await addSignature({
      pdf,
      signatureX: 125,
      signatureY: 210,
      signatureBase64: rightSignatureImage,
      label: rightSignatureLabel,
    });
  
    pdf.setFontSize(8);
    pdf.text(
      "Mit der Unterschrift bestätigt der Empfänger den Erhalt, Vollständigkeit und ordnungsgemäßen Zustand der oben aufgelisteten Ware.",
      20,
      258
    );
  };
  
  const addSignature = async ({
    pdf,
    signatureX,
    signatureY,
    signatureBase64,
    label,
  }) => {
    try {
      if (!!signatureBase64) {
        const signatureCustomerAsImage = await loadImage(signatureBase64);
  
        const minRatioCustomer = Math.min(
          SIGNATURE_MAX_WIDTH / signatureCustomerAsImage.width,
          SIGNATURE_MAX_HEIGHT / signatureCustomerAsImage.height
        );
  
        const drawableSignatureWidth =
          signatureCustomerAsImage.width * Math.min(1, minRatioCustomer);
        const drawableSignatureHeight =
          signatureCustomerAsImage.height * Math.min(1, minRatioCustomer);
  
        const signatureWidthPositionOffset =
          SIGNATURE_MAX_WIDTH / 2 - drawableSignatureWidth / 2;
        const signatureHeightPositionOffset =
          SIGNATURE_MAX_HEIGHT - drawableSignatureHeight;
  
        pdf.addImage(
          signatureCustomerAsImage,
          "PNG",
          signatureX + signatureWidthPositionOffset,
          signatureY + signatureHeightPositionOffset,
          drawableSignatureWidth,
          drawableSignatureHeight
        );
      }
    } catch (e) {
      console.log(e);
    }
  
    /* Draw Signature Line below signature image and above signature label */
    const signatureLineY = signatureY + SIGNATURE_MAX_HEIGHT;
    const signatureLineXStart = signatureX - 5;
    const signatureLineXEnd = signatureX + SIGNATURE_MAX_WIDTH + 5;
    pdf.line(
      signatureLineXStart,
      signatureLineY,
      signatureLineXEnd,
      signatureLineY
    );
  
    /* Add signature label below signature line */
    const labelTextWidth = pdf.getTextWidth(label);
    const labelTextStartX =
      (signatureLineXEnd - signatureLineXStart - labelTextWidth) / 2;
    pdf.text(label, signatureLineXStart + labelTextStartX, signatureLineY + 5);
  };
  

const loadImage = (src) => {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = src
    })
}

const addPageNumber = (pdf) => {
    var str = 'Seite ' + pdf.internal.getNumberOfPages();
    if (typeof pdf.putTotalPages === 'function') {
        str = str + ' / ' + totalPagesExp;
    }
    pdf.setFontSize(10);
    const pageNumberWidth = pdf.getTextWidth('Seite _ / _');
    performWithDefaultFont(pdf, () => pdf.text(str, (PAGE_WIDTH / 2) - (pageNumberWidth / 2), PAGE_HEIGHT - 35));
}

const performWithDefaultFont = (pdf, func) => {
    const currentFont = pdf.getFont();
    pdf.setFont('Arial', 'normal');
    func();
    pdf.setFont(currentFont.fontName, currentFont.fontStyle, currentFont.fontWeight);
}

export const autoPrint = (pdf) => {
    pdf.autoPrint();
}

export const saveAndPrint = (pdf, filename) => {
    pdf.autoPrint();
    pdf.save(filename);
}