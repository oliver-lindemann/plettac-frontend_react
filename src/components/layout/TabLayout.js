import { useState } from 'react';
import { Tab, Tabs } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { TOP_NAV_HEIGHT } from '../../features/navigation/TopNav';

export const TAB_HEIGHT = 48;
const TabLayout = ({ tabTitles, tabContents, unmount }) => {

    const [searchParams] = useSearchParams();
    const [tabIndex, setTabIndex] = useState(+(searchParams?.get('tabIndex') || 0));
    const handleTabIndexChanged = (event, newValue) => setTabIndex(newValue);

    return (
        <>
            <Tabs
                value={tabIndex}
                onChange={handleTabIndexChanged}
                style={{ position: 'sticky', zIndex: 100, top: TOP_NAV_HEIGHT, backgroundColor: '#fff' }}
                variant='scrollable'
                scrollButtons='auto'
            >
                {tabTitles?.map((title, index) => <Tab value={index} label={title} key={index} />)}
            </Tabs>
            {
                // In einigen Fällen kommt es vor, dass der Inhalt der einzelnen Tabs unmounted werden sollen,
                // sodass sie nicht mehr gerendert werden und neu gerendert werden, wenn sie wieder angezeigt werden sollen.
                // Bspw. beim BottomDrawer wird zwar der Content versteckt, der Puller bleibt aber sichtbar, auch wenn der Tab
                // nicht angezeigt wird. Dies kann gelöst werden, indem die gesamte Komponente nicht mehr gerendert wird
                // und damit auch nicht der BottomDrawer
                !!unmount
                    ? (tabContents?.length > 0 ? tabContents[tabIndex] : null)
                    : (tabContents.map((tab, index) => <div key={index} hidden={index !== tabIndex}>{tab}</div>))
            }
        </>
    )
}

export default TabLayout