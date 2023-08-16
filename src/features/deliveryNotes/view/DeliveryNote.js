import { useEffect, useState } from 'react';
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';
import { useNavigate, useParams } from 'react-router-dom';

import {
    downloadExcelFile,
    getHistory,
    updateDeliveryNote
} from '../../../app/api/deliveryNotesApi';
import useAuth from '../../../hooks/auth/useAuth';
import useDeliveryNote from '../../../hooks/deliveryNotes/useDeliveryNote';

import { Backdrop, Button, CircularProgress, Fab, Grid, Stack, Tab, Tabs } from '@mui/material';
import { Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';

import DeliveryNoteInformation from './DeliveryNoteInformation';

import DefaultContainer from '../../../components/layout/DefaultContainer';
import FloatingButton from '../../../components/layout/FloatingButton';
import CenteredPulseLoader from '../../../components/loading/CenteredPulseLoader';

import { ArchiveOutlined, Download, DrawOutlined, PrintOutlined } from '@mui/icons-material';
import { BsPencilFill } from 'react-icons/bs';
import { ROLES } from '../../../config/roles';
import useSignatureDialog from '../../../hooks/dialogs/useSignatureDialog';
import { autoPrint, generatePDF } from '../pdf/GeneratePdfGmw';

import FileSaver from 'file-saver';
import { Document, Page, pdfjs } from 'react-pdf';
import "swiper/css";
import { Swiper, SwiperSlide } from 'swiper/react';
import { TAB_HEIGHT } from '../../../components/layout/TabLayout';
import { ReactComponent as ForkliftIcon } from '../../../images/forklift.svg';
import { formatDate } from '../../../utils/StringUtils';
import { TOP_NAV_HEIGHT } from '../../navigation/TopNav';

// Lazy Load - only Admin Feature
// const DeliveryNoteHistory = lazy(() => import('../history/DeliveryNoteHistory')); // Lazy
import { useSnackbar } from 'notistack';
import { GMW, PLETTAC } from '../../../config/deliveryNote';
import { LIST_STATUS } from '../../../config/list';
import ListPartsTableView from '../../lists/ListPartsTableView';
import DeliveryNoteHistory from '../../lists/history/ListHistory'; // lazy won't work with slider -> rerenders complete 
import LoadList from '../../lists/load/LoadList';
import { generatePlettacPDF } from '../pdf/GeneratePdfPlettac';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const DeliveryNote = () => {

    const { id } = useParams();
    const { user } = useAuth();
    const {
        deliveryNote,
        mutate
    } = useDeliveryNote(id);
    const { enqueueSnackbar } = useSnackbar();

    const navigate = useNavigate();

    const [openSignatureDialog, SignatureDialog] = useSignatureDialog();

    const [swiper, setSwiper] = useState(null);
    const [tabIndex, setTabIndex] = useState(0);

    const [isWaitingForDownload, setIsWaitingForDownload] = useState(false);
    const [isWaitingForPdf, setIsWaitingForPdf] = useState(false);

    const [pdfFile, setPdfFile] = useState(null);
    const [pdfPages, setPdfPages] = useState([]);

    const actionButtons = [];

    console.log("Swiper: ", swiper?.activeIndex)

    let canEdit = false;
    let canLoad = false;

    const checkIfAllFieldsSet = () => {
        if (deliveryNote?.issuingCompany === GMW) {
            return true;
        }

        const allRequiredFieldsSet = deliveryNote.uniqueNumber > 0
            && deliveryNote.customer !== null
            && deliveryNote.customer.name?.trim().length > 0
            && deliveryNote.customer.street?.trim().length > 0
            && deliveryNote.customer.city?.trim().length > 0
            && deliveryNote.personInCharge?.trim().length > 0
            && deliveryNote.licensePlate?.trim().length > 0;

        if (!allRequiredFieldsSet) {
            Swal.fire({
                title: 'Fehlende Daten',
                text: 'Es sind nicht alle benötigten Daten eingtragen, um eine PDF zu generieren bzw. den Lieferschein zu drucken. Bitte überprüfe: Kundenname, Kundenadresse, Verantwortliche Person und das Nummernschild.',
                icon: 'warning'
            });
        }
        return allRequiredFieldsSet;
    }

    const generatePdfFile = async (deliveryNote) => {
        return await (deliveryNote.issuingCompany === PLETTAC
            ? generatePlettacPDF(deliveryNote)
            : generatePDF(deliveryNote));
    }

    const generateAndSetPdfFile = (deliveryNote) => {
        setIsWaitingForPdf(true);

        if (!checkIfAllFieldsSet()) {
            setIsWaitingForPdf(false);
            return;
        }

        setTimeout(async () => {
            try {
                console.log("Generating...");
                const pdf = await generatePdfFile(deliveryNote);
                console.log("Setting...")
                setPdfFile(pdf);
            } finally {
                setIsWaitingForPdf(false);
            }
        }, 200);
    }

    useEffect(() => { window.scrollTo({ top: 0 }) }, [tabIndex]);

    if (!deliveryNote) {
        return <CenteredPulseLoader />
    }

    if (deliveryNote) {
        canEdit = (user.isAdmin
            || (deliveryNote.author?._id === user.id)
            || (deliveryNote.sharedWithUsers?.edit?.includes(user.id)));
        canLoad = (user.isAdmin || (user.roles.includes(ROLES.Lager)));
    }

    const handleTabIndexChanged = (value) => {
        if (!pdfFile &&
            ((isBrowser && value === 1)
                || (isMobile && value === 2))) {
            generateAndSetPdfFile(deliveryNote);
        }

        setTabIndex(value);
        swiper?.slideTo(value);
    };

    const updateSignatures = async (updatedSignatures) => {
        const updatedDeliveryNote = {
            ...deliveryNote,
            signatures: updatedSignatures
        };

        try {
            const result = await updateDeliveryNote(updatedDeliveryNote);
            mutate();
            generateAndSetPdfFile(updatedDeliveryNote);
        } finally {

        }
    }

    const openSignatureCustomer = () => {
        openSignatureDialog({
            title: "Unterschrift Kunde",
            onConfirm: (signature) => updateSignatures({
                ...deliveryNote?.signatures,
                customer: signature
            })
        })

    }

    const openSignatureWarehouseWorker = () => {
        openSignatureDialog({
            title: "Unterschrift Lagermitarbeiter",
            onConfirm: (signature) => updateSignatures({
                ...deliveryNote?.signatures,
                warehouseWorker: signature
            })
        })
    }

    const handlePdfLoaded = async (pdf) => {
        const allPageNumbers = []; // array of numbers
        for (let p = 0; p < pdf.numPages; p++) {
            allPageNumbers.push(p);
        }
        setPdfPages(allPageNumbers);
    }

    const onBeginLoading = async () => {

        switch (deliveryNote.status) {
            case LIST_STATUS.OPEN:
            case LIST_STATUS.IN_PROGRESS:
            case LIST_STATUS.DONE:
                // navigate(`/deliveryNotes/load/${deliveryNote._id}`);
                handleTabIndexChanged(1);
                break;
            default:
                Swal.fire({
                    title: "Lieferschein ist gesperrt",
                    text: "Der Lieferschein ist gesperrt und kann nicht mehr bearbeitet werden. Bitte entsperre den Lieferschein zuerst",
                    icon: 'info'
                });
                break;
        }
    }

    const onEditDeliveryNote = async () => {
        switch (deliveryNote.status) {
            case LIST_STATUS.OPEN:
                navigate(`/deliveryNotes/edit/${deliveryNote._id}?tabIndex=${tabIndex}`);
                break;
            case LIST_STATUS.IN_PROGRESS:
            case LIST_STATUS.DONE:
                const result = await Swal.fire({
                    title: `Lieferschein ${deliveryNote.status === LIST_STATUS.IN_PROGRESS ? 'wird momentan verladen' : 'wurde bereits verladen'}`,
                    text: `Der Lieferschein ${deliveryNote.status === LIST_STATUS.IN_PROGRESS ? 'wird momentan verladen' : 'wurde bereits verladen'}. Möglicherweise können deine Änderungen nicht mehr berücksichtigt werden. Möchtest du die Liste dennoch bearbeiten?`,
                    icon: 'warning',
                    showConfirmButton: true,
                    confirmButtonText: 'Ja',
                    showDenyButton: true,
                    denyButtonText: 'Nein',
                    showCancelButton: false
                });
                if (result.isConfirmed) {
                    navigate(`/deliveryNotes/edit/${deliveryNote._id}?tabIndex=${tabIndex}`);
                }
                break;
            default:
                Swal.fire({
                    title: "Lieferschein ist gesperrt",
                    text: "Der Lieferschein ist gesperrt und kann nicht bearbeitet werden. Bitte erstelle einen neuen Lieferschein.",
                    icon: 'info'
                });
                break;
        }
    }

    // const handleDeleteDeliveryNote = async () => {
    //     const result = await Swal.fire({
    //         title: 'Lieferschein löschen?',
    //         text: 'Möchtest du den Lieferschein wirklich löschen?',
    //         icon: 'question',
    //         showCancelButton: true,
    //         cancelButtonText: 'Abbrechen',
    //         confirmButtonText: 'Ja'
    //     });

    //     if (result.isConfirmed) {
    //         try {
    //             const result = await deleteDeliveryNote(deliveryNote._id);
    //             mutate();
    //             enqueueSnackbar("Lieferschein gelöscht.", { variant: 'success' });
    //             navigate('/lists')
    //         } catch (err) {
    //             Swal.fire({
    //                 title: "Fehler beim Löschen des Lieferscheins",
    //                 text: err.message,
    //                 icon: 'error'
    //             });
    //         }
    //     }
    // }

    const handleArchiveDeliveryNote = async () => {
        const result = await Swal.fire({
            title: 'Lieferschein archivieren?',
            text: 'Möchtest du den Lieferschein wirklich archivieren?',
            icon: 'question',
            showCancelButton: true,
            cancelButtonText: 'Abbrechen',
            confirmButtonText: 'Ja'
        });

        if (result.isConfirmed) {
            try {
                const updatedDeliveryNote = {
                    ...deliveryNote,
                    status: LIST_STATUS.ARCHIVED
                };
                const result = await updateDeliveryNote(updatedDeliveryNote);
                mutate();
                enqueueSnackbar("Lieferschein archiviert.", { variant: 'success' });
                navigate('/lists')
            } catch (err) {
                Swal.fire({
                    title: "Fehler beim Archivieren des Lieferscheins",
                    text: err.message,
                    icon: 'error'
                });
            }
        }
    }

    const handlePrintPdfFile = () => {
        setIsWaitingForPdf(true);

        if (!checkIfAllFieldsSet()) {
            setIsWaitingForPdf(false);
            return;
        }

        setTimeout(async () => {
            try {
                const pdf = pdfFile || (await generatePdfFile(deliveryNote));
                autoPrint(pdf);
                FileSaver.saveAs(pdf.output('blob'), `Lieferschein ${deliveryNote.customer?.name} - ${formatDate(deliveryNote.dateOfCreation)}.pdf`);
            } finally {
                setIsWaitingForPdf(false)
            }
        }, 250);
    }

    const handleDownloadPdfFile = () => {
        setIsWaitingForPdf(true);

        if (!checkIfAllFieldsSet()) {
            setIsWaitingForPdf(false);
            return;
        }

        setTimeout(async () => {
            try {
                const pdf = pdfFile || (await generatePdfFile(deliveryNote));
                FileSaver.saveAs(pdf.output('blob'), `Lieferschein ${deliveryNote.customer?.name} - ${formatDate(deliveryNote.dateOfCreation)}.pdf`);
            } finally {
                setIsWaitingForPdf(false)
            }
        }, 250);
    }

    const handleDownloadFile = async () => {
        setIsWaitingForDownload(true);
        try {

            const response = await downloadExcelFile(deliveryNote._id);
            // const workbookData = await convertDeliveryNoteToExcelFile(deliveryNote);


            // console.log(workbook);

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            // toISOString contains also time stamp (yyyy-mm-ddThh:mm:ss: 2023-02-10T16:00:000Z)
            const dateTimeAsString = new Date(Date.parse(deliveryNote.dateOfCreation)).toISOString();
            // remove time from date object, result: YYYY-MM-DD
            const dateAsString = dateTimeAsString.substring(0, dateTimeAsString.indexOf('T'));
            const downloadFileName = `Lieferschein ${dateAsString} ${deliveryNote.customer?.name || deliveryNote.constructionProject}.xlsm`;

            link.setAttribute('download', downloadFileName);
            document.body.appendChild(link);
            link.click();


            // const blob = new Blob([workbookData]);
            // FileSaver.saveAs(blob, downloadFileName);

        } finally {
            setIsWaitingForDownload(false);
        }
    }

    actionButtons.push(
        <Button
            color='success'
            variant='contained'
            size={isMobile ? 'large' : 'medium'}
            fullWidth
            onClick={handleDownloadFile}
            disabled={isWaitingForDownload}
            startIcon={isWaitingForDownload ? <Spinner size="sm" /> : <Download />}
        >
            Excel Herunterladen
        </Button>
    )

    actionButtons.push(
        <Button
            color='primary'
            variant='contained'
            size={isMobile ? 'large' : 'medium'}
            fullWidth
            onClick={handleDownloadPdfFile}
            disabled={isWaitingForPdf}
            startIcon={isWaitingForPdf ? <Spinner size="sm" /> : <Download />}
        >
            PDF herunterladen
        </Button>
    )

    if (user?.isLager) {
        actionButtons.push(
            <Button
                color='primary'
                variant='contained'
                size={isMobile ? 'large' : 'medium'}
                fullWidth
                onClick={handlePrintPdfFile}
                disabled={isWaitingForPdf}
                startIcon={isWaitingForPdf ? <Spinner size="sm" /> : <PrintOutlined />}
            >
                Drucken
            </Button>
        )
    }

    if (user?.isAdmin) {
        // actionButtons.push(
        //     <Button
        //         color='error'
        //         variant='outlined'
        //         size={isMobile ? 'large' : 'medium'}
        //         fullWidth
        //         onClick={handleDeleteDeliveryNote}
        //         startIcon={<Delete />}
        //     >
        //         Löschen
        //     </Button>
        // )
        actionButtons.push(
            <Button
                color='inherit'
                variant='outlined'
                size={isMobile ? 'large' : 'medium'}
                fullWidth
                onClick={handleArchiveDeliveryNote}
                startIcon={<ArchiveOutlined />}
            >
                Archivieren
            </Button>
        )
    }

    return (
        <>
            {SignatureDialog}

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isWaitingForPdf}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <DefaultContainer heightSubtract={TAB_HEIGHT}>
                <MobileView style={{ height: '100%' }}>
                    <Tabs
                        value={tabIndex}
                        onChange={(e, newValue) => handleTabIndexChanged(newValue)}
                        style={{ position: 'sticky', zIndex: 100, top: TOP_NAV_HEIGHT, backgroundColor: '#fff' }}
                        variant='scrollable'
                        scrollButtons='auto'
                    >
                        <Tab value={0} label="Informationen" />
                        <Tab value={1} label="Bauteile" />
                        <Tab value={2} label="Vorschau" />
                        {user?.isAdmin ? <Tab value={3} label="Änderungshistorie" /> : null}
                    </Tabs>

                    <Swiper
                        style={{ width: '100%', height: '100%' }}
                        spaceBetween={50}
                        slidesPerView={1}
                        onActiveIndexChange={e => handleTabIndexChanged(e.activeIndex)}
                        onSwiper={setSwiper}
                        initialSlide={tabIndex}
                    >
                        <SwiperSlide style={{ width: '100%', height: '100%' }}>
                            <div className='m-1 mt-3'>

                                <DeliveryNoteInformation deliveryNote={deliveryNote} switchToPreview={() => handleTabIndexChanged(2)} />

                                <Stack gap={2} direction={{ sm: 'column', md: 'row' }} className='mt-3'>
                                    {actionButtons.map((button, index) => <div key={index}>{button}</div>)}
                                </Stack>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide style={{ width: '100%', height: '100%' }}>
                            {
                                !!user?.isLager
                                    ? <div className='m-1'><LoadList list={deliveryNote} updateList={updateDeliveryNote} mutate={mutate} height='100%' /></div>
                                    : (
                                        <div className='m-1 mt-3'>
                                            <ListPartsTableView list={deliveryNote} />
                                        </div>
                                    )
                            }
                        </SwiperSlide>
                        <SwiperSlide style={{ maxWidth: '100%', height: '100%' }}>
                            {
                                tabIndex === 2
                                    ? (
                                        <Document
                                            file={pdfFile?.output('dataurlstring')}
                                            onLoadSuccess={handlePdfLoaded}
                                        >
                                            <div style={{ marginBottom: '50px' }}>
                                                {pdfPages.length > 0
                                                    ? pdfPages.map(pageIndex => (
                                                        <Page
                                                            key={pageIndex}
                                                            pageIndex={pageIndex}
                                                            renderAnnotationLayer={false}
                                                            renderTextLayer={false} />
                                                    ))
                                                    : null
                                                }
                                            </div>
                                        </Document>
                                    ) : null
                            }
                        </SwiperSlide>
                        {
                            !!user?.isAdmin
                                ? (
                                    <SwiperSlide style={{ width: '100%', height: '100%' }}>
                                        {tabIndex === 3 ? <DeliveryNoteHistory
                                            list={deliveryNote}
                                            getHistory={() => getHistory(deliveryNote._id)}
                                        /> : <div />}
                                    </SwiperSlide>
                                ) : null
                        }
                    </Swiper>

                    {
                        tabIndex === 0
                            ? (
                                <>
                                    {!!canEdit && (<FloatingButton onClick={onEditDeliveryNote} icon={< BsPencilFill />} />)}
                                    {/* // Den Aufladen-Button oberhalb des Bearbeiten-Buttons anzeigen, sofern dieser dem Benutzer angezeigt wird */}
                                    {
                                        !!canLoad
                                            ? (
                                                canEdit
                                                    ? (
                                                        < Fab
                                                            color="primary"
                                                            onClick={onBeginLoading}
                                                            sx={{
                                                                position: 'fixed',
                                                                bottom: (theme) => theme.spacing(19),
                                                                right: (theme) => theme.spacing(4)
                                                            }}>
                                                            <ForkliftIcon width='25px' height="25px" />
                                                        </Fab>
                                                    )
                                                    :
                                                    <FloatingButton
                                                        onClick={onBeginLoading}
                                                        icon={<ForkliftIcon width='25px' height="25px" />}
                                                    />
                                            ) : null
                                    }

                                </>
                            )
                            : tabIndex === 2
                                ? (
                                    <>
                                        < Fab
                                            color="success"
                                            variant='extended'
                                            onClick={openSignatureWarehouseWorker}
                                            sx={{
                                                position: 'fixed',
                                                bottom: (theme) => theme.spacing(28),
                                                right: (theme) => theme.spacing(4)
                                            }}>
                                            <DrawOutlined /> Unterschrift Lager
                                        </Fab>
                                        < Fab
                                            color="error"
                                            variant='extended'
                                            onClick={openSignatureCustomer}
                                            sx={{
                                                position: 'fixed',
                                                bottom: (theme) => theme.spacing(19),
                                                right: (theme) => theme.spacing(4)
                                            }}>

                                            <DrawOutlined /> Unterschrift Kunde
                                        </Fab>

                                        <FloatingButton disabled={isWaitingForPdf} onClick={handlePrintPdfFile} icon={isWaitingForPdf ? <Spinner /> : < PrintOutlined />} />
                                    </>
                                )
                                : (<>
                                    {!!canEdit && (<FloatingButton onClick={onEditDeliveryNote} icon={< BsPencilFill />} />)}
                                    {/* < FloatingButton
                            onClick={() => setShowQRModal(true)}
                            icon={<BsUpcScan />}
                        /> */}
                                </>
                                )
                    }

                </MobileView>
                <BrowserView style={{ height: '100%' }}>

                    <Tabs
                        value={tabIndex}
                        onChange={(e, newValue) => handleTabIndexChanged(newValue)}
                        style={{ position: 'sticky', zIndex: 100, top: TOP_NAV_HEIGHT, backgroundColor: '#fff' }}
                    >
                        <Tab value={0} label="Übersicht" />
                        <Tab value={1} label="Vorschau" />
                        {user?.isAdmin ? <Tab value={2} label="Änderungshistorie" /> : null}
                    </Tabs>

                    {
                        tabIndex === 0
                            ? (
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={5} xxl={3}>
                                        <div className='m-1 mt-3'>

                                            <DeliveryNoteInformation deliveryNote={deliveryNote} switchToPreview={() => handleTabIndexChanged(1)} />

                                            <Grid container spacing={2} className='mt-3'>
                                                {actionButtons.map((button, index) => <Grid item key={index} xs={12} sm={12} md={6} lg={4} xl={6} xxl={4}> {button}</Grid>)}
                                            </Grid>
                                        </div>

                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={7} xxl={9}>
                                        {
                                            !!user?.isLager
                                                ? <div className='m-1'><LoadList list={deliveryNote} updateList={updateDeliveryNote} mutate={mutate} /></div>
                                                : (
                                                    <div className='m-1 mt-3'>
                                                        <ListPartsTableView list={deliveryNote} />
                                                    </div>
                                                )
                                        }
                                    </Grid>
                                    {!!canEdit && (<FloatingButton onClick={onEditDeliveryNote} icon={< BsPencilFill />} />)}
                                </Grid>

                            ) : null
                    }

                    {
                        tabIndex === 1
                            ? (
                                <>
                                    <div className='d-flex' style={{ flexDirection: 'column' }}>

                                        {/* <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={asPlettac}
                                                    onChange={(e, checked) => setAsPlettac(checked)}
                                                />
                                            }
                                            label="Als Plettac Lieferschein"
                                        /> */}
                                        <object id="pdf" data={pdfFile?.output('dataurlstring')} type="application/pdf" width={'800px'} style={{ height: 'calc(100vh - 200px)' }}></object>
                                    </div>
                                    {/* <Document
                                        file={pdfFile?.output('dataurlstring')}
                                        onLoadSuccess={handlePdfLoaded}
                                    >
                                        <div style={{ marginBottom: '50px' }}>
                                            {pdfPages.length > 0
                                                ? pdfPages.map(pageIndex => (
                                                    <Page
                                                        key={pageIndex}
                                                        pageIndex={pageIndex}
                                                        renderAnnotationLayer={false}
                                                        renderTextLayer={false} />
                                                ))
                                                : null
                                            }
                                        </div>
                                    </Document> */}

                                    < Fab
                                        color="success"
                                        variant='extended'
                                        onClick={openSignatureWarehouseWorker}
                                        sx={{
                                            position: 'fixed',
                                            bottom: (theme) => theme.spacing(10),
                                            right: (theme) => theme.spacing(15)
                                        }}>
                                        <DrawOutlined /> Unterschrift Lager
                                    </Fab>
                                    < Fab
                                        color="error"
                                        variant='extended'
                                        onClick={openSignatureCustomer}
                                        sx={{
                                            position: 'fixed',
                                            bottom: (theme) => theme.spacing(10),
                                            right: (theme) => theme.spacing(45)
                                        }}>

                                        <DrawOutlined /> Unterschrift Kunde
                                    </Fab>

                                    <FloatingButton onClick={handlePrintPdfFile} icon={< PrintOutlined />} />

                                </>
                            ) : null
                    }

                    {
                        tabIndex === 2
                            ? (
                                <DeliveryNoteHistory
                                    list={deliveryNote}
                                    getHistory={() => getHistory(deliveryNote._id)}
                                />
                            ) : null
                    }
                </BrowserView>
            </DefaultContainer >
        </>
    )
}

export default DeliveryNote