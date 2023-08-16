import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'

import { formatDate } from '../../../utils/StringUtils';
import { formatNumber, formatWeight } from '../../../utils/NumberUtils';
import { getWeightSumOf, groupPartsByOrigin } from '../../../utils/checklist/ChecklistPartsUtils';
import { DELIVERY_NOTE_LOGISTICS } from '../../../config/deliveryNote';
import { getGroupAsString } from '../../../components/parts/list/DefaultPartItemsListHeader';

const GMW_LOGO = new Image();
GMW_LOGO.src = require('../../../images/GMW_Logo_Web_cropped.jpg');

// Margin on Left and Right
const MARGIN_X = 14.11;

// A4-Size
const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;

const IMAGE_WIDTH = 46.5;
const IMAGE_HEIGHT = 28;

const CELL_PADDING = 1;
const SIGNATURE_BREAK = 218;

const totalPagesExp = '{total_pages_count_string}';

const HEADER_FONT_NAME = 'Verdana';
const HEADER_FONT_NORMAL = require('../../../resources/fonts/VERDANA.TTF');
const HEADER_FONT_BOLD = require('../../../resources/fonts/VERDANAB.TTF');

const TEXT_FONT_NAME = 'Arial';
const TEXT_FONT_NORMAL = require('../../../resources/fonts/ARIAL.TTF');
const TEXT_FONT_BOLD = require('../../../resources/fonts/ARIALBD.TTF');

export const generatePDF = async (deliveryNote) => {
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

    await addSignature(pdf, deliveryNote);

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
    const imageX = pdf.internal.pageSize.getWidth() - (MARGIN_X + IMAGE_WIDTH);
    pdf.addImage(GMW_LOGO, 'JPEG', imageX, 10, IMAGE_WIDTH, IMAGE_HEIGHT)

    pdf.setFontSize(22);
    pdf.setFont(HEADER_FONT_NAME, 'bold');
    pdf.text("Gerüstbau Werdermann", MARGIN_X, 20);
    pdf.text("GmbH & Co. KG", MARGIN_X, 30);
    pdf.setFont(TEXT_FONT_NAME, 'normal');

    pdf.setFontSize(8);
    let infoX = 10 + IMAGE_HEIGHT;
    const ownInfo = 3.5
    pdf.text('Mühlenberg 4', imageX, infoX += 8);
    pdf.text('17235 Neustrelitz', imageX, infoX += ownInfo);

    pdf.text('Tel.  03981 44 77 12', imageX, infoX += ownInfo + 2);
    pdf.text('Fax: 03981 44 73 27', imageX, infoX += ownInfo);

    pdf.text('info@werdermann.com', imageX, infoX += ownInfo + 2);
    pdf.text('www.werdermann.com', imageX, infoX += ownInfo);

    pdf.setFontSize(6.5);
    pdf.text('Gerüstbau Werdermann GmbH & Co. KG | Mühlenberg 4 | 17235 Neustrelitz', MARGIN_X, 54);
}

const addStaticFooter = (pdf) => {
    const footerLine = PAGE_HEIGHT - 24
    const lineHeight = 4;

    const row1 = footerLine + lineHeight;
    const row2 = row1 + lineHeight;
    const row3 = row2 + lineHeight;
    const row4 = row3 + lineHeight;

    const column1 = MARGIN_X;
    const column2 = column1 + 40;
    const column3 = column2 + 45;
    const column4 = column3 + 60;

    pdf.line(MARGIN_X, footerLine, PAGE_WIDTH - MARGIN_X, footerLine); // horizontal line

    pdf.setFontSize(8);
    pdf.setFont(HEADER_FONT_NAME, 'normal');
    pdf.text('Geschäftsführer/Inhaber:', column1, row1);
    pdf.text('Ralf Mohnke', column1, row2);
    pdf.text('Andy Wildner', column1, row3);

    pdf.text('Handelsregister', column2, row1)
    pdf.text('Amtsgericht Neubrandenburg', column2, row2)
    pdf.text('HRA 1753', column2, row3)

    pdf.text('Bankverbindung', column3, row1)
    pdf.text('Sparkasse Mecklenburg-Strelitz', column3, row2)
    pdf.text('IBAN: DE27 1505 1732 0030 0065 06', column3, row3)
    pdf.text('BIC: NOLADE21MST', column3, row4)

    pdf.text('Finanzamt Waren', column4, row1)
    pdf.text('St.-Nr.: 075/159/02834', column4, row2)
    pdf.text('Ust-IdNr.: DE325359605', column4, row3)
    pdf.text('Betriebs-Nr.: 87944583', column4, row4)
    pdf.setFont(TEXT_FONT_NAME, 'normal');
}

const addCustomerInfo = (pdf, deliveryNote) => {
    const anschriftY = 67;

    pdf.setFontSize(12);
    pdf.text(deliveryNote.customer?.name || '', MARGIN_X, anschriftY);
    pdf.text(deliveryNote.customer?.street || '', MARGIN_X, anschriftY + 5);
    pdf.text(deliveryNote.customer?.city || '', MARGIN_X, anschriftY + 10);

    pdf.setFont(pdf.getFont().fontName, 'bold');
    pdf.text('Lieferschein:   ' + (deliveryNote.logistics === DELIVERY_NOTE_LOGISTICS.INBOUND ? 'Materialrücklieferung' : 'Materialausgabe'), MARGIN_X, anschriftY + 25);
    pdf.line(MARGIN_X, anschriftY + 27, 100, anschriftY + 27);
    pdf.setFont(pdf.getFont().fontName, 'normal');
    pdf.text(`Datum: ${formatDate(new Date(deliveryNote.dateOfIssue))}`, 195, anschriftY + 25, null, null, 'right');

    // pdf.text(`Ausgabedatum: ${formatDate(new Date(deliveryNote.dateOfIssue))}`, 195, anschriftY + 31, null, null, 'right');

    pdf.setFontSize(10);
    const isOutbound = deliveryNote.logistics === DELIVERY_NOTE_LOGISTICS.OUTBOUND;
    const namesOffsetX = pdf.getTextWidth("Empfänger") + 3;
    pdf.text('Empfänger:', MARGIN_X, anschriftY + 34);
    pdf.text(isOutbound ? deliveryNote.personInCharge : deliveryNote.warehouseWorker?.name, MARGIN_X + namesOffsetX, anschriftY + 34)
    // pdf.text(`${isOutbound ? 'Empfänger' : 'Lieferant'}: ` + deliveryNote.personInCharge, MARGIN_X, anschriftY + 34);
    // pdf.text(deliveryNote.personInCharge, MARGIN_X + namesOffsetX, anschriftY + 34);
    pdf.text('Lieferant:', MARGIN_X, anschriftY + 40);
    pdf.text(isOutbound ? deliveryNote.warehouseWorker?.name : deliveryNote.personInCharge, MARGIN_X + namesOffsetX, anschriftY + 40)
    // pdf.text(`${isOutbound? 'Lieferant' : 'Empfänger'}: ` + deliveryNote.warehouseWorker?.name, MARGIN_X, anschriftY + 40);
    // pdf.text(deliveryNote.warehouseWorker?.name, MARGIN_X + namesOffsetX, anschriftY + 40);


    const baseOffsetX = 102;
    const constructionProjectOffsetX = pdf.getTextWidth("Bauvorhaben") + 3;
    pdf.text('Bauvorhaben:', baseOffsetX, anschriftY + (isOutbound ? 40 : 34));
    pdf.text(deliveryNote.constructionProject, baseOffsetX + constructionProjectOffsetX, anschriftY + (isOutbound ? 40 : 34))

    // const licensePlateOffsetX = pdf.getTextWidth("Kennzeichen") + 3;
    pdf.text('Kennzeichen:', baseOffsetX, anschriftY + (isOutbound ? 34 : 40));
    pdf.text(deliveryNote.licensePlate, baseOffsetX + constructionProjectOffsetX, anschriftY + (isOutbound ? 34 : 40))

}

const addSignature = async (pdf, deliveryNote) => {
    const maxWidth = 55;
    const maxHeight = 30;
    const isOutbound = deliveryNote.logistics === DELIVERY_NOTE_LOGISTICS.OUTBOUND;

    pdf.setFontSize(10);
    try {
        const signatureCustomerAsImage = await loadImage(isOutbound ? deliveryNote.signatures?.customer : deliveryNote.signatures?.warehouseWorker);
        const minRatioCustomer = Math.min(maxWidth / signatureCustomerAsImage.width, maxHeight / signatureCustomerAsImage.height)
        pdf.addImage(signatureCustomerAsImage, 'JPEG', 25, 210, signatureCustomerAsImage.width * minRatioCustomer, signatureCustomerAsImage.height * minRatioCustomer)
    } catch (e) { }

    // const signatureTextPersonInCharge = `${`${isOutbound? 'Empfänger' : 'Lieferant'}`}: ${deliveryNote.personInCharge}`
    const signatureTextPersonInCharge = `Empfänger: ${isOutbound ? deliveryNote.personInCharge : deliveryNote.warehouseWorker?.name}`

    const personInChargeTextWidth = pdf.getTextWidth(signatureTextPersonInCharge);
    const personInChargeTextXStart = ((85 - 20) - personInChargeTextWidth) / 2;
    pdf.line(20, 240, 85, 240);
    pdf.text(signatureTextPersonInCharge, 20 + personInChargeTextXStart, 245);


    try {
        const signatureWarehouseWorkerAsImage = await loadImage(isOutbound ? deliveryNote.signatures?.warehouseWorker : deliveryNote.signatures?.customer);
        const minRatioWarehouseWorker = Math.min(maxWidth / signatureWarehouseWorkerAsImage.width, maxHeight / signatureWarehouseWorkerAsImage.height)
        pdf.addImage(signatureWarehouseWorkerAsImage, 'JPEG', 125, 210, signatureWarehouseWorkerAsImage.width * minRatioWarehouseWorker, signatureWarehouseWorkerAsImage.height * minRatioWarehouseWorker)
    } catch (e) { }

    // const signatureTextWarehouseWorker = `${`${isOutbound ? 'Lieferant' : 'Empfänger'}`}: ${deliveryNote.warehouseWorker?.name} `
    const signatureTextWarehouseWorker = `Lieferant: ${isOutbound ? deliveryNote.warehouseWorker?.name : deliveryNote.personInCharge}`
    const warehouseWorkerTextWith = pdf.getTextWidth(signatureTextWarehouseWorker);
    const warehouseWorkerTextXStart = ((185 - 120) - warehouseWorkerTextWith) / 2;
    pdf.line(120, 240, 185, 240);
    pdf.text(signatureTextWarehouseWorker, 120 + warehouseWorkerTextXStart, 245);

    pdf.setFontSize(8);
    pdf.text('Mit der Unterschrift bestätigt der Empfänger den Erhalt, Vollständigkeit und ordnungsgemäßen Zustand der oben aufgelisteten Ware.', 20, 254);
}

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