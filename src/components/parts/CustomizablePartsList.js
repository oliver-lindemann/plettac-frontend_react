import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material'
import React, { useMemo } from 'react'
import DefaultPartItemsListHeader from './list/DefaultPartItemsListHeader'
import { groupPartsByOrigin } from '../../utils/checklist/ChecklistPartsUtils'

const PartsAmountList = ({ partItems, columnCount, getRow, height }) => {

    const groupedParts = useMemo(() => groupPartsByOrigin(partItems), [partItems]);

    return (
        <TableContainer component={Paper} className="mt-2 mb-5" style={{ height }}>
            <Table>
                <TableBody>
                    {
                        groupedParts?.length > 0
                            ? groupedParts.map((originParts, index) => {

                                const originHeader = <DefaultPartItemsListHeader group={originParts.id} colSpan={columnCount} key={originParts.id} />
                                const partRows = originParts.parts.map((partItem, index) => (
                                    getRow(partItem, originParts.id, index)
                                ))

                                return [originHeader, ...partRows];
                            })
                            : <TableRow><TableCell colSpan={columnCount}>Noch keine Elemente hinzugefügt</TableCell></TableRow>
                    }
                </TableBody>
            </Table >
        </TableContainer >
    )
}

export default PartsAmountList