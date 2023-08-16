import { TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { Table } from 'react-bootstrap';

const WEEKDAYS = ['Mo.', 'Di.', 'Mi.', 'Do.', 'Fr.', 'Sa.'];

const TimeTrackingTable = ({ timeTracking, onUpdateTimeTracking, title, subtitle, season, disabled }) => {
    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell colSpan={5} align="center">
                            <Typography variant="h6">{title}</Typography>
                            <Typography variant="subtitle2">{subtitle}</Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell></TableCell>
                        {WEEKDAYS.map((day, index) => <TableCell sx={{ width: '13.5%' }} key={index} align="center">{day}</TableCell>)}
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>AZ (Std.)</TableCell>
                        {
                            WEEKDAYS.map((_, index) => (
                                <TableCell key={index} align="center">
                                    <TextField
                                        type="number"
                                        value={timeTracking[season].workingHours[index]}
                                        onChange={event => (
                                            onUpdateTimeTracking(timeTracking => {
                                                const updatedTimeTracking = {
                                                    ...timeTracking
                                                }
                                                updatedTimeTracking[season].workingHours[index] = event.target.value;
                                                return updatedTimeTracking;
                                            })
                                        )}
                                        disabled={disabled}
                                    />
                                </TableCell>
                            ))
                        }
                    </TableRow>
                    <TableRow>
                        <TableCell>Pause (Std.)</TableCell>
                        {
                            WEEKDAYS.map((_, index) => (
                                <TableCell key={index} align="center">
                                    <TextField
                                        type="number"
                                        value={timeTracking[season].breakTimes[index]}
                                        onChange={event => (
                                            onUpdateTimeTracking(timeTracking => {
                                                const updatedTimeTracking = {
                                                    ...timeTracking
                                                }
                                                updatedTimeTracking[season].breakTimes[index] = event.target.value;
                                                return updatedTimeTracking;
                                            })
                                        )}
                                        disabled={disabled}
                                    />
                                </TableCell>
                            ))
                        }
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default TimeTrackingTable