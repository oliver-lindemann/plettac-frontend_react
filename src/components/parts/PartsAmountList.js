import CustomPartsListItem from './list/CustomPartsListItem'
import CustomizablePartsList from './CustomizablePartsList'

const PartsAmountList = ({ checklistParts, onAmountChanged, onItemDeleted, height = '70vh' }) => {
    return (
        <CustomizablePartsList
            partItems={checklistParts}
            getRow={(partItem, origin, index) =>
                <CustomPartsListItem
                    part={partItem.part}
                    amount={partItem.amount}
                    status={partItem.status}
                    onAmountChanged={(part, amount) => onAmountChanged(part, amount)}
                    onItemDeleted={(part) => onItemDeleted(part)}
                    key={partItem._id + "_" + index}
                />
            }
            height={height}
        />

    )
}

export default PartsAmountList