import LoadPartListItem from './LoadPartListItem';
import CustomizablePartsList from '../CustomizablePartsList';

const LoadPartsList = ({ listParts, onLoading, onLoadItem, height = '75vh' }) => {
    return (
        <CustomizablePartsList
            partItems={listParts}
            getRow={(partItem, origin, index) => (
                <LoadPartListItem
                    key={index}
                    partItem={partItem}
                    onLoading={onLoading}
                    onLoadItem={onLoadItem}
                />
            )}
            height={height}
            columnCount={4}
        />
    )
}

export default LoadPartsList