import { AddCircleOutlineRounded, ArrowRightAltRounded, ChangeHistoryRounded, RemoveCircleOutlineRounded } from '@mui/icons-material'
import usePart from '../../../hooks/parts/usePart'
import UserAvatar from '../../../components/utils/UserAvatar';
import { Typography } from '@mui/material'
import PartItem from '../../parts/PartItem';
import useCustomers from '../../../hooks/customers/useCustomers';
import useUsers from '../../../hooks/users/useUsers';
import dayjs from 'dayjs';
import { DELIVERY_NOTE_LOGISTICS_LANG } from '../../../config/deliveryNote';
import { LIST_STATUS_LANG } from '../../../config/list';

const translation = {
    status: 'Status',
    locked: 'Gesperrt',
    deployed: 'Freigegeben',
    visible: 'Sichtbar',
    customer: 'Kunde',
    type: 'Typ',
    logistics: "Logistik",
    rental: 'Miete',
    sale: 'Verkauf',
    signatures: 'Unterschrift',
    'signatures.customer': 'Unterschrift Kunde',
    'signatures.warehouseWorker': 'Unterschrift Lagermitarbeiter',
    personInCharge: 'Verantwortliche Person (Kunde)',
    warehouseWorker: 'Lagermitarbeiter',
    constructionProject: 'Bauvorhaben',
    dateOfIssue: 'Ausgabedatum',
    dateOfCompletion: 'Fertiggestellt am',
    licensePlate: 'Kennzeichen',
    vehicle: 'Fahrzeug',
    note: 'Notiz',
    amount: 'Menge',
    loaded: 'Geladen',
    added: 'Hinzugefügt',
    modified: 'Geändert',
    deleted: 'Entfernt',
    true: 'Ja',
    false: 'Nein',
    'sharedWithUsers': 'Freigegeben für',
    ...LIST_STATUS_LANG,
    ...DELIVERY_NOTE_LOGISTICS_LANG
}

const getTranslation = (input, users, customers) => {

    // If it is a number, return the number
    if (!isNaN(input)) {
        return input;
    }

    const asDate = dayjs(new Date(input));
    // If it is a date, return as formatted date
    if (asDate.isValid() && asDate.isAfter(dayjs('2020-01-01'))) {
        return dayjs(input).format('DD.MM.YYYY - HH:mm [Uhr]')
    }

    // if it is an image, return as image
    if (input?.startsWith('data:image/')) {
        return <img src={input} alt="Bild" style={{ height: '50px' }} />
    }

    const foundUser = users?.find(user => user._id === input);
    if (foundUser) {
        return foundUser.name;
    }

    const foundCustomer = customers?.find(customer => customer._id === input);
    if (foundCustomer) {
        return foundCustomer.name;
    }

    return translation[input] || input;
}

const changeIcons = {
    'added': <AddCircleOutlineRounded fontSize='small' color="success" />,
    'modified': <ChangeHistoryRounded fontSize='small' color='warning' />,
    'removed': <RemoveCircleOutlineRounded fontSize='small' color="error" />
}
const ListHistoryChange = ({ change }) => {

    const { part } = usePart(change.part);
    const { users } = useUsers();
    const { customers } = useCustomers();
    const partItem = (part || change.customPart) ? <PartItem part={part || change.customPart} /> : null;

    return (
        <div className='d-flex gap-2'>
            <div className='d-flex gap-2 p-1'>
                {changeIcons[change.status]} <Typography>{getTranslation(change.field)}:</Typography>
            </div>
            {
                change.users?.length > 0
                    ? (
                        change.users.map((user, index) => <UserAvatar key={index} userId={user} size='small' />)
                    )
                    : (
                        <>
                            <div className='d-flex gap-2 p-1'>
                                <Typography>{getTranslation(change.oldValue, users, customers)}</Typography> <ArrowRightAltRounded /> <Typography>{getTranslation(change.newValue, users, customers)}</Typography>
                            </div>
                            {partItem}
                        </>
                    )
            }
        </div >
    )
}

export default ListHistoryChange