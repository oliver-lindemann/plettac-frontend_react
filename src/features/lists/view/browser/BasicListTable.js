import { useState } from 'react';
import BasicListItem from './BasicListItem'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const texts = {
    deliveryNotes: {
        noOpenLists: ''
    },
    loadingLists: {
        noOpenLists: ''
    }
}

const BasicListTable = ({ lists, variant, customHead, customCell, isLoading, updateList }) => {

    return (
        <TableContainer component={Paper} className="">
            <Table>
                <TableHead style={{ backgroundColor: '#212529' }}>
                    <TableRow >
                        <TableCell padding="none" align="center" className="p-2" style={{ color: 'white' }}><b>Von</b></TableCell>
                        {customHead}
                        <TableCell padding="none" align='center' className="p-2" style={{ color: 'white' }}><b>Status</b></TableCell>
                        <TableCell padding="none" className="p-2 ps-3" style={{ color: 'white' }}></TableCell>
                        <TableCell padding="none" className="p-2 ps-3" style={{ color: 'white' }}><b>Datum</b></TableCell>
                        <TableCell padding="none" className="p-2 ps-3" style={{ color: 'white' }}></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        lists.length > 0
                            ? (lists.map((list, index) =>
                                <BasicListItem
                                    key={index}
                                    list={list}
                                    customCell={customCell}
                                    isLoading={isLoading}
                                    updateList={updateList}
                                />
                            ))
                            : (<TableRow><TableCell colSpan="7">Es gibt momentan keine offenen Ladelisten.</TableCell></TableRow>)
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default BasicListTable