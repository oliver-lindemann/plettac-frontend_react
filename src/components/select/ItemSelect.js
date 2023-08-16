import { Autocomplete, Paper } from '@mui/material';
import { forwardRef } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { removeWhitespace } from '../../utils/StringUtils';

const filterOptions = (options, { inputValue }) => {
    const searchValues = inputValue.toLowerCase().split(' ');
    return options.filter(option => searchValues.every(searchValue => removeWhitespace(JSON.stringify(option)).toLowerCase().includes(searchValue)))
}

const VirtualizedList = forwardRef((listboxProps, ref) => {
    const { children, ...otherProps } = listboxProps;

    const itemData = [];
    children.forEach((item) => {
        itemData.push(item);
        itemData.push(...(item.children || []));
    });

    delete otherProps.className;

    return (
        <Paper sx={{ height: '400px' }} ref={ref}>
            <Virtuoso
                {...otherProps}
                data={itemData}
                itemContent={(index, item) => item}
            />
        </Paper>
    );
})

const ItemSelect = (props) => {

    const { options, value, getOptionLabel, renderListItem, isOptionEqualToValue, onChange, renderInput, ...otherProps } = props;

    return (
        <Autocomplete
            {...otherProps}

            fullWidth

            options={options || ['Lade Elemente...']}
            getOptionLabel={getOptionLabel}
            isOptionEqualToValue={isOptionEqualToValue}
            filterOptions={filterOptions}

            value={value || null}
            // disabled={!options || options.length <= 0}
            onChange={onChange}
            ListboxComponent={VirtualizedList}
            renderOption={renderListItem}
            renderInput={renderInput}
        />
    )
}

export default ItemSelect