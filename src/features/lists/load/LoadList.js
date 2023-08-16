import { useEffect, useState } from 'react';

import { FormControlLabel, FormGroup, Grid, Switch } from '@mui/material';
import Swal from 'sweetalert2';

import CenteredPulseLoader from "../../../components/loading/CenteredPulseLoader";
import QrScannerModal from '../../../components/modal/QrScannerModal';
import { openNumberInputDialog } from '../../../components/utils/messages';

import { copyArray, getWeightSumOf, sortChecklistPartsByOrderIndex } from '../../../utils/checklist/ChecklistPartsUtils';
import { trimToUpperCase } from '../../../utils/StringUtils';
import { LIST_PART_STATUS } from '../../../config/list';

import LoadPartsList from '../../../components/parts/list/LoadPartsList';
import useAuth from '../../../hooks/auth/useAuth';

const checkIsFinished = (listParts) => listParts.every(partItem => isPartFullyLoaded(partItem));

const isPartFullyLoaded = (partItem) => {
    // Falls das Element als 'deleted' markiert wurde, soll die geladene Menge = 0 sein
    // Andernfalls soll die vorgegebene Menge aufgeladen sein
    return getLoadedAmount(partItem) === (partItem.status === LIST_PART_STATUS.deleted ? 0 : partItem.amount);
}

const getLoadedAmount = (partItem) => {
    return +(partItem.loaded || 0);
}


// #######################################
// ########### Component Logik ###########
// #######################################

const LoadList = ({ list, updateList, mutate, height }) => {

    // const { id } = useParams();
    // const { list, isLoading, mutate } = useList(id);
    const { user } = useAuth();

    const [onLoading, setOnLoading] = useState(true);
    const [showQRModal, setShowQRModal] = useState(false);
    const [listParts, setListParts] = useState([]);
    const [listCustomParts, setListCustomParts] = useState([]);
    // const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        setListParts(sortChecklistPartsByOrderIndex(copyArray(list?.parts)));
        setListCustomParts(list?.customParts);
    }, [list]);
    const handleLoadingChange = () => setOnLoading(!onLoading);

    if (!list) {
        return <CenteredPulseLoader />
    }

    const handleQRResult = (result) => {
        const matchingPart = listParts.find(partItem => trimToUpperCase(partItem.part.articleNr) === trimToUpperCase(result));
        if (!!matchingPart) {
            updateLoadedNumber(matchingPart, increaseLoadedValueBy);
        } else {
            Swal.fire({
                title: "Element nicht in Liste",
                text: "Das eingescannte Element ist in dieser Liste nicht vorhanden",
                icon: 'warning'
            })
        }
    }

    const updateListParts = async (updatedListParts, updatedListCustomParts) => {
        setListParts(updatedListParts)
        setListCustomParts(updatedListCustomParts)

        const isCompletlyLoaded = checkIsFinished(updatedListParts) && checkIsFinished(updatedListCustomParts);
        const updatedList = {
            ...list,
            status: isCompletlyLoaded ? 'DONE' : 'IN_PROGRESS',
            parts: updatedListParts,
            customParts: updatedListCustomParts
        }

        if (isCompletlyLoaded) {

            // setShowConfetti(true);
            // setTimeout(() => setShowConfetti(false), 5000)

            Swal.fire({
                title: 'Ladeliste erledigt!',
                icon: 'success'
            });
        }

        await updateList(updatedList);
        mutate();
    }

    // ############################################################################
    // ######### Funktionen zum Editieren der geladenen Elemente (Anzahl) #########
    // ############################################################################

    const increaseLoadedValueBy = (item, inputValue) => item.loaded = +(item.loaded || 0) + +inputValue;
    const decreaseLoadedValueBy = (item, inputValue) => item.loaded = Math.max(+(item.loaded || 0) - +inputValue, 0);
    const applyToItemMatchingId = (partId, func, ...args) => listParts.map(item => {
        if (item.part._id === partId) func(item, args);
        return item;
    })
    const applyToCustomItemMatchingId = (partId, func, ...args) => listCustomParts.map(item => {
        if (item.part._id === partId) func(item, args);
        return item;
    })
    const updateLoadedNumber = async (partItem, func) => {
        const inputValue = await openNumberInputDialog("Anzahl der Elemente?");
        if (inputValue > 0) {
            const partId = partItem.part._id;

            if (partItem.part.origin === 'CUSTOM') {
                const updatedListCustomParts = applyToCustomItemMatchingId(partId, func, inputValue);
                updateListParts(listParts, updatedListCustomParts);
            } else {
                const updatedListParts = applyToItemMatchingId(partId, func, inputValue);
                updateListParts(updatedListParts, listCustomParts)
            }
        }
    }

    const onLoadItem = async (partItem) => updateLoadedNumber(partItem, onLoading ? increaseLoadedValueBy : decreaseLoadedValueBy);
    const sumWeight = user?.isAdmin
        ? (
            <div className='p-2' style={{ textAlign: 'end' }}>
                Gesamtgewicht: <b>{getWeightSumOf(listParts)} kg</b>
            </div>
        )
        : null;

    // ##################################
    // ######### User-Interface #########
    // ##################################

    return (
        <>

            {/* {
                showConfetti && <ConfettiExplosion />
            } */}

            <QrScannerModal
                show={showQRModal}
                setShow={setShowQRModal}
                onResult={handleQRResult}
            />
            <div className='mt-3'>

                <Grid container justifyContent={user?.isAdmin ? "space-between" : "flex-end"}>
                    {sumWeight}
                    <FormGroup>
                        <FormControlLabel control={
                            <Switch
                                checked={onLoading}
                                onChange={handleLoadingChange}
                                color="success" />
                        } label={onLoading ? "Aufladen" : "Abladen"} />
                    </FormGroup>
                </Grid>

                <LoadPartsList
                    listParts={[...listParts, ...listCustomParts]}
                    onLoadItem={onLoadItem}
                    onLoading={onLoading}
                    height={height}
                />

            </div>
        </>
    )
}

export default LoadList
