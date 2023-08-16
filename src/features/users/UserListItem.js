import { TableCell, TableRow, Typography } from "@mui/material";
import { Button } from "react-bootstrap";
import { BsTrash } from 'react-icons/bs'

function UserListItem({ user, handleEditUser, handleDeleteUser }) {

    const onClick = () => handleEditUser(user);
    const onDelete = () => handleDeleteUser(user);

    let deleteColumnContent = user.username === 'admin'
        ? (<TableCell padding="normal" className="col-1" onClick={onClick} />)
        : (
            <TableCell padding="normal" className="col-1 centertext">
                <Button
                    variant='outline-danger'
                    onClick={onDelete}
                >
                    <BsTrash size="1.5em" />
                </Button>
            </TableCell>
        );

    return (
        < TableRow className="container m-0 p-0 " >
            <TableCell padding="normal" className="col clickable" onClick={onClick}>
                <Typography variant="body1">{user.name}</Typography>
                <Typography variant="body2">
                    {user.username}
                </Typography>
            </TableCell>
            <TableCell padding="normal" className="col-4 clickable" onClick={onClick}>
                {user.roles.toString().replaceAll(',', ', ')}
            </TableCell>
            {deleteColumnContent}
        </TableRow >
    );
}

export default UserListItem;