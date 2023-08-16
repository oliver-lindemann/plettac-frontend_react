import { useState, useRef } from 'react';

import { Fab } from '@mui/material';
import { Spinner } from 'react-bootstrap';
import { TbFileImport } from 'react-icons/tb';
import Swal from 'sweetalert2';
import { trimToUpperCase } from '../../utils/StringUtils';
import { sortChecklistPartsByOrderIndex } from '../../utils/checklist/ChecklistPartsUtils';
import { createFlatChecklistFromFile } from '../settings/ExcelUtils'

const populateFlatParts = (flatParts, parts) => {
    const mappingFailed = [];
    const populatedParts = flatParts.map((partItem, index) => {
        const searchedArticleNr = trimToUpperCase(partItem.part?.articleNr);
        const foundPart = parts.find(part => trimToUpperCase(part.articleNr) === searchedArticleNr);

        if (!foundPart) {
            mappingFailed.push({ ...partItem, origin: 'CUSTOM' });
            partItem.orderIndex = 0;
            return null;
        }

        return { ...partItem, part: foundPart }
    }).filter(part => part !== null);

    if (mappingFailed.length > 0) {
        Swal.fire({
            title: 'Einige Elemente konnten nicht zugeordnet werden:',
            text: JSON.stringify(mappingFailed),
            icon: 'error'
        })
    }

    return { populatedParts, customParts: mappingFailed };
}

const ImportChecklistFromFile = ({ user, parts, updateChecklist }) => {


    // Refs/States for importing excel documents
    const inputFile = useRef(null);
    const [isReadingFile, setIsReadingFile] = useState(false);

    const handleOpenFileDialog = () => inputFile.current.click();
    const handleFileChanged = async (event) => {
        setIsReadingFile(true);
        try {
            const files = event.target.files;
            if (files.length >= 1) {
                const flatChecklist = await createFlatChecklistFromFile(files[0]);
                const { populatedParts, customParts } = populateFlatParts(flatChecklist.parts, parts)

                const updatedChecklist = {
                    customer: flatChecklist.customer,
                    constructionProject: flatChecklist.constructionProject,
                    licensePlate: flatChecklist.licensePlate,
                    logistics: flatChecklist.logistics,
                    type: flatChecklist.type,
                    parts: sortChecklistPartsByOrderIndex(populatedParts),
                    customParts
                }

                updateChecklist(updatedChecklist);
            }
        } catch (err) {
            console.log(err);
            Swal.fire({
                title: 'Fehler beim Lesen der Datei',
                text: err.toString(),
                icon: 'error'
            })
        } finally {
            setIsReadingFile(false);
        }
    }

    if (!user?.isAdmin) {
        return null;
    }

    return (
        <>
            <input
                type="file"
                accept=".xls,.xlsx,.xlsm"
                ref={inputFile}
                onChange={handleFileChanged}
                style={{ display: 'none' }}
            />

            <Fab
                color="primary"
                onClick={handleOpenFileDialog}
                disabled={isReadingFile}
                sx={{
                    position: 'fixed',
                    bottom: (theme) => theme.spacing(19),
                    right: (theme) => theme.spacing(4)
                }}
            >
                {isReadingFile ? <Spinner /> : <TbFileImport />}
            </Fab>
        </>
    )
}

export default ImportChecklistFromFile