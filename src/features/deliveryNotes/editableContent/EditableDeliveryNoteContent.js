import { useEffect, useMemo, useState } from 'react'
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { Button, Checkbox, CircularProgress, Divider, FormControlLabel, Grid, InputAdornment, ListItemAvatar, ListItemText, MenuItem, Paper, Tab, Tabs, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import Swal from 'sweetalert2'

import AddableListPartsList from '../../lists/AddableListPartsList'

import DefaultContainer from '../../../components/layout/DefaultContainer'
import FloatingButton from '../../../components/layout/FloatingButton'
import { TAB_HEIGHT } from '../../../components/layout/TabLayout'

import useAuth from '../../../hooks/auth/useAuth'
import useCustomers from '../../../hooks/customers/useCustomers'
import useParts from '../../../hooks/parts/useParts'
import useUsers from '../../../hooks/users/useUsers'

import useSignatureDialog from '../../../hooks/dialogs/useSignatureDialog'
import useInput from '../../../hooks/forms/useInput'

import { AccountCircleOutlined, Add, BusinessOutlined, CarpenterOutlined, CheckCircleOutlined, CircleOutlined, DirectionsCarOutlined, ErrorOutlineOutlined, FileDownloadOutlined, FileUploadOutlined, MonetizationOnOutlined, NotesOutlined, Save } from '@mui/icons-material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { deDE } from '@mui/x-date-pickers/locales'

import { IoMdArrowRoundForward } from 'react-icons/io'
import { MdOutlineVisibility, MdOutlineVisibilityOff } from 'react-icons/md'

import { DELIVERY_NOTE_LOGISTICS, DELIVERY_NOTE_TYPE } from '../../../config/deliveryNote'
import { LIST_STATUS, LIST_STATUS_LANG } from '../../../config/list'

import { dayjsUTC, getDayjsWithoutTime } from '../../../utils/DateUtils'
import { copyArray, sortChecklistPartsByOrderIndex } from '../../../utils/checklist/ChecklistPartsUtils'

import CreateCustomerDialog from '../../customers/CreateCustomerDialog'
import ImportChecklistFromFile from '../../lists/ImportChecklistFromFile'
import { TOP_NAV_HEIGHT } from '../../navigation/TopNav'
import SignatureDisplay from './SignatureDisplay'

import "swiper/css"
import ItemSelect from '../../../components/select/ItemSelect'
import UserAvatar from '../../../components/utils/UserAvatar'


const deployIcons = {
    'true': <MdOutlineVisibility color="#487d32" size={25} />,
    'false': <MdOutlineVisibilityOff color="#d32f2f" size={25} />,
}


export const DELIVERY_NOTE_DRAFT = 'deliveryNotesDraft';
const DEFAULT_CUSTOMER = 'Kunde neu:';

const EditableDeliveryNoteContent = ({ deliveryNote, onSaveButtonClicked }) => {

    // Navigate back to deliveryNote overview if deliveryNote was locked during edit
    const navigate = useNavigate();
    if (deliveryNote?.locked) navigate(-1)

    const { user } = useAuth();
    const { users } = useUsers();
    const { parts } = useParts();
    const { customers } = useCustomers();

    // Falls Liste nicht visible (sichtbar) ist und der aktuelle Benutzer
    // kein Admin ist, soll zurück zur Übersichtsseite navigiert werden
    if (deliveryNote?._id && !deliveryNote.deployed && user?.isLager && !user?.isAdmin) navigate(-1);

    const [searchParams] = useSearchParams();
    const [tabIndex, setTabIndex] = useState(+(searchParams?.get('tabIndex') || 0));

    const [isDirty, setIsDirty] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [openSignatureDialog, SignatureDialog] = useSignatureDialog();
    const [showCustomerDialog, setShowCustomerDialog] = useState(false);
    const [createdCustomer, setCreatedCustomer] = useState(null);

    const {
        value: relatedDeliveryNote,
        setValue: setRelatedDeliveryNote,
        isTouched: relatedDeliveryNoteIsTouched,
        setIsTouched: setRelatedDeliveryNoteIsTouched,
        isValid: relatedDeliveryNoteIsValid,
        hasError: relatedDeliveryNoteHasError,
        valueChangeHandler: relatedDeliveryNoteChangeHandler,
        inputBlurHandler: relatedDeliveryNoteBlurHandler,
    } = useInput({
        defaultValue: null,
        initialValue: deliveryNote?.relatedDeliveryNote,
        validateValue: (value) => deliveryNote?.logistics === DELIVERY_NOTE_LOGISTICS.CANCELLATION ? value !== null : true
    });

    const {
        value: uniqueNumber,
        setValue: setUniqueNumber,
        isTouched: uniqueNumberIsTouched,
        setIsTouched: setUniqueNumberIsTouched,
        isValid: uniqueNumberIsValid,
        hasError: uniqueNumberHasError,
        valueChangeHandler: uniqueNumberChangeHandler,
        inputBlurHandler: uniqueNumberBlurHandler,
    } = useInput({
        defaultValue: 0,
        initialValue: deliveryNote?.uniqueNumber,
        // Do only validate unique number if delivery note already created and is PLETTAC
        validateValue: (value) => deliveryNote?._id ? value > 0 : true
    });

    const {
        value: customer,
        setValue: setCustomer,
        setIsTouched: setCustomerIsTouched,
        isValid: customerIsValid,
        hasError: customerHasError,
        valueChangeHandler: customerChangeHandler,
        inputBlurHandler: customerBlurHandler,
        reset: resetCustomer
    } = useInput({
        defaultValue: DEFAULT_CUSTOMER,
        initialValue: deliveryNote?.customer?.name || DEFAULT_CUSTOMER,
        validateValue: (value) => !!value && value !== null
    });

    const {
        value: personInCharge,
        setValue: setPersonInCharge,
        isTouched: personInChargeIsTouched,
        setIsTouched: setPersonInChargeIsTouched,
        isValid: personInChargeIsValid,
        hasError: personInChargeHasError,
        valueChangeHandler: personInChargeChangeHandler,
        inputBlurHandler: personInChargeBlurHandler,
    } = useInput({
        defaultValue: '',
        initialValue: deliveryNote?.personInCharge || '',
        validateValue: (value) => true
    });

    const {
        value: constructionProject,
        setValue: setConstructionProject,
        isTouched: constructionProjectIsTouched,
        setIsTouched: setConstructionProjectIsTouched,
        isValid: constructionProjectIsValid,
        hasError: constructionProjectHasError,
        valueChangeHandler: constructionProjectChangeHandler,
        inputBlurHandler: constructionProjectBlurHandler,
    } = useInput({
        defaultValue: '',
        initialValue: deliveryNote?.constructionProject || '',
        validateValue: () => true
    });

    const {
        value: licensePlate,
        setValue: setLicensePlate,
        isTouched: licensePlateIsTouched,
        setIsTouched: setLicensePlateIsTouched,
        isValid: licensePlateIsValid,
        hasError: licensePlateHasError,
        valueChangeHandler: licensePlateChangeHandler,
        inputBlurHandler: licensePlateBlurHandler,
    } = useInput({
        defaultValue: '',
        initialValue: deliveryNote?.licensePlate || '',
        validateValue: () => true
    });

    const {
        value: warehouseWorker,
        setValue: setWarehouseWorker,
        isTouched: warehouseWorkerIsTouched,
        setIsTouched: setWarehouseWorkerIsTouched,
        isValid: warehouseWorkerIsValid,
        hasError: warehouseWorkerHasError,
        valueChangeHandler: warehouseWorkerChangeHandler,
        inputBlurHandler: warehouseWorkerBlurHandler,
    } = useInput({
        defaultValue: '',
        initialValue: deliveryNote?.warehouseWorker?._id || deliveryNote?.warehouseWorker || user?.id,
        validateValue: (value) => value !== ''
    });

    const {
        value: note,
        setValue: setNote,
        isTouched: noteIsTouched,
        setIsTouched: setNoteIsTouched,
        isValid: noteIsValid,
        hasError: noteHasError,
        valueChangeHandler: noteChangeHandler,
        inputBlurHandler: noteBlurHandler,
    } = useInput({
        defaultValue: '',
        initialValue: deliveryNote?.note || '',
        validateValue: () => true
    });

    const {
        value: status,
        setValue: setStatus,
        isTouched: statusIsTouched,
        isValid: statusIsValid,
        hasError: statusHasError,
        valueChangeHandler: statusChangeHandler,
        inputBlurHandler: statusBlurHandler,
    } = useInput({
        defaultValue: '',
        initialValue: deliveryNote?.status || LIST_STATUS.OPEN,
        validateValue: (value) => value !== ''
    });

    const [logistics, setLogistics] = useState(deliveryNote?.logistics || DELIVERY_NOTE_LOGISTICS.OUTBOUND);
    const [dateOfIssue, setDateOfIssue] = useState(deliveryNote?.dateOfIssue ? dayjsUTC(deliveryNote.dateOfIssue) : dayjsUTC());
    const [signatures, setSignatures] = useState(deliveryNote?.signatures)

    // Default-Wert für visible ist 'true'. Falls eine DeliveryNote vorhanden ist (deliveryNote?._id vorhanden),
    // soll der visible-Wert der DeliveryNote verwendet werden.
    // Ist der Benutzer ein Admin, ist der default-Wert 'false'.
    const [visible, setVisible] = useState(deliveryNote?._id ? deliveryNote?.visible : (user?.isAdmin ? false : true));
    const [shouldBeLoaded, setShouldBeLoaded] = useState(user?.isAdmin ? true : false);
    const [deliveryNoteParts, setDeliveryNoteParts] = useState(sortChecklistPartsByOrderIndex(copyArray(deliveryNote?.parts)) || []);
    const [deliveryNoteCustomParts, setDeliveryNoteCustomParts] = useState(deliveryNote?.customParts || []);

    const isFormValid = () => {
        return customerIsValid
            && personInChargeIsValid
            && relatedDeliveryNoteIsValid
            && constructionProjectIsValid
            && licensePlateIsValid
            && warehouseWorkerIsValid
            && noteIsValid
            && statusIsValid
            && uniqueNumberIsValid
    }

    const getUpdatedDeliveryNote = () => {
        return {
            ...deliveryNote,
            customer: customers?.find(c => c.name === customer)?._id,
            uniqueNumber,
            relatedDeliveryNote,
            personInCharge,
            warehouseWorker,
            licensePlate,
            logistics,
            constructionProject,
            signatures,
            dateOfIssue,
            note,
            status,
            visible,
            parts: deliveryNoteParts,
            customParts: deliveryNoteCustomParts
        }
    }

    useEffect(() => {
        // do only save changes locally if this parts are added
        if (isDirty) {
            const deliveryNoteDraft = getUpdatedDeliveryNote();
            deliveryNoteDraft.customer = { name: customer };
            localStorage.setItem(deliveryNote?._id || DELIVERY_NOTE_DRAFT, JSON.stringify(deliveryNoteDraft));
        }
        // eslint-disable-next-line
    }, [customer, licensePlate, logistics, constructionProject, note, deliveryNoteParts, deliveryNoteCustomParts]);

    useEffect(() => {
        if (createdCustomer) {
            const foundCustomer = customers.find(customer => customer.name === createdCustomer.name);
            if (foundCustomer) {
                setCreatedCustomer(null);
                setCustomer(foundCustomer.name);
            }
        }
        // eslint-disable-next-line
    }, [customers, createdCustomer]);

    const updateDeliveryNoteParts = (updatedDeliveryNoteParts) => {
        setIsDirty(true);
        setDeliveryNoteParts(updatedDeliveryNoteParts);
    }

    const updateDeliveryNoteCustomParts = (updatedDeliveryNoteCustomParts) => {
        setIsDirty(true);
        setDeliveryNoteCustomParts(updatedDeliveryNoteCustomParts);
    }

    const handleTabIndexChanged = (newValue) => setTabIndex(newValue);
    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, [tabIndex])

    const onVisibleChanged = (e) => setVisible(!visible);

    const handleLogistics = (e, newLogistics) => {
        if (newLogistics !== null) {
            setLogistics(newLogistics);
        }
    };

    const handleNextTab = (e) => {
        e.preventDefault();

        setCustomerIsTouched(true);
        setPersonInChargeIsTouched(true);
        setConstructionProjectIsTouched(true);
        setLicensePlateIsTouched(true);
        setWarehouseWorkerIsTouched(true);
        setNoteIsTouched(true);
        setUniqueNumberIsTouched(true);

        if (isFormValid()) {
            handleTabIndexChanged(1);
        } else {
            window.scrollTo({ top: 0 });
        }
    }

    const handleDeliveryNoteFileImported = (updatedDeliveryNote) => {
        if (!updatedDeliveryNote) return;

        setCustomer(customers?.find(customer => customer.name === updatedDeliveryNote.customer)?.name || DEFAULT_CUSTOMER);
        setConstructionProject(updatedDeliveryNote.constructionProject);
        setLicensePlate(updatedDeliveryNote.licensePlate);
        setLogistics(updatedDeliveryNote.logistics);
        updateDeliveryNoteParts(updatedDeliveryNote.parts)
        updateDeliveryNoteCustomParts(updatedDeliveryNote.customParts)
    }

    const handleCreateCustomer = () => setShowCustomerDialog(true);
    const onCustomerCreated = (createdCustomer) => setCreatedCustomer(createdCustomer);

    const handleSaveDeliveryNote = async (e) => {
        e.preventDefault();

        if (!isFormValid()) {
            window.scrollTo({ top: 0 });
            return;
        }

        if (deliveryNoteParts.length <= 0 && deliveryNoteCustomParts?.length <= 0) {
            return Swal.fire({
                title: "Fehlende Bauteile",
                text: "Es muss mindestens 1 Bauteil hinzugefügt werden",
                icon: 'warning'
            })
        }

        const updatedDeliveryNote = getUpdatedDeliveryNote()

        if (!shouldBeLoaded) {
            updatedDeliveryNote.parts = updatedDeliveryNote.parts.map(partItem => (
                {
                    ...partItem,
                    loaded: partItem.amount
                }
            ))
            updatedDeliveryNote.customParts = updatedDeliveryNote.customParts.map(partItem => (
                {
                    ...partItem,
                    loaded: partItem.amount
                }
            ))

            updatedDeliveryNote.status = LIST_STATUS.DONE;
            updatedDeliveryNote.dateOfCompletion ||= new Date();
        }

        try {
            setIsSaving(true);
            const isSaved = await onSaveButtonClicked(updatedDeliveryNote);
            console.log("DeliveryNote was saved: " + isSaved);
            if (isSaved) {
                localStorage.removeItem(deliveryNote?._id || DELIVERY_NOTE_DRAFT);
            }
        } finally {
            setIsSaving(false);
        }
    }

    const openSignatureCustomer = () => {
        openSignatureDialog({
            title: "Unterschrift Kunde",
            onConfirm: (signature) => setSignatures(signatures => {
                const updatedSignatures = {
                    ...signatures,
                    customer: signature
                }
                return updatedSignatures;
            })
        })

    }

    const openSignatureWarehouseWorker = () => {
        openSignatureDialog({
            title: "Unterschrift Lagermitarbeiter",
            onConfirm: (signature) => setSignatures(signatures => {
                const updatedSignatures = {
                    ...signatures,
                    warehouseWorker: signature
                }
                return updatedSignatures;
            })
        })
    }

    const InformationGrid = (
        <Grid item xs={12} sm={12} md={12} lg={5} xl={4}>

            {
                isBrowser ? (
                    <>
                        <Typography variant='h5'>Informationen</Typography>
                        <Divider />
                    </>
                ) : null
            }

            {
                deliveryNote?._id && (
                    <TextField
                        className='mt-3'

                        disabled

                        label='Lieferschein-Nummer'
                        variant='outlined'
                        color={!uniqueNumberHasError ? 'success' : ''}

                        value={uniqueNumber}
                        onChange={uniqueNumberChangeHandler}
                        onBlur={uniqueNumberBlurHandler}

                        fullWidth
                        error={uniqueNumberHasError}
                        helperText={!!uniqueNumberHasError && 'Bitte gib eine gültige Lieferscheinnummer (> 0) ein.'}

                        InputProps={{
                            startAdornment: <InputAdornment position='start'>LS-</InputAdornment>,
                            endAdornment: !!uniqueNumberIsTouched && (
                                !!uniqueNumberHasError
                                    ? <InputAdornment position='end'><ErrorOutlineOutlined color='error' /></InputAdornment>
                                    : <InputAdornment position='end'><CheckCircleOutlined color='success' /></InputAdornment>
                            ),
                        }}
                    />
                )
            }

            <div className='d-flex mt-3'>
                {
                    !!customers
                        ? (
                            <>
                                <ItemSelect

                                    options={customers}
                                    value={customers?.find(c => c.name === customer)}
                                    placeholder="Kunden durchsuchen..."
                                    onChange={(e, value) => setCustomer(value?.name)}
                                    getOptionLabel={(option) => option.name}
                                    renderListItem={(props, option) => (
                                        <div {...props} key={props.key} style={{ cursor: 'pointer', listStyle: 'none' }} className='px-2 py-1 virtualizedListItem' >
                                            <Typography fontWeight='bold'>{option.name}</Typography>
                                            <Typography color='#666'>{option.street || '<keine Straße>'}, {option.city || '<keine Stadt>'}</Typography>
                                        </div>
                                    )}

                                    renderInput={(params) => (<TextField {...params}
                                        required

                                        label='Kunden auswählen...'
                                        onBlur={customerBlurHandler}

                                        error={customerHasError}
                                        helperText={!!customerHasError && 'Bitte wähle einen Kunden aus.'}

                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: <InputAdornment position='start'>< BusinessOutlined /></InputAdornment>
                                        }}
                                    />
                                    )}
                                />
                                {/* <TextField
                                    id="TextField_Firma"
                                    select
                                    required
                                    label='Firma'
                                    variant='outlined'
                                    fullWidth

                                    value={customer}
                                    onChange={customerChangeHandler}
                                    onBlur={customerBlurHandler}

                                    error={customerHasError}
                                    helperText={!!customerHasError && 'Bitte wähle einen Kunden aus.'}

                                    InputProps={{
                                        startAdornment: <InputAdornment position='start'>< BusinessOutlined /></InputAdornment>
                                    }}
                                >
                                    {
                                        customers.map(customer =>
                                            <MenuItem
                                                key={customer._id}
                                                className="mr-3"
                                                value={customer.name}
                                            >
                                                {customer.name}
                                            </MenuItem>
                                        )
                                    }
                                </TextField> */}
                                <Button onClick={handleCreateCustomer}>
                                    <Add />
                                </Button>
                            </>
                        ) : (
                            <TextField
                                disabled
                                label='Firma'
                                variant='outlined'
                                value='Lade Kunden...'
                                fullWidth
                                InputProps={{
                                    startAdornment: <InputAdornment position='start'>< BusinessOutlined /></InputAdornment>
                                }}
                            />
                        )
                }
            </div>

            <TextField
                className='mt-3'

                label='Verantwortliche Person (Kunde)'
                variant='outlined'
                color={!personInChargeHasError ? 'success' : ''}

                value={personInCharge}
                onChange={personInChargeChangeHandler}
                onBlur={personInChargeBlurHandler}

                fullWidth
                error={personInChargeHasError}
                helperText={!!personInChargeHasError && 'Bitte gib die anwesende Person des Kunden ein.'}

                InputProps={{
                    startAdornment: <InputAdornment position='start'><AccountCircleOutlined /></InputAdornment>,
                    endAdornment: !!personInChargeIsTouched && (
                        !!personInChargeHasError
                            ? <InputAdornment position='end'><ErrorOutlineOutlined color='error' /></InputAdornment>
                            : <InputAdornment position='end'><CheckCircleOutlined color='success' /></InputAdornment>
                    ),
                }}
            />

            <TextField
                className='mt-3'
                label='Bauvorhaben'
                variant='outlined'
                color={!constructionProjectHasError ? 'success' : ''}

                value={constructionProject}
                onChange={constructionProjectChangeHandler}
                onBlur={constructionProjectBlurHandler}

                fullWidth

                InputProps={{
                    startAdornment: <InputAdornment position='start'><CarpenterOutlined /></InputAdornment>,
                    endAdornment: !!constructionProjectIsTouched && (
                        !!constructionProjectHasError
                            ? <InputAdornment position='end'><ErrorOutlineOutlined color='error' /></InputAdornment>
                            : <InputAdornment position='end'><CheckCircleOutlined color='success' /></InputAdornment>
                    ),
                }}
            />

            <TextField
                className='mt-3'
                id="Kennzeichen"


                label='Kennzeichen'
                variant='outlined'
                color={!licensePlateHasError && 'success'}

                value={licensePlate}
                onChange={licensePlateChangeHandler}
                onBlur={licensePlateBlurHandler}

                fullWidth

                InputProps={{
                    startAdornment: <InputAdornment position='start'><DirectionsCarOutlined /></InputAdornment>,
                    endAdornment: !!licensePlateIsTouched && (
                        !!licensePlateHasError
                            ? <InputAdornment position='end'><ErrorOutlineOutlined color='error' /></InputAdornment>
                            : <InputAdornment position='end'><CheckCircleOutlined color='success' /></InputAdornment>
                    ),
                }}
            />

            {
                !!users
                    ? (
                        <TextField
                            className='mt-3'

                            select
                            required

                            label='Lagermitarbeiter'
                            variant='outlined'
                            fullWidth

                            value={warehouseWorker}
                            onChange={warehouseWorkerChangeHandler}
                            onBlur={warehouseWorkerBlurHandler}

                            error={warehouseWorkerHasError}
                            helperText={!!warehouseWorkerHasError && 'Bitte wähle den zuständigen Lagermitarbeiter aus.'}

                            InputProps={{
                                startAdornment: <InputAdornment position='start'>
                                    {!!warehouseWorker
                                        ? <UserAvatar key={warehouseWorker} size='small' userId={warehouseWorker} />
                                        : <AccountCircleOutlined />}
                                </InputAdornment>,
                                endAdornment: !!warehouseWorkerIsTouched && (
                                    !!warehouseWorkerHasError
                                        ? <InputAdornment position='end'><ErrorOutlineOutlined color='error' /></InputAdornment>
                                        : <InputAdornment position='end'><CheckCircleOutlined color='success' /></InputAdornment>
                                ),
                            }}
                            SelectProps={{
                                renderValue: value => users.find(user => user._id === value)?.name
                            }}
                        >
                            {
                                users.map(user =>
                                    <MenuItem
                                        key={user._id}
                                        className="mr-3"
                                        value={user._id}
                                    >
                                        <ListItemAvatar>
                                            <UserAvatar size='small' userId={user._id} />
                                        </ListItemAvatar>
                                        <ListItemText>{user.name}</ListItemText>
                                    </MenuItem>
                                )
                            }
                        </TextField>
                    ) : (
                        <TextField
                            disabled
                            label='Lagermitarbeiter'
                            variant='outlined'
                            value='Lade Mitarbeiter...'

                            className='mt-3'
                            fullWidth
                            InputProps={{
                                startAdornment: <InputAdornment position='start'>< AccountCircleOutlined /></InputAdornment>
                            }}
                        />
                    )
            }

            <div className='mt-3'>
                <ToggleButtonGroup
                    value={logistics}
                    exclusive
                    fullWidth
                    onChange={handleLogistics}
                >
                    <ToggleButton value={DELIVERY_NOTE_LOGISTICS.OUTBOUND} color='primary' >
                        <FileUploadOutlined /><div className='mx-1' /> Ausgabe
                    </ToggleButton>
                    <ToggleButton value={DELIVERY_NOTE_LOGISTICS.INBOUND} color="secondary" >
                        <FileDownloadOutlined /><div className='mx-1' /> Rücklieferung
                    </ToggleButton>
                </ToggleButtonGroup>
            </div>

            <div className='mt-3'>
                <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    localeText={deDE.components.MuiLocalizationProvider.defaultProps.localeText}
                >
                    <DatePicker
                        format='DD.MM.YYYY'
                        label={'Ausgabe/Empfangsdatum'}
                        views={['year', 'month', 'day']}
                        openTo='day'
                        value={dateOfIssue}
                        onChange={(newDate) => setDateOfIssue(getDayjsWithoutTime(newDate))}
                        slotProps={{
                            actionBar: {
                                actions: ['cancel', /*'clear',*/ 'today', 'accept'],
                            },
                            textField: {
                                fullWidth: true
                            }
                        }}
                    />
                </LocalizationProvider>
            </div>


            {
                deliveryNote?._id
                    ? (
                        <Paper sx={{ px: 2, pt: 2, mt: 3 }}>
                            <SignatureDisplay
                                title="Unterschrift Kunde"
                                signature={signatures?.customer}
                                onEdit={openSignatureCustomer}
                                onDelete={() => setSignatures(signatures => {
                                    return {
                                        ...signatures,
                                        customer: null
                                    }
                                })}
                            />
                            <SignatureDisplay
                                title="Unterschrift Lagermitarbeiter"
                                signature={signatures?.warehouseWorker}
                                onEdit={openSignatureWarehouseWorker}
                                onDelete={() => setSignatures(signatures => {
                                    return {
                                        ...signatures,
                                        warehouseWorker: null
                                    }
                                })}
                            />
                        </Paper>
                    )
                    : null
            }

            <TextField
                className='mt-3'
                label='Notiz'
                variant='outlined'
                color={!noteHasError && 'success'}

                value={note}
                onChange={noteChangeHandler}
                onBlur={noteBlurHandler}

                fullWidth

                InputProps={{
                    startAdornment: <InputAdornment position='start'><NotesOutlined /></InputAdornment>,
                    endAdornment: !noteHasError && noteIsTouched && <InputAdornment position='end'><CheckCircleOutlined color='success' /></InputAdornment>,
                }}
            />

            {
                deliveryNote?._id && (
                    <TextField
                        className='mt-3'

                        select
                        required

                        label='Status'
                        variant='outlined'
                        fullWidth

                        value={status}
                        onChange={statusChangeHandler}
                        onBlur={statusBlurHandler}

                        error={statusHasError}
                        helperText={!!statusHasError && 'Bitte wähle den aktuellen Status aus.'}

                        InputProps={{
                            startAdornment: <InputAdornment position='start'><CircleOutlined /></InputAdornment>,
                            endAdornment: !statusHasError && statusIsTouched && <InputAdornment position='end'><CheckCircleOutlined color='success' /></InputAdornment>,
                        }}
                    >
                        {
                            Object.entries(LIST_STATUS).map((entry, index) => (
                                <MenuItem key={index} value={entry[0]}>{LIST_STATUS_LANG[entry[1]]}</MenuItem>
                            ))
                        }
                    </TextField>
                )
            }
            {
                user?.isAdmin
                    ? (
                        <div className="ms-1 mt-3">
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={shouldBeLoaded}
                                        onChange={(e, selected) => setShouldBeLoaded(selected)}
                                    />
                                } label="Dieser Lieferschein muss noch verladen werden" sx={{ width: '100%' }} />
                            <div className='mt-3'>
                                <Button
                                    className="p-0"
                                    onClick={onVisibleChanged}
                                    startIcon={deployIcons[visible]}
                                    size="large"
                                >
                                    Für das Lager {visible ? 'vergebergen' : 'sichtbar'}
                                </Button>
                                <Typography variant='subtitle1'>
                                    Wenn die Liste sichtbar ist (grünes Auge), kann diese von Lagermitarbeitern angesehen werden.
                                    Wenn die Liste verborgen ist (rotes Auge), kann das Lager diese Liste nicht einsehen.
                                </Typography>
                            </div>
                        </div>
                    )
                    : null
            }

        </Grid >
    )

    const PartsGrid = useMemo(() => (
        <Grid item xs={12} sm={12} md={12} lg={7} xl={8}>
            {
                isBrowser ? (
                    <>
                        <Typography variant='h5'>Bauteile</Typography>
                        <Divider />
                    </>
                ) : null
            }
            <div className='m-1 mt-3'>
                <AddableListPartsList
                    parts={parts}
                    list={deliveryNote}
                    listParts={deliveryNoteParts}
                    setListParts={updateDeliveryNoteParts}
                    listCustomParts={deliveryNoteCustomParts}
                    setListCustomParts={updateDeliveryNoteCustomParts}
                />
            </div>
        </Grid>
    ), [parts, deliveryNote, deliveryNoteParts, deliveryNoteCustomParts]);

    return (
        <DefaultContainer heightSubtract={isMobile ? TAB_HEIGHT : 0}>
            {SignatureDialog}

            <CreateCustomerDialog
                show={showCustomerDialog}
                setShow={setShowCustomerDialog}
                onCustomerCreated={onCustomerCreated}
            />

            <MobileView>
                <Tabs
                    value={tabIndex}
                    onChange={(e, newValue) => handleTabIndexChanged(newValue)}
                    style={{ position: 'sticky', zIndex: 100, top: TOP_NAV_HEIGHT, backgroundColor: '#fff' }}
                >
                    <Tab value={0} label="Informationen" />
                    <Tab value={1} label="Bauteile" />
                </Tabs>

                {tabIndex === 0 && InformationGrid}
                {tabIndex === 1 && PartsGrid}

                <FloatingButton
                    onClick={tabIndex === 0 ? handleNextTab : handleSaveDeliveryNote}
                    disabled={isSaving}
                    icon={isSaving ? <CircularProgress size={24} /> : tabIndex === 0 ? <IoMdArrowRoundForward /> : <Save />}
                    text='Weiter'
                />

            </MobileView>
            <BrowserView>

                <ImportChecklistFromFile
                    user={user}
                    parts={parts}
                    updateChecklist={handleDeliveryNoteFileImported}
                />

                <Grid container spacing={2} >
                    {InformationGrid}
                    {PartsGrid}
                </Grid>

                <FloatingButton
                    onClick={handleSaveDeliveryNote}
                    disabled={isSaving}
                    icon={isSaving ? <CircularProgress size={24} /> : <Save />}
                    text='Speichern'
                />
            </BrowserView>

        </DefaultContainer >
    )
}

export default EditableDeliveryNoteContent
