import { FileDownloadOutlined, FileUploadOutlined, MonetizationOnOutlined, QueryBuilderOutlined } from '@mui/icons-material'
import { Alert, Card, CardContent, CircularProgress, Divider, Grid, Tooltip, Typography } from '@mui/material'
import UserAvatar from '../../../components/utils/UserAvatar'
import { DELIVERY_NOTE_LOGISTICS, formatDeliveryNoteNumber, formatNumber } from '../../../config/deliveryNote'
import { LIST_STATUS_ICONS_MOBILE, LIST_STATUS_LANG } from '../../../config/list'
import { formatDate } from '../../../utils/StringUtils'

import { Link } from 'react-router-dom'


function getIconOfStatus(status) {
    return LIST_STATUS_ICONS_MOBILE[status];
}

const CustomCard = ({ children }) => {
    return (
        <Grid item xs={12} sm={12} md={6} lg={4} xl={12}>
            <Card elevation={2} style={{ height: '100%' }}>
                <CardContent style={{ padding: '16px' }}>
                    {children}
                </CardContent>
            </Card>
        </Grid>
    )
}

const DeliveryNoteInformation = ({ deliveryNote, switchToPreview }) => {

    if (!deliveryNote) {
        return <CircularProgress color='error' />
    }

    return (
        <>
            <div className='d-flex justify-content-between align-content-center'>
                <div>
                    <Typography variant='h5'>
                        Lieferschein {` - #${formatDeliveryNoteNumber(deliveryNote)}`} {deliveryNote.logistics === DELIVERY_NOTE_LOGISTICS.CANCELLATION && <> - Storno zu #<Link to={`/deliveryNotes/${deliveryNote.relatedDeliveryNote?._id}`}>{formatNumber(deliveryNote.relatedDeliveryNote?.uniqueNumber)}</Link></>}
                    </Typography>
                    <Typography variant='subtitle2'>
                        {formatDate(deliveryNote.createdAt)} {deliveryNote.dateOfIssue ? ` - Ausgabe: ${formatDate(deliveryNote.dateOfIssue)}` : null}
                    </Typography>
                </div>

                <div style={{ textAlign: 'end' }}>
                    {getIconOfStatus(deliveryNote.status)}
                    <Typography variant='subtitle1'>
                        {LIST_STATUS_LANG[deliveryNote.status]}
                    </Typography>
                </div>
            </div>

            <Divider className='mt-2 mb-2' />

            {
                (!deliveryNote.signatures?.customer || !deliveryNote.signatures.warehouseWorker)
                    ? (
                        <Alert severity='warning' onClick={switchToPreview} className='mb-2'>
                            Der Lieferschein wurde noch nicht unterschrieben. Bitte lasse den Lieferschein vor dem Drucken digital unterschreiben. Tippe hier, um zu den Unterschriften zu gelangen.
                        </Alert>
                    )
                    : null
            }

            <Grid container spacing={1}>
                <CustomCard>
                    <Typography color="text.secondary" gutterBottom>Firma</Typography>
                    <Divider className='mt-1 mb-1' />
                    <Typography variant='body1' fontSize={18}>{deliveryNote.customer?.name}</Typography>
                    <Typography color="text.secondary">
                        {deliveryNote.customer?.street}
                    </Typography>
                    <Typography color="text.secondary">
                        {deliveryNote.customer?.city}
                    </Typography>
                </CustomCard>

                <CustomCard>
                    <Typography color="text.secondary" gutterBottom>Angabe zur Abholung/Lieferung</Typography>
                    <Divider />
                    <div className='d-flex justify-content-between mt-1'>
                        <div>
                            <Typography>{deliveryNote.personInCharge}</Typography>
                            <Typography>{deliveryNote.licensePlate}</Typography>
                            <Typography>{deliveryNote.constructionProject}</Typography>
                        </div>
                        <div>
                            {deliveryNote.type === 'Rental'
                                ? <Tooltip title="Miete"><div className='d-flex gap-2 align-items-center'><QueryBuilderOutlined color="primary" />Miete</div></Tooltip>
                                : null
                            }
                            {deliveryNote.type === 'Sale'
                                ? <Tooltip title="Verkauf"><div className='d-flex gap-2 align-items-center'><MonetizationOnOutlined color="success" /> Verkauf</div></Tooltip>
                                : null}
                            {
                                deliveryNote.logistics === DELIVERY_NOTE_LOGISTICS.INBOUND
                                    ? <Tooltip title="Rücklieferung"><div className='d-flex gap-2 align-items-center'><FileDownloadOutlined color='success' />Rücklieferung</div></Tooltip>
                                    : <Tooltip title="Ausgabe"><div className='d-flex gap-2 align-items-center'><FileUploadOutlined color='error' />Ausgabe</div></Tooltip>
                            }
                        </div>
                    </div>
                </CustomCard>

                <CustomCard>
                    <Typography color="text.secondary" gutterBottom>Verantwortlicher Lagermitarbeiter</Typography>
                    <Divider />
                    <div className='d-flex gap-2 align-items-center mt-1'>
                        <UserAvatar userId={deliveryNote.warehouseWorker?._id} /> {deliveryNote.warehouseWorker?.name}
                    </div>
                </CustomCard>

                {
                    deliveryNote.note
                        ? (
                            <CustomCard>
                                <Typography variant="" color="text.secondary" gutterBottom>Notiz</Typography>
                                <Divider className='mt-1 mb-1' />
                                <Typography variant='body1'>
                                    {deliveryNote.note}
                                </Typography>
                            </CustomCard>
                        ) : null
                }

                {
                    deliveryNote.sharedWithUsers?.edit?.length > 0 ? (
                        <CustomCard>
                            <Typography variant="" color="text.secondary" gutterBottom>Zur Bearbeitung freigegeben für</Typography>
                            <Divider className='mt-1 mb-1' />
                            <div className='d-flex gap-2'>
                                {deliveryNote.sharedWithUsers?.edit?.map((user, index) => <UserAvatar key={index} userId={user._id} />)}
                            </div>
                        </CustomCard>
                    ) : null
                }

                {
                    deliveryNote.sharedWithUsers?.view?.length > 0 ? (
                        <CustomCard>
                            <Typography variant="" color="text.secondary" gutterBottom>Zur Ansicht freigegeben für</Typography>
                            <Divider className='mt-1 mb-1' />
                            <div className='d-flex gap-2'>
                                {deliveryNote.sharedWithUsers?.view?.map((user, index) => <UserAvatar key={index} userId={user._id} />)}
                            </div>
                        </CustomCard>

                    ) : null
                }
            </Grid>


        </>
    )
}

export default DeliveryNoteInformation