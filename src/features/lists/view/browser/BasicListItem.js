import { useNavigate } from "react-router-dom";

import CenteredPulseLoader from "../../../../components/loading/CenteredPulseLoader";

import { LockOutlined } from "@mui/icons-material";
import { Box, Button, Chip, CircularProgress, TableCell, TableRow, Tooltip, Typography } from "@mui/material";
import { Spinner } from "react-bootstrap";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import UserAvatar from "../../../../components/utils/UserAvatar";
import CHECKLIST_STATUS_PART from "../../../../config/checklistPartStatus";
import { LIST_STATUS_ICONS_DESKTOP } from "../../../../config/list";
import { TRAILERS, VEHICLES } from "../../../../config/vehicles";
import useAuth from "../../../../hooks/auth/useAuth";
import { formatNumber, formatWeight } from "../../../../utils/NumberUtils";
import { formatDate } from "../../../../utils/StringUtils";
import { getWeightSumOf } from '../../../../utils/checklist/ChecklistPartsUtils';
import VehicleSelect from "../../editableContent/VehicleSelect";

const LOCKED = <Chip size="small" sx={{ bgcolor: '#fae17d' }} icon={<LockOutlined />} label='Gesperrt' />;
const deployIcons = {
    'true': <MdOutlineVisibility color="#487d32" size={25} />,
    'false': <MdOutlineVisibilityOff color="#d32f2f" size={25} />,
}

function getIconOfStatus(status) {
    return LIST_STATUS_ICONS_DESKTOP[status];
}

function CircularProgressWithLabel(props) {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" {...props} /*color="inherit"*/ />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="caption" color="text.secondary">
                    {`${Math.round(props.value)}%`}
                </Typography>
            </Box>
        </Box>
    );
}

function BasicListItem({ loadingList, isDeploying, handleDeployLoadingList, handleChangeVehicle }) {

    const navigate = useNavigate();
    const { user } = useAuth();

    if (!loadingList) {
        return <CenteredPulseLoader />
    }

    // Check if this loadingList gets deployed/edited
    const isLoading = isDeploying === loadingList;
    const loadingListIcon = loadingList.locked
        ? LOCKED
        : getIconOfStatus(loadingList.status);

    const deployIcon = user?.isAdmin ? (
        <Tooltip title={`Für das Lager ${loadingList.deployed ? 'verstecken' : 'freischalten'}`}>
            <span>
                <Button
                    onClick={() => handleDeployLoadingList(loadingList)}
                    disabled={isLoading}
                >
                    {isLoading ? <Spinner size='sm' /> : deployIcons[loadingList.deployed]}
                </Button>
            </span>
        </Tooltip>
    ) : null;

    const handleViewLoadingList = () => navigate(`/loadingLists/${loadingList.id}`);


    const vehicle = [...VEHICLES, ...TRAILERS].find(vehicle => vehicle.name === loadingList.vehicle) || { name: '/' };

    const items = [].concat(loadingList.parts).concat(loadingList.customParts).filter(value => !!value && value.status !== CHECKLIST_STATUS_PART.deleted);
    const totalProgress = items.reduce((sum, value) => (sum + ((value.loaded || 0) * (value.part?.weight || 0))), 0);

    console.log(items);

    return (
        <>
            <TableRow style={{ backgroundColor: loadingList?.deployed ? '' : '#f5f5f5' }}>
                <TableCell padding="normal" align="center" >
                    <UserAvatar userId={loadingList.author?._id} size='normal' />
                </TableCell>
                <TableCell padding="none" className="px-3 col-5" onClick={handleViewLoadingList}>
                    <Typography variant="body1">
                        {loadingList.constructionProject}
                    </Typography>
                </TableCell>
                <TableCell padding="none" align="center" className="px-3 col-2" >
                    {
                        user?.isAdmin
                            ? (
                                <VehicleSelect
                                    vehicle={loadingList.vehicle}
                                    onVehicleChanged={newVehicle => handleChangeVehicle(loadingList, newVehicle)}
                                    size='small'
                                    disabled={isLoading}
                                />
                            ) : (<div className="d-flex gap-2 justify-content-center align-items-center">
                                <Chip
                                    size='small'
                                    style={{ backgroundColor: vehicle.color || '#fff', color: vehicle.fontColor, border: vehicle.border }}
                                />
                                {loadingList.vehicle}
                            </div>)
                    }
                </TableCell>
                <TableCell padding="none" align="center" className="px-3">
                    {loadingListIcon}
                </TableCell>
                <TableCell padding="none" className="col-1 px-3" onClick={handleViewLoadingList}>
                    <Tooltip title={`${formatNumber(totalProgress)} kg / ${formatWeight(getWeightSumOf(items))} geladen`}>
                        <span>
                            <CircularProgressWithLabel value={(totalProgress / getWeightSumOf(items)) * 100} />
                        </span>
                    </Tooltip>
                </TableCell>
                <TableCell padding="none" className="px-3" align="center" onClick={handleViewLoadingList}>
                    {formatDate(loadingList.createdAt)}
                </TableCell>
                <TableCell padding="none" align="center" className="px-3 col-1">
                    {deployIcon}
                </TableCell>
            </TableRow>
        </>
    );
}

export default BasicListItem;