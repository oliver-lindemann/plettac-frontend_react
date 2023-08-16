import { useState, useMemo } from 'react';
import { BrowserView, isBrowser, isTablet } from 'react-device-detect';
import { GroupedVirtuoso } from 'react-virtuoso';

import { Autocomplete, IconButton, Paper, TextField, Tooltip } from '@mui/material';
import { OpenInNewOutlined } from '@mui/icons-material';

import { LIST_PART_STATUS } from '../../config/list';
import { sortChecklistPartsByOrderIndex } from '../../utils/checklist/ChecklistPartsUtils';
import { removeWhitespace, toCapitalCase } from '../../utils/StringUtils';

import PartItem from '../../features/parts/PartItem';
import PartsAmountList from './PartsAmountList';
import AddPartsDialog from './AddPartsDialog';

import { useAmountDialog } from '../../hooks/dialogs/useAmount';
import { useConfirmDialog } from '../../hooks/dialogs/useConfirm';
import { getGroupAsString } from './list/DefaultPartItemsListHeader';

const filterOptions = (options, { inputValue }) => {
    const searchValues = inputValue.toLowerCase().split(' ');
    return options.filter(part => searchValues.every(searchValue => removeWhitespace(JSON.stringify(part)).toLowerCase().includes(searchValue)))
}

const VirtualizedList = (listboxProps, options) => {
    const { children, ...otherProps } = listboxProps;

    const allChilds = [];
    const groupCounts = children.map(child => {
        const { children: data } = child.props;
        const items = data[1].props.children;

        items.forEach(c => allChilds.push(c));
        return items.length;
    })

    // do not pass css styling to GroupedVirtuoso
    delete otherProps.className;

    return (
        <Paper sx={{ height: '400px' }}>
            <GroupedVirtuoso
                {...otherProps}
                groupCounts={groupCounts}
                groupContent={(index) => children[index].props.children[0]}
                itemContent={(index, groupIndex) => allChilds[index]}
            />
        </Paper>
    );
}

const renderGroupHeader = (props) => (
    <li key={props.key} style={{ listStyle: 'none' }}>
        <div
            style={{ backgroundColor: '#212529', color: '#fff' }}
            className='p-1 ps-2 font-monospace fw-bold'
        >
            {getGroupAsString(props.group)}
        </div>
        <ul style={{ listStyle: 'none' }}>{props.children}</ul>
    </li>
);

const renderListItem = (props, option) => (
    <li
        {...props}
        key={props.key}
        style={{ cursor: 'pointer', listStyle: 'none' }}
        className='virtualizedListItem'
    >
        <PartItem part={option} onClick={() => { }} />
    </li>
);

const getCustomPartOptionLabel = (option) => {
    if (typeof option === 'string') {
        return option;
    }
    if (option.inputValue) {
        return option.inputValue;
    }
    return option.name
};

const getCustomPartFilterOptions = (options, params) => {
    const filtered = filterOptions(options, params);

    if (params.inputValue !== '') {
        filtered.push({
            inputValue: params.inputValue,
            origin: 'CUSTOM',
            name: `${params.inputValue} neu erstellen`
        })
    }
    return filtered;
};

const AddablePartsList = ({ parts, partsList, setPartsList, customParts, customPartsList = [], setCustomPartsList = () => { }, mergeDuplicates, draft }) => {

    const [inputValue, setInputValue] = useState(null);
    const [dialogIsOpen, setDialogIsOpen] = useState(false);

    const [openAmountDialog, AmountDialogComponent] = useAmountDialog();
    const [openConfirmDialog, ConfirmDialogComponent] = useConfirmDialog();

    const addPartToList = async (part, list, setList) => {
        // Clear Autocomplete Textfield
        setInputValue(null);
        if (!part) {
            return;
        }

        if (mergeDuplicates) {
            // Check if the entered part is contained in the list
            const partAlreadyContained = list.some(partItem => partItem.part._id === part._id)
            if (partAlreadyContained) {
                // Dieses Element existiert bereits in der Tabelle. 
                // Dialog anzeigen und Eingabefeld zurücksetzen

                const onConfirmMergeDuplicate = () => {
                    const onConfirmAmount = (inputValue) => {
                        if (inputValue > 0) {
                            setList(oldParts => {
                                const updatedParts = oldParts.map(item => {
                                    if (item.part._id === part._id) {
                                        // Add input value (as number: +) to amount
                                        item.amount = +item.amount + +inputValue;
                                        item.status = (draft && item.status !== LIST_PART_STATUS.added)
                                            ? LIST_PART_STATUS.modified
                                            : item.status;
                                    }
                                    return item;
                                })
                                return updatedParts;
                            })
                        }
                    }

                    openAmountDialog({
                        title: "Benötigte Anzahl",
                        part: part,
                        onConfirm: onConfirmAmount,
                    });
                }

                openConfirmDialog({
                    title: 'Bauteil bereits vorhanden',
                    content: (
                        <div>
                            Soll das folgende Bauteil erneut hinzugefügt werden?
                            <PartItem part={part} />
                        </div>
                    ),
                    onConfirm: onConfirmMergeDuplicate
                });

                return;
            }
        }

        // Die benötigte Anzahl von dem eingegebenen / ausgewählten
        // Element abfragen über einen Dialog
        const onConfirm = (inputValue) => {
            if (inputValue > 0) {
                setList(oldList => {
                    const ordererdChecklistParts = sortChecklistPartsByOrderIndex([...oldList, {
                        part,
                        amount: inputValue,
                        status: draft ? LIST_PART_STATUS.added : ''
                    }]);
                    return ordererdChecklistParts
                });
            }
        }

        openAmountDialog({
            title: "Benötigte Anzahl?",
            part: part,
            onConfirm: onConfirm,
        });
    }

    const closeDialog = () => setDialogIsOpen(false);
    const handleAddNewPart = async (part) => addPartToList(part, partsList, setPartsList);
    const handleAddCustomPart = async (inputValue) => {
        // Clear Autocomplete Textfield
        setInputValue(null);
        if (!inputValue) {
            return;
        }

        const part = {
            _id: 'CUSTOM_' + inputValue.inputValue,
            name: inputValue.inputValue,
            origin: 'CUSTOM'
        }

        addPartToList(part, customPartsList, setCustomPartsList);
    }


    const handleAmountChangedParts = (part, amount) => {
        if (!part) return;
        handleAmountChanged(part._id, amount, part.origin === 'CUSTOM' ? setCustomPartsList : setPartsList);
    }

    const handleAmountChanged = (partId, amount, setNewList) => {
        setNewList((currentPartsList) => {
            return currentPartsList.map(item => {
                if (partId === item.part._id) {
                    item.amount = amount;
                    item.status = (draft && item.status !== LIST_PART_STATUS.added)
                        ? LIST_PART_STATUS.modified
                        : item.status;
                }
                return item;
            });
        });
    }

    const handleItemDeletedParts = (part) => {
        if (!part) return;
        handleItemDeleted(part._id, part.origin === 'CUSTOM' ? setCustomPartsList : setPartsList);
    }

    const handleItemDeleted = (partId, setNewList) => {
        setNewList(currentPartsList => {
            const itemToDelete = currentPartsList.find(item => item.part._id === partId);
            if (draft && itemToDelete?.status !== LIST_PART_STATUS.added) {
                return currentPartsList.map(item => {
                    if (item.part._id === partId) {
                        item.status = draft
                            ? LIST_PART_STATUS.deleted
                            : '';
                    }
                    return item;
                });
            } else {
                // Remove Item with the current Item-Id from the checklist Parts Array
                return currentPartsList.filter(item => !(item.part._id === partId));
            }
        });
    }

    const onOpenAddPartsDialog = () => {
        setDialogIsOpen(true);
    }

    const SearchField = useMemo(() => (
        <div className='d-flex gap-1 align-items-center'>

            {/* Falls eigene Elemente hinzugefügt werden dürfen, */}
            <Autocomplete
                fullWidth
                freeSolo={!!customParts}
                handleHomeEndKeys={!!customParts}
                selectOnFocus
                clearOnBlur

                options={parts || ['Lade Elemente...']}
                groupBy={(option) => option.origin}
                getOptionLabel={customParts ? getCustomPartOptionLabel : (option) => option.name}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                filterOptions={customParts ? getCustomPartFilterOptions : filterOptions}

                // sx={{ width: 300 }}
                value={inputValue}
                disabled={!parts || parts.length <= 0}
                onChange={(event, value) => (
                    customParts
                        ? (value.inputValue ? handleAddCustomPart(value) : handleAddNewPart(value))
                        : handleAddNewPart(value)
                )}
                ListboxComponent={VirtualizedList}
                renderOption={renderListItem}
                renderGroup={renderGroupHeader}
                renderInput={(params) => <TextField {...params} label="Wähle/Suche ein Bauteil aus..." />}
            />
            {
                (isBrowser || isTablet) && (
                    <Tooltip title='Als Vollbildschirm öffnen'>
                        <IconButton onClick={onOpenAddPartsDialog}>
                            <OpenInNewOutlined />
                        </IconButton>
                    </Tooltip>
                )
            }
        </div>
        // eslint-disable-next-line
    ), [parts, inputValue]);

    const PartsList = useMemo(() => (
        <PartsAmountList
            checklistParts={[...partsList, ...customPartsList]}
            onAmountChanged={handleAmountChangedParts}
            onItemDeleted={handleItemDeletedParts}
        />
        // eslint-disable-next-line
    ), [partsList, customPartsList]);

    return (
        <>
            {ConfirmDialogComponent}
            {AmountDialogComponent}

            {
                dialogIsOpen && (
                    <AddPartsDialog
                        isOpen={dialogIsOpen}
                        closeDialog={closeDialog}

                        parts={parts}
                        partsList={partsList}
                        customPartsList={customPartsList}

                        handleAddNewPart={handleAddNewPart}
                        handleAddCustomPart={handleAddCustomPart}

                        handleAmountChangedParts={handleAmountChangedParts}
                        handleItemDeletedParts={handleItemDeletedParts}
                    />
                )
            }

            {SearchField}

            {PartsList}
        </>
    )
}

export default AddablePartsList