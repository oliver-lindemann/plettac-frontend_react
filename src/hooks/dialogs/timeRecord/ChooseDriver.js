import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'
import UserAvatar from '../../../components/utils/UserAvatar'
import { DoNotDisturbAltOutlined } from '@mui/icons-material'

const ChooseDriver = ({ possibleDrivers, driver, handleDriverChanged }) => {

    return (
        <FormControl className="p-3">
            <FormLabel id="driver">Fahrer</FormLabel>
            <RadioGroup
                name="driverSelect"
                value={driver}
                onChange={handleDriverChanged}
            >
                <FormControlLabel key={'noDriver'} value={''} control={<Radio />} label={<DoNotDisturbAltOutlined />} />
                {possibleDrivers?.map((driver, index) => <FormControlLabel key={index} value={driver} control={<Radio />} label={<UserAvatar userId={driver} size='small' />} />)}
            </RadioGroup>
        </FormControl>
    )
}

export default ChooseDriver