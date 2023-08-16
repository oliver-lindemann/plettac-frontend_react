
import DefaultContainer from '../components/layout/DefaultContainer';


import { Search } from '@mui/icons-material';
import { Grid, InputAdornment, ListItem, ListItemAvatar, ListItemText, Paper, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GroupedVirtuoso } from 'react-virtuoso';
import UserAvatar from '../components/utils/UserAvatar';
import { PLETTAC, formatDeliveryNoteNumber } from '../config/deliveryNote';
import { LIST_STATUS_LANG } from '../config/list';
import { TOP_NAV_HEIGHT } from '../features/navigation/TopNav';
import useAuth from '../hooks/auth/useAuth';
import useDeliveryNotes from '../hooks/deliveryNotes/useDeliveryNotes';
import useLoadingLists from '../hooks/loadingLists/useLoadingLists';
import { groupBy } from '../utils/ArrayUtils';
import { formatDate, removeWhitespace } from '../utils/StringUtils';

import PLETTAC_LOGO from '../images/PlettacAssco_Logo_small.jpg';
import { ROLES } from '../config/roles';

export const ListGroupHeader = (status) => (
    <div
        style={{ backgroundColor: '#212529', color: '#fff' }}
        className='p-1 ps-2 font-monospace fw-bold'
    >
        {LIST_STATUS_LANG[status]}
    </div>
);

const DeliveryNoteItem = (list, onClick) => (
    <ListItem
        className='clickable'
        onClick={onClick}
        secondaryAction={
            <div className='d-flex align-items-center gap-2'>
                {
                    list.issuingCompany === PLETTAC &&
                    <img src={PLETTAC_LOGO} height={24} alt={list.issuingCompany} />
                }
                <div style={{ textAlign: 'end' }}>
                    {formatDate(list.createdAt)} <br />
                    {list.issuingCompany === PLETTAC ? formatDeliveryNoteNumber(list) : ''}
                </div>
            </div>
        }
    >
        <ListItemAvatar>
            <UserAvatar key={list.author?._id} userId={list.author?._id} />
        </ListItemAvatar>
        <ListItemText
            primary={`${list.customer?.name}`}
            secondary={`${list.personInCharge} - ${list.licensePlate}`}
        />
    </ListItem>
);

const LoadingListItem = (list, onClick) => (
    <ListItem
        className='clickable'
        onClick={onClick}
        secondaryAction={formatDate(list.createdAt)}
    >
        <ListItemAvatar>
            <UserAvatar key={list.author?._id} userId={list.author?._id} />
        </ListItemAvatar>
        <ListItemText
            primary={`${list?.constructionProject}`}
            secondary={`${list.vehicle}`}
        />
    </ListItem>
);

function AllArchivedListsPage() {


    const navigate = useNavigate();

    const { user } = useAuth();
    const { loadingLists } = useLoadingLists();
    const { deliveryNotes } = useDeliveryNotes();

    const allLists = [];
    if (loadingLists) allLists.push(...loadingLists);
    if (deliveryNotes) allLists.push(...deliveryNotes);


    const [searchQuery, setSearchQuery] = useState('');
    const searchValues = searchQuery.toLowerCase().split(' ');
    const filteredLoadingLists = loadingLists?.filter(cs =>
        searchValues.every(searchValue => removeWhitespace(JSON.stringify(cs)).toLowerCase().includes(searchValue))
    ).sort((a, b) => {
        if (a.status === b.status) {
            return a.createdAt < b.createdAt;
        }
        return a.status < b.status
    }) || [];

    const filteredDeliveryNotes = deliveryNotes?.filter(cs =>
        searchValues.every(searchValue => removeWhitespace(JSON.stringify(cs)).toLowerCase().includes(searchValue))
    ).sort((a, b) => {
        if (a.status === b.status) {
            return a.createdAt < b.createdAt;
        }
        return a.status < b.status
    }) || [];


    const groupedFilteredLoadingLists = groupBy(filteredLoadingLists, 'status');
    const groupedLoadingListEntries = Object.entries(groupedFilteredLoadingLists);
    const loadingListGroupCounts = Object.values(groupedFilteredLoadingLists).map(arr => arr.length);
    const loadingListItems = Object.values(groupedFilteredLoadingLists).reduce((sum, arr) => sum.concat(arr), []);

    const groupedFilteredDeliveryNotes = groupBy(filteredDeliveryNotes, 'status');
    const groupedDeliveryNoteEntries = Object.entries(groupedFilteredDeliveryNotes);
    const deliveryNoteGroupCounts = Object.values(groupedFilteredDeliveryNotes).map(arr => arr.length);
    const deliveryNoteItems = Object.values(groupedFilteredDeliveryNotes).reduce((sum, arr) => sum.concat(arr), []);

    const displayAsRow = useMediaQuery(useTheme().breakpoints.down('lg'));

    return (
        <DefaultContainer>

            <TextField
                type="text"
                fullWidth
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Listen durchsuchen"
                InputProps={{
                    startAdornment: <InputAdornment position="start"><Search /></InputAdornment>
                }}
            />
            <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12} lg={6}  >
                    <Paper sx={{ width: '100%' }} className='mt-3'>
                        <Typography align='center' padding={1}>Ladelisten</Typography>
                        <GroupedVirtuoso
                            style={{ height: `calc(calc(100vh - ${TOP_NAV_HEIGHT}px - 56px - 96px) / ${displayAsRow ? 2 : 1})` }}
                            groupCounts={loadingListGroupCounts}
                            groupContent={index => {
                                return ListGroupHeader(groupedLoadingListEntries[index][0])
                            }}
                            itemContent={(index, groupIndex) => LoadingListItem(loadingListItems[index], () => navigate(`/loadingLists/${loadingListItems[index]._id}`))}
                        />
                    </Paper>
                </Grid>
                {
                    (user?.isAdmin || user?.isLager) && (
                        <Grid item xs={12} sm={12} md={12} lg={6}  >

                            <Paper sx={{ width: '100%' }} className='mt-3'>
                                <Typography align='center' padding={1}>Lieferscheine</Typography>
                                <GroupedVirtuoso
                                    style={{ height: `calc(calc(100vh - ${TOP_NAV_HEIGHT}px - 56px - 96px) / ${displayAsRow ? 2 : 1})` }}
                                    groupCounts={deliveryNoteGroupCounts}
                                    groupContent={index => {
                                        return ListGroupHeader(groupedDeliveryNoteEntries[index][0])
                                    }}
                                    itemContent={(index, groupIndex) => DeliveryNoteItem(deliveryNoteItems[index], () => navigate(`/deliveryNotes/${deliveryNoteItems[index]._id}`))}
                                />
                            </Paper>
                        </Grid>
                    )
                }
            </Grid>

        </DefaultContainer>
    );
}

export default AllArchivedListsPage;