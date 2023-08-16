import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'
import { TYPES } from '../../../config/timeRecords'

const TimeRangeType = ({ timeRangeType, handleTypeChanged }) => {

    return (
        <FormControl className="p-3">
            <FormLabel id="workTypeRadioGroup">Arbeitsform</FormLabel>
            <RadioGroup
                name="workType"
                value={timeRangeType}
                onChange={handleTypeChanged}
            >
                <FormControlLabel value={TYPES.HOF} control={<Radio />} label="Hof (HOF)" />
                <FormControlLabel value={TYPES.BST} control={<Radio />} label="Baustelle (BST)" />
                <FormControlLabel value={TYPES.FAZ} control={<Radio />} label="Fahrzeit (FAZ)" />
            </RadioGroup>
        </FormControl>
    )
}

export default TimeRangeType