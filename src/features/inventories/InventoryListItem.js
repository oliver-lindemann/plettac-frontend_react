import {
  Button,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { formatDate } from "../../utils/StringUtils";
import { DeleteOutline } from "@mui/icons-material";
import AuthComponent from "../../components/auth/AuthComponent";
import { ROLES } from "../../config/roles";

function InventoryListItem({
  inventory,
  handleEditInventory,
  handleDeleteInventory,
}) {
  const onClick = () => handleEditInventory(inventory);
  const onDelete = () => handleDeleteInventory(inventory);

  let deleteColumnContent = (
    <TableCell padding="none" className="col-1 centertext" align="center">
      <Tooltip title="Löschen">
        <Button color="error" variant="outlined" onClick={onDelete}>
          <DeleteOutline />
        </Button>
      </Tooltip>
    </TableCell>
  );

  return (
    <TableRow className="container m-0 p-0">
      <TableCell padding="normal" className="col clickable" onClick={onClick}>
        <Typography variant="body1">{inventory.name}</Typography>
        <Typography variant="body2">
          {inventory.assignedUsers?.map((user) => user.name).join(", ")}
        </Typography>
      </TableCell>
      <TableCell padding="normal" className="col-4 clickable" onClick={onClick}>
        {formatDate(inventory.date)}
      </TableCell>
      <AuthComponent requiredRoles={[ROLES.Admin]}>
        {deleteColumnContent}
      </AuthComponent>
    </TableRow>
  );
}

export default InventoryListItem;
