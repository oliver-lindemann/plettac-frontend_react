import { ArchiveOutlined, HourglassEmptyRounded, PendingOutlined, TaskAltOutlined } from "@mui/icons-material";
import { Chip } from "@mui/material";
import { BsArchive, BsCheckCircle, BsCircle, BsCircleHalf } from "react-icons/bs";

export const LIST_STATUS = {
    OPEN: 'OPEN',
    IN_PROGRESS: 'IN_PROGRESS',
    DONE: 'DONE',
    ARCHIVED: 'ARCHIVED'
}

export const LIST_STATUS_LANG = {
    OPEN: 'Offen',
    IN_PROGRESS: 'In Bearbeitung',
    DONE: 'Erledigt',
    ARCHIVED: 'Archiviert'
}

export const LIST_STATUS_ICONS_MOBILE = {
    OPEN: <BsCircle size={25} />,
    IN_PROGRESS: <BsCircleHalf size={25} />,
    DONE: <BsCheckCircle size={25} />,
    ARCHIVED: <BsArchive size={25} />
}

export const LIST_STATUS_ICONS_DESKTOP = {
    OPEN: <Chip size="small" icon={<HourglassEmptyRounded />} label='Offen' />,
    IN_PROGRESS: <Chip size="small" sx={{ bgcolor: '#ddf1ff' }} icon={<PendingOutlined />} label='In Bearbeitung' />,
    DONE: <Chip size="small" sx={{ bgcolor: '#d7f5dd' }} icon={<TaskAltOutlined />} label='Fertig' />,
    ARCHIVED: <Chip size="small" icon={<ArchiveOutlined />} label='Archiviert' />
}


export const LIST_PART_STATUS = {
    added: 'added',
    modified: 'modified',
    deleted: 'deleted'
};

export const LIST_PART_STATUS_COLOR = {
    added: '#198754',
    modified: '#ffc107',
    deleted: '#dc3545'
}

export const SHARE_PERMISSIONS = {
    VIEW: 'view',
    EDIT: 'edit',
    LOAD: 'load'
}