import { Autocomplete, Paper, TextField } from '@mui/material';
import React, { useState } from 'react'
import { GroupedVirtuoso } from 'react-virtuoso';
import { removeWhitespace } from '../../utils/StringUtils';
import { getGroupAsString } from '../parts/list/DefaultPartItemsListHeader';



const filterOptions = (options, { inputValue }) => {
    const searchValues = inputValue.toLowerCase().split(' ');
    return options.filter(option => searchValues.every(searchValue => removeWhitespace(JSON.stringify(option)).toLowerCase().includes(searchValue)))
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

// const renderGroupHeader = (props) => (
//     <li key={props.key} style={{ listStyle: 'none' }}>
//         <div
//             style={{ backgroundColor: '#212529', color: '#fff' }}
//             className='p-1 ps-2 font-monospace fw-bold'
//         >
//             {getGroupAsString(props.group)}
//         </div>
//         <ul style={{ listStyle: 'none' }}>{props.children}</ul>
//     </li>
// );

// const renderListItem = (props, option) => (
//     <li {...props} key={props.key} style={{ cursor: 'pointer', listStyle: 'none' }}>
//         <PartItem part={option} onClick={() => { }} />
//     </li>
// );



const ItemSelect = ({ options, groupBy, getOptionLabel, renderListItem, renderGroupHeader, isOptionEqualToValue, onChange, placeholder }) => {

    const [inputValue, setInputValue] = useState(null);

    return (
        <Autocomplete
            fullWidth
            handleHomeEndKeys
            selectOnFocus

            options={options || ['Lade Elemente...']}
            groupBy={groupBy}
            getOptionLabel={getOptionLabel}
            isOptionEqualToValue={isOptionEqualToValue}
            filterOptions={filterOptions}

            // sx={{ width: 300 }}
            value={inputValue}
            disabled={!options || options.length <= 0}
            onChange={onChange}
            ListboxComponent={VirtualizedList}
            renderOption={renderListItem}
            renderGroup={renderGroupHeader}
            renderInput={(params) => <TextField {...params} label={placeholder} />}
        />
    )
}

export default ItemSelect