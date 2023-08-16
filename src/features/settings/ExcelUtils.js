import { DELIVERY_NOTE_LOGISTICS } from '../../config/deliveryNote';
import { removeWhitespace } from '../../utils/StringUtils';

const ExcelJS = require('exceljs');

// #######################
// ###### Constants ######
// #######################

const CELL_COMPANY = 'B3';
const CELL_CONSTRUCTION_PROJECT = 'B6';
// const CELL_LOGISTICS_OUTBOUND = 'C8';
const CELL_LOGISTICS_INBOUND = 'C9';
const CELL_DATE = 'H6';
const CELL_LICENSE_PLATE = 'H7'
const CELL_RENTAL = 'H8';
const CELL_SALE = 'H9';

const COL_ARTICLE_NR = 1;
const COL_NAME = 2;
const COL_LENGTH = 3;
const COL_COLOR = 3;  // ! TODO Update when new column available
const COL_WEIGHT = 4;
const COL_PRICE = 6;
const COL_AMOUNT = 7;

const ROW_FIRST_ENTRY = 15;

const SHEET_OVERVIEW = 'Übersicht' // TODO deprecated, remove
const SHEET_PRINTVIEW = 'Druckansicht'
const WORKSHEET_PREFIX = 'LS-';
const ignoredValues = [null, 'null', 'artikel-nr.', 'ausgabe']

let index = 1;

// ############################
// ###### Read all Parts ######
// ############################

export const getAllParts = async (fileObj) => {
    const workbook = await readWorkbookFromFileObj(fileObj);
    // Reset (Order)Index to 1
    return readAllPartsFromAllSheets(workbook);
}

const readAllPartsFromAllSheets = (workbook) => {
    const parts = [];
    index = 1;

    const sheetNames = workbook.worksheets?.map(worksheet => worksheet.name).filter(worksheetName => worksheetName.startsWith(WORKSHEET_PREFIX)) || [];
    sheetNames.forEach(sheetName => {
        const sheetNameWithoutPrefix = sheetName.replace(WORKSHEET_PREFIX, '')?.toLowerCase();

        ignoredValues.push(sheetName);
        ignoredValues.push(sheetNameWithoutPrefix);
    });

    console.log("Found Worksheets: ", sheetNames);
    console.log("Ignoring Values: ", ignoredValues);

    for (const sheetName of sheetNames) {
        const worksheet = workbook.getWorksheet(sheetName);
        ensureIsValidMaterialList(worksheet);

        const sheetParts = getPartsOfSheet(worksheet);
        mergeArraysDistinctValues(sheetParts, parts);
    }
    return parts;
}

const getPartsOfSheet = (worksheet) => {
    const parts = [];

    worksheet.eachRow((row, rowNumber) => {
        if (isEmptyOrIgnoredRow(row, rowNumber)) return;

        const articleNr = getCellValueOrEmpty(row.getCell(COL_ARTICLE_NR));
        let name = getCellValueOrEmpty(row.getCell(COL_NAME));

        const length = getCellValueOrUndefined(row.getCell(COL_LENGTH));
        const color = getCellValueOrUndefined(row.getCell(COL_COLOR));
        const weight = getCellValueOrUndefined(row.getCell(COL_WEIGHT));
        const price = getCellValueOrUndefined(row.getCell(COL_PRICE));

        const origin = worksheet.name;
        const orderIndex = index++;
        addPartToArrayRemove(parts, { articleNr, name, length, color, weight, price, origin, orderIndex });
    })

    return parts;
}

// ###################################
// ###### Read all loaded Parts ######
// ###################################

export const createFlatChecklistFromFile = async (fileObj) => {
    const workbook = await readWorkbookFromFileObj(fileObj);

    const checklist = { parts: [] };
    readChecklistInformationHeader(checklist, workbook);
    readChecklistParts(checklist, workbook);

    return checklist;
}

const readChecklistInformationHeader = (checklist, workbook) => {
    const frontPage = workbook.getWorksheet(SHEET_PRINTVIEW) || workbook.getWorksheet(SHEET_OVERVIEW);
    ensureIsValidMaterialList(frontPage);

    checklist.customer = getCellValueOrEmpty(frontPage.getCell(CELL_COMPANY));
    checklist.constructionProject = getCellValueOrEmpty(frontPage.getCell(CELL_CONSTRUCTION_PROJECT));
    checklist.dateOfCreation = getCellValueOrEmpty(frontPage.getCell(CELL_DATE));
    checklist.licensePlate = getCellValueOrEmpty(frontPage.getCell(CELL_LICENSE_PLATE));

    const isInbound = getCellValueOrEmpty(frontPage.getCell(CELL_LOGISTICS_INBOUND)).toLowerCase() === 'x';
    checklist.logistics = isInbound ? DELIVERY_NOTE_LOGISTICS.INBOUND : DELIVERY_NOTE_LOGISTICS.OUTBOUND;

    const isSale = getCellValueOrEmpty(frontPage.getCell(CELL_SALE)).toLowerCase() === 'x' ? 'Sale' : null;
    const isRental = getCellValueOrEmpty(frontPage.getCell(CELL_RENTAL)).toLowerCase() === 'x' ? 'Rental' : null;

    checklist.type = isSale || isRental;
}

const readChecklistParts = (checklist, workbook) => {
    // for (const sheetName of sheetNames) {
    const worksheet = workbook.getWorksheet(SHEET_PRINTVIEW) || workbook.getWorksheet(SHEET_OVERVIEW);
    ensureIsValidMaterialList(worksheet);

    const sheetParts = getPartsToLoadFromSheet(worksheet);
    mergeDuplicateParts(sheetParts, checklist.parts);
    // }
}

const getPartsToLoadFromSheet = (worksheet) => {
    const parts = [];

    worksheet.eachRow((row, rowNumber) => {
        // do not investigate row if before first entry or article number is empty
        if (isEmptyOrIgnoredRow(row, rowNumber)) {
            return;
        }

        const amount = +getCellValueOrEmpty(row.getCell(COL_AMOUNT));
        // Falls keine Anzahl angegeben ist, füge dieses Element
        // nicht als Bauteil zur Liste hinzu
        if (!amount) { return };
        const articleNr = getCellValueOrEmpty(row.getCell(COL_ARTICLE_NR));
        const name = getCellValueOrEmpty(row.getCell(COL_NAME));

        addPartToArrayMerge(parts, { part: { articleNr, name }, amount })
    })

    return parts;
}

// ###########################
// ###### READ WORKBOOK ######
// ###########################

function readFileIntoBuffer(fileRes) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsArrayBuffer(fileRes)
        reader.onload = () => {
            resolve(reader.result)
        }
    })
}

const readWorkbookFromFileObj = async (fileObj) => {
    const buffer = await readFileIntoBuffer(fileObj)
    return await readWorkbookFromBuffer(buffer);
}

export const readWorkbookFromBuffer = async (buffer) => {
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(buffer)
    return workbook;
}

const ensureIsValidMaterialList = (worksheet) => {
    if (!worksheet) {
        throw Error('Keine gültige Materialliste.');
    }
}

// ###########################
// ######  Cell Values  ######
// ###########################

const getCellValueOr = (cell, defaultValue) => {
    return cell.text || defaultValue;
}

const getCellValueOrEmpty = (cell) => {
    return getCellValueOr(cell, '');
}

const getCellValueOrUndefined = (cell) => {
    return getCellValueOr(cell, undefined);
}

const isEmptyOrIgnoredRow = (row, rowNumber) => {
    // Das erste Bauelement befindet sich in Reihe 15. Alle Reihen davor sind nicht relevant
    return rowNumber < ROW_FIRST_ENTRY
        // Falls es keine Artikelnummer gibt, soll diese Reihe nicht untersucht werden
        || ignoredValues.includes(JSON.stringify(row.getCell(1).value).toLowerCase())
        // In der letzten Reihe einer Tabelle steht 'Anzahl' in der zweiten Spalte.
        // Diese Reihe beinhaltet eine Anzahl, würde demnach also hinzugefügt werden
        // Da dies aber kein Bauelement ist, soll diese Zeile ignoriert werden.
        || getCellValueOrEmpty(row.getCell(COL_NAME)) === 'Anzahl';
}

// ###########################
// ######  Merge Array  ######
// ###########################

const indexOfPartInArray = (arrayToSearchIn, partArticleNr, getPartArticleNr) => {
    const partToAddArticleNr = removeWhitespace(partArticleNr).toLowerCase();
    const isPartContained = (partItem) => removeWhitespace(getPartArticleNr(partItem)).toLowerCase() === partToAddArticleNr;
    return arrayToSearchIn.findIndex(isPartContained);
}

const addPartToArrayRemove = (partArray, partToAdd) => {
    const searchedArticleNr = partToAdd.articleNr;
    const getArticleNrOfItemInArray = part => part.articleNr;
    const indexOfPart = indexOfPartInArray(partArray, searchedArticleNr, getArticleNrOfItemInArray);

    if (indexOfPart === -1) {
        partArray.push(partToAdd);
    }
}

const addPartToArrayMerge = (partArray, partToAdd) => {
    const searchedArticleNr = partToAdd.part.articleNr;
    const getArticleNrOfItemInArray = partItem => partItem.part.articleNr;
    const indexOfPart = indexOfPartInArray(partArray, searchedArticleNr, getArticleNrOfItemInArray);

    if (indexOfPart === -1) {
        partArray.push(partToAdd);
    } else {
        partArray[indexOfPart].amount += partToAdd.amount;
    }
}

const mergeArraysDistinctValues = (arrayToPush, destinationArray) => {
    for (const part of arrayToPush) {
        addPartToArrayRemove(destinationArray, part);
    }
}

const mergeDuplicateParts = (arrayToPush, destinationArray) => {
    for (const partItem of arrayToPush) {
        addPartToArrayMerge(destinationArray, partItem);
    }
}