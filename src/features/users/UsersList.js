import { InputAdornment, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useSWRConfig } from "swr";
import {
    deleteUser,
    usersUrlEndpoint as cacheKey
} from "../../app/api/usersApi";
import { useConfirmDialog } from "../../hooks/dialogs/useConfirm";

import UserListItem from "./UserListItem";
import { useSnackbar } from "notistack";
import { Search } from "@mui/icons-material";
import { useState } from "react";
import { removeWhitespace } from "../../utils/StringUtils";

function UsersList({ users }) {

    const { mutate } = useSWRConfig();
    const { enqueueSnackbar } = useSnackbar();

    const navigate = useNavigate();
    const handleEditUser = (user) => navigate(`/users/${user._id}`);

    const [openDialog, DialogComponent] = useConfirmDialog();
    const [searchQuery, setSearchQuery] = useState('');
    const searchValues = searchQuery.toLowerCase().split(' ');
    const filteredUsers = users?.filter(user => searchValues.every(searchValue => removeWhitespace(JSON.stringify(user)).toLowerCase().includes(searchValue))) || [];



    const handleDeleteUser = (user) => {

        const onConfirm = async () => {
            try {
                const result = await deleteUser(user._id);
                mutate(cacheKey);
                enqueueSnackbar(`Benutzer ${user.name} gelöscht.`, { variant: 'success' });
            } catch (err) {
                Swal.fire({
                    title: "Fehler beim Löschen des Benutzers",
                    text: err.message,
                    icon: 'error'
                });
            }
        }

        openDialog({
            title: "Benutzer löschen?",
            content: `Möchtest du den Benutzer '${user.name}' wirklich löschen?`,
            onConfirm: onConfirm,
        });

    }

    return (
        <>

            <TextField
                type="text"
                fullWidth
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Kunden durchsuchen"
                InputProps={{
                    startAdornment: <InputAdornment position="start"><Search /></InputAdornment>
                }}
            />

            <TableContainer component={Paper} className="mt-3 mb-5">
                <Table>
                    <TableHead style={{ backgroundColor: '#212529' }}>
                        <TableRow>
                            <TableCell padding="none" className='p-2 ps-3 ' style={{ color: 'white' }}><b>Benutzer</b></TableCell>
                            <TableCell padding="none" className='p-2 ps-3 ' style={{ color: 'white' }}><b>Berechtigungen</b></TableCell>
                            <TableCell padding="none" className='p-2 ps-3 '></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            filteredUsers.length > 0
                                ? (filteredUsers.map(user => {
                                    return <UserListItem
                                        user={user}
                                        handleEditUser={handleEditUser}
                                        handleDeleteUser={handleDeleteUser}
                                        key={user._id}
                                    />
                                }))
                                : (<TableRow><TableCell colSpan="3">Noch keine Benutzer vorhanden!</TableCell></TableRow>)
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            {DialogComponent}
        </>
    );
}

export default UsersList;