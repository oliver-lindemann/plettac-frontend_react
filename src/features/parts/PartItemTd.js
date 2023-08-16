import { TableCell } from "@mui/material"
import PartItem from "./PartItem"

const PartItemTd = (props) => {
    return (
        <TableCell
            className="p-0"
            style={{ ...props.style, verticalAlign: 'middle' }}
        >
            <PartItem {...props} />
        </TableCell>
    )
}

export default PartItemTd