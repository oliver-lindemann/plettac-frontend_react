import { useState, useEffect } from 'react';
import { Button, CircularProgress, Paper } from '@mui/material';
import { Timeline, TimelineConnector, TimelineContent, TimelineItem, TimelineOppositeContent, TimelineSeparator, timelineOppositeContentClasses } from '@mui/lab';

import ListHistoryEntry from './ListHistoryEntry';
import UserAvatar from '../../../components/utils/UserAvatar';
import CenteredPulseLoader from '../../../components/loading/CenteredPulseLoader';

import dayjs from 'dayjs';
import { Refresh } from '@mui/icons-material';
import { formatDate } from '../../../utils/StringUtils';

const ListHistory = ({ list, getHistory }) => {

    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const refreshHistory = async () => {
        setIsLoading(true);
        try {
            const data = await getHistory();
            const sortedData = data.sort((a, b) => a.date < b.date ? 1 : -1)
            setHistory(sortedData);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        refreshHistory();
        // run once
        // eslint-disable-next-line
    }, []);

    return (
        <>
            <Button
                className='my-2'
                variant='outlined'
                onClick={refreshHistory}
                startIcon={isLoading ? <CircularProgress size={20} /> : <Refresh />}
                disabled={isLoading}
            >
                Aktualisieren
            </Button>

            {
                isLoading
                    ? <CenteredPulseLoader />
                    : (
                        // <Paper elevation={0} className='tableFixHead' style={{ height: 'calc(100vh - 260px)' }}>
                        <Timeline
                            sx={{
                                [`& .${timelineOppositeContentClasses.root}`]: {
                                    flex: 0.2,
                                },
                            }}
                        >
                            {
                                history.map((historyEntry, index) => (
                                    <TimelineItem key={index} sx={{ pl: 0 }}>
                                        <TimelineOppositeContent sx={{ pl: 0 }} style={{ flex: 0.1, minWidth: '120px' }} >
                                            {dayjs(historyEntry.date).format('dd, DD.MM.YY HH:mm')}
                                        </TimelineOppositeContent>
                                        <TimelineSeparator>
                                            <UserAvatar userId={historyEntry.user} size='small' />
                                            <TimelineConnector />
                                        </TimelineSeparator>
                                        <TimelineContent>
                                            <ListHistoryEntry historyEntry={historyEntry} />
                                        </TimelineContent>
                                    </TimelineItem>
                                )
                                )
                            }
                        </Timeline>
                        // </Paper>
                    )
            }
            Erstellt am: {formatDate(list.dateOfCreation)} von {list.author?.name || list.author?.username}
        </>
    )
}

export default ListHistory