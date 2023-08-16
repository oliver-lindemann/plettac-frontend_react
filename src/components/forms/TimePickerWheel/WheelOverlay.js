import { CONTAINER_HEIGHT, ITEM_MAX_HEIGHT } from './PickerWheelConstants'

const UnselectedOverlay = ({ bottom }) => {
    return (
        <div
            style={{
                height: 2 * ITEM_MAX_HEIGHT,
                backgroundColor: 'rgba(25, 118, 210, 12%)',
                // background: `linear-gradient(${bottom ? 0 : 180}deg, rgba(25, 118, 210, 15%) 25%, rgba(255,255,255,50%) 100%)`,
                pointerEvents: 'none'
            }}
        />
    );
}

const WheelOverlay = () => {
    return (
        <div
            style={{
                position: 'sticky',
                marginTop: -CONTAINER_HEIGHT,
                top: 0,
                right: 0,
                left: 0,
                pointerEvents: 'none',
            }}
        >

            <UnselectedOverlay />
            <div
                style={{
                    height: ITEM_MAX_HEIGHT,
                    // backgroundColor: 'rgba(61, 139, 217, 50%)',
                    border: '1px solid rgba(61, 139, 217, 30%)',
                    borderLeft: 0,
                    borderRight: 0,
                    pointerEvents: 'none'
                }}
            />
            <UnselectedOverlay bottom />
        </div>
    )
}

export default WheelOverlay