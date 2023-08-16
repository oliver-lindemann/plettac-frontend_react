import { Link, useNavigate } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import { AddOutlined, ChecklistOutlined, LocalShippingOutlined } from '@mui/icons-material';

import DefaultContainer from '../components/layout/DefaultContainer';
import FloatingButton from '../components/layout/FloatingButton';

import DeliveryNoteTable from '../features/deliveryNotes/list/browser/DeliveryNoteTable';
import DeliveryNoteTableCompact from '../features/deliveryNotes/list/mobile/DeliveryNoteTableCompact';
import ListsTable from '../features/lists/view/ListTable';
import LoadingListTable from '../features/loadingLists/list/browser/LoadingListTable';
import LoadingListTableCompact from '../features/loadingLists/list/mobile/LoadingListTableCompact';

import useAuth from '../hooks/auth/useAuth';
import useDeliveryNotes from '../hooks/deliveryNotes/useDeliveryNotes';
import useLoadingLists from '../hooks/loadingLists/useLoadingLists';
import { useOptionDialog } from '../hooks/dialogs/useOptionDialog';
import { LIST_STATUS } from '../config/list';

function AllListsPage() {

    const { user } = useAuth();
    const navigate = useNavigate();
    const { loadingLists } = useLoadingLists();
    const { deliveryNotes } = useDeliveryNotes();

    const [openSelectDialog, SelectDialog] = useOptionDialog();

    const handleCreateNewList = async () => {
        if (user?.isAdmin) {
            openSelectDialog({
                title: 'Was möchtest du erstellen?',
                options: [
                    {
                        text: 'Ladeliste',
                        onClick: openNewLoadingList,
                        props: {
                            variant: "outlined",
                            color: "success",
                            startIcon: < ChecklistOutlined />
                        }
                    },
                    {
                        text: 'Lieferschein',
                        onClick: openNewDeliveryNote,
                        props: {
                            variant: "outlined",
                            color: "primary",
                            startIcon: < LocalShippingOutlined />
                        }
                    }
                ],
            });
        } else if (user?.isLager) {
            openNewDeliveryNote();
        } else {
            openNewLoadingList();
        }

    }

    const openNewDeliveryNote = () => {
        navigate(`/deliveryNotes/new`);
    }
    const openNewLoadingList = () => {
        navigate(`/loadingLists/new`);
    }

    // if (error) {
    //     return <ErrorPage error={error} />;
    // }

    return (
        // <div className='m-3'>
        <DefaultContainer>
            {SelectDialog}

            {/* <div style={{ height: 'calc(100vh - 96px)' }}>
                <div style={{ height: 'calc((100vh - 96px) / 2)' }}> */}
            <ListsTable
                variant='loadingLists'
                lists={loadingLists?.filter(list => list.status !== LIST_STATUS.ARCHIVED)}
                renderTable={(loadingLists) => (
                    isMobile
                        ? <LoadingListTableCompact loadingLists={loadingLists} />
                        : <LoadingListTable loadingLists={loadingLists} />
                )}
            />

            {
                user?.isLager
                    ? (<>
                        <div className='my-5' />
                        {/* </div>
                <div style={{ height: 'calc((100vh - 96px) / 2)' }}> */}
                        <ListsTable
                            variant='deliveryNotes'
                            lists={deliveryNotes?.filter(list => list.status !== LIST_STATUS.ARCHIVED)}
                            renderTable={(deliveryNotes) => (
                                isMobile
                                    ? <DeliveryNoteTableCompact deliveryNotes={deliveryNotes} />
                                    : <DeliveryNoteTable deliveryNotes={deliveryNotes} />
                            )}
                        />
                    </>) : null
            }

            {/* </div>
            </div> */}
            <FloatingButton
                onClick={handleCreateNewList}
                icon={<AddOutlined />}
            />
            {/* </div> */}
        </DefaultContainer>
    );
}

export default AllListsPage;