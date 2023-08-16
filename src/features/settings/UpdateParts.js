import { Alert, Button, Card, CardActions, CardContent, CircularProgress, Grid, LinearProgress, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { createPart, updateExcelTemplate, updatePart } from "../../app/api/partsApi";
import DefaultContainer from "../../components/layout/DefaultContainer";

import { AttachFile, CheckCircleOutline, CloudSync, Update } from "@mui/icons-material";
import colors from '../../resources/colors.json';
import tags from '../../resources/tags.json';
import { parseColors } from "../../utils/ColorUtils";

import { getAllParts } from './ExcelUtils';

const updateStatusColor = {
    'waiting': 'info',
    'updating': 'info',
    'success': 'success',
    'failed': 'error'
}

const populatePartsWithFileContent = (parts) => {

    removeAllColors(parts);
    updateColors(colors, parts);

    removeAllTags(parts);
    updateTags(tags, parts);
}


const removeAllColors = async (parts) => {
    for (let part of parts) {
        part.color = undefined;
        const colors = parseColors(part.length);
        if (colors && colors.length > 0) {
            console.log("Removing length of: " + part.articleNr + ": " + part.length);
            part.length = undefined;
        }
    }
}

const updateColors = async (colors, parts) => {
    for (let articleNr in colors) {
        const color = colors[articleNr];
        const foundPart = parts.find(part => part.articleNr.replace(/\s/g, '') === articleNr);
        if (!foundPart) {
            console.log("Error finding " + articleNr);
            continue;
        }
        foundPart.color = color;
        console.log(articleNr + " updated");
    }
}

/* ################
   ##### Tags #####
   ################ */

const removeAllTags = async (parts) => {
    for (let part of parts) {
        part.tags = [];
    }
}

const updateTags = async (tags, parts) => {
    for (let partName in tags) {
        console.log(partName)
        // const tags = partName.tags.join(",");
        console.log(">> " + tags[partName].tags.join(", "))
        for (let rawArticleNr of tags[partName].parts) {
            const articleNr = rawArticleNr.replace(/\s/g, '');
            const foundPart = parts.find(part => part.articleNr.replace(/\s/g, '') === articleNr);
            if (!foundPart) {
                console.log("Error finding " + articleNr);
                continue;
            }
            foundPart.tags = tags[partName].tags;
            console.log(articleNr + " updated");
        }
    }
}


const UpdateParts = () => {

    const inputFile = useRef(null);
    const [updating, setUpdating] = useState(false);
    const [selectedFile, setSelectedFile] = useState(undefined);
    const [result, setResult] = useState('');
    const [failedToUpdate, setFailedToUpdate] = useState([]);
    const [templateUpdateStatus, setTemplateUpdateStatus] = useState({ status: 'waiting' });

    const [partsCount, setPartsCount] = useState(0);
    const [updatedPartsCount, setUpdatedPartsCount] = useState(0);
    const [updatedFailedPartsCount, setUpdatedFailedPartsCount] = useState(0);

    const handleOpenFileDialog = () => inputFile.current.click();

    const handleFileChanged = (event) => {
        const files = event.target.files;
        if (files.length >= 1) {
            setSelectedFile(files[0]);
        }
    }

    const uploadExcelTemplate = async () => {
        console.log("UpdateExcelTemplate:", selectedFile);
        try {
            setTemplateUpdateStatus({ status: 'updating' })
            await updateExcelTemplate(selectedFile, () => { });
            setTemplateUpdateStatus({ status: 'success' })
        } catch (error) {
            setTemplateUpdateStatus({ status: 'failed', error })
        }
    }

    const handleUpdateCatalog = async () => {
        setUpdating(true);
        setResult('');
        const failedToUpdate = [];
        let updatedParts = 0;
        let updatedFailedParts = 0;
        try {
            const parts = await getAllParts(selectedFile);
            setResult(parts.length + " Elemente gefunden");
            setPartsCount(parts.length)

            populatePartsWithFileContent(parts);

            console.log(parts)

            for (const part of parts) {
                try {
                    await updatePart(part);
                    updatedParts += 1;
                    setResult(part.name + " aktualisiert");
                } catch (error) {
                    console.log(error.message);
                    // Check if the article was not found and should be created
                    if (error.response?.status === 400) {
                        try {
                            await createPart(part);
                            updatedParts += 1;
                            setResult(part.name + " erstellt");
                        } catch (err) {
                            setResult(err.message);
                            failedToUpdate.push(part.name + " : " + err.message);
                            updatedFailedParts += 1;
                        }
                    } else {
                        setResult(error.message);
                        failedToUpdate.push(part.name + " : " + error.message);
                        updatedFailedParts += 1;
                    }
                }
                setUpdatedPartsCount(updatedParts);
                setUpdatedFailedPartsCount(updatedFailedParts);
            }
            setResult('Aktualisierung abgeschlossen');
            setFailedToUpdate(failedToUpdate);
        } catch (err) {
            console.log(err.message);
            setResult(err.message);
        } finally {
            setUpdating(false);
        }
    }

    return (
        <DefaultContainer>
            <input
                type="file"
                accept=".xls,.xlsx,.xlsm"
                ref={inputFile}
                onChange={handleFileChanged}
                style={{ display: 'none' }}
            />

            <Grid
                container
                spacing={2}
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
            >
                <Grid item xs={12} sm={12} md={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" component="div">
                                Materialliste auswählen
                            </Typography>
                            <Typography variant="body2" component="div">
                                Bitte wähle hier die neue Materialliste (Excel-Datei) aus, mit der die in der App hinterlegten Daten aktualisiert werden sollen.
                            </Typography>
                            <br />
                            <Typography variant="body1" component="div">
                                Ausgewählte Datei: {selectedFile ? selectedFile.name : '-'}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button
                                onClick={handleOpenFileDialog}
                                startIcon={<AttachFile />}
                            >
                                Materialliste auswählen...
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" component="div">
                                Teilekatalog aktualisieren
                            </Typography>
                            <Typography variant="body2" component="div">
                                Aktualisiere mit der ausgewählten Materialliste den in der App hinterlegten Teilekatalog.
                                Dies ist notwendig, sollten neue Bauteile hinzugefügt oder bestehende Bezeichnungen geändert worden sein.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            {
                                selectedFile
                                    ? (
                                        <Button
                                            variant='outlined'
                                            color={!!result ? updatedFailedPartsCount > 0 ? 'error' : updatedPartsCount === partsCount ? 'success' : 'info' : 'info'}
                                            onClick={() => handleUpdateCatalog()}
                                            disabled={updating}
                                            startIcon={updating ? <CircularProgress size={20} variant={!!result ? 'determinate' : 'indeterminate'} value={((updatedPartsCount + updatedFailedPartsCount) / partsCount) * 100} /> : <Update />}
                                        >
                                            Teilekatalog aktualisieren
                                        </Button>
                                    )
                                    : <Alert severity="info">Um diese Funktion nutzen zu können, wähle bitte zuerst die Materialliste aus.</Alert>
                            }
                        </CardActions>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" component="div">
                                Dateivorlage aktualisieren
                            </Typography>
                            <Typography variant="body2" component="div">
                                Aktualisiere mit der ausgewählten Materialliste die in der App hinterlegte Dateivorlage.
                                Diese Dateivorlage wird genutzt, um eine Ladeliste oder ein Lieferschein zurück in ein Excel-Dokument zu schreiben.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            {
                                selectedFile
                                    ? (
                                        <Button
                                            variant='outlined'
                                            color={updateStatusColor[templateUpdateStatus.status]}
                                            onClick={() => uploadExcelTemplate()}
                                            disabled={updating || templateUpdateStatus.status === 'updating'}
                                            startIcon={templateUpdateStatus.status === 'updating'
                                                ? <CircularProgress size={20} />
                                                : templateUpdateStatus.status === 'success'
                                                    ? <CheckCircleOutline />
                                                    : <CloudSync />}
                                        >
                                            Excel-Vorlage ersetzen
                                        </Button>
                                    )
                                    : <Alert severity="info">Um diese Funktion nutzen zu können, wähle bitte zuerst die Materialliste aus.</Alert>
                            }
                        </CardActions>
                    </Card>
                </Grid>
                {
                    !!result
                        ? (

                            <Grid item xs={12} sm={12} md={12}>
                                <Card>
                                    <CardContent>
                                        <LinearProgress
                                            variant="buffer"
                                            color={updatedFailedPartsCount > 0 ? 'error' : updatedPartsCount === partsCount ? 'success' : 'info'}
                                            value={(updatedPartsCount / partsCount) * 100}
                                            valueBuffer={(updatedFailedPartsCount / partsCount) * 100}
                                        />

                                        <br />
                                        {result}

                                        {
                                            failedToUpdate?.length > 0
                                                ?
                                                <ul>
                                                    {failedToUpdate.map(line => <li>{line}</li>)}
                                                </ul>
                                                : null
                                        }

                                    </CardContent>
                                </Card>
                            </Grid>
                        )
                        : null
                }
            </Grid>
        </DefaultContainer>
    )
}

export default UpdateParts