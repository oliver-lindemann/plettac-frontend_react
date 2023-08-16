import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';

import changelogUrl from '../resources/changelog.md';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import DefaultContainer from '../components/layout/DefaultContainer';
import Breadcrumbs from '../components/layout/Breadcrumbs';

const ChangelogView = () => {
    const [changelog, setChangelog] = useState(null);

    const fetchChangelog = async () => {
        const changelogRaw = await fetch(changelogUrl);
        setChangelog(await changelogRaw.text());
    }

    useEffect(() => { fetchChangelog() }, []);

    return (
        <DefaultContainer>
            <Breadcrumbs
                currentLocation='Was ist neu?'
                pathElements={[{ name: 'Mehr...', url: '/more' }]}
            />

            <ReactMarkdown children={changelog} />
        </DefaultContainer>
    );
}

export default ChangelogView