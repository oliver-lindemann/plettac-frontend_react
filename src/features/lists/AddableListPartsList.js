import useAuth from '../../hooks/auth/useAuth'

import AddablePartsList from '../../components/parts/AddablePartsList'
import { getWeightSumOf } from '../../utils/checklist/ChecklistPartsUtils';
import { LIST_STATUS } from '../../config/list';

const AddableListPartsList = ({ parts, list, listParts, setListParts, listCustomParts, setListCustomParts }) => {

    const { user } = useAuth();

    const sumWeight = user?.isAdmin
        ? (
            <div className='p-2' style={{ textAlign: 'end' }}>
                Gesamtgewicht: <b>{getWeightSumOf(listParts)} kg</b>
            </div>
        )
        : null;

    return (
        <>
            <AddablePartsList
                parts={parts}
                partsList={listParts}
                setPartsList={setListParts}
                customParts
                customPartsList={listCustomParts}
                setCustomPartsList={setListCustomParts}
                mergeDuplicates
                draft={list?._id && list.status !== LIST_STATUS.OPEN}
            />

            {sumWeight}
        </>
    )
}

export default AddableListPartsList