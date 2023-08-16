import { useRef, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import useAuth from '../../hooks/auth/useAuth';
import useUser from '../../hooks/users/useUser';
import useInfoDialog from '../../hooks/dialogs/useInfoDialog';

import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { updateUser } from '../../app/api/usersApi';

import changelogUrl from '../../resources/changelog.md';

const Changelog = () => {
    const { user } = useAuth();
    const {
        user: currentUser,
        mutate
    } = useUser(user?.id);
    const effectRan = useRef(false);

    const [openDialog, Dialog] = useInfoDialog();

    const checkForNewVersion = async () => {
        const currentVersion = process.env.REACT_APP_VERSION;
        const lastShownVersion = currentUser.notifiedVersion;

        console.log("Check for Version: ", currentVersion + " <> " + lastShownVersion);
        if (currentVersion === lastShownVersion) {
            return;
        }

        const changelogRaw = await fetch(changelogUrl);
        const changelog = await changelogRaw.text();

        console.log(changelog);

        openDialog({
            title: 'Was ist neu?',
            content: (<ReactMarkdown children={changelog} />)
        });

        const updatedUser = {
            ...currentUser,
            notifiedVersion: currentVersion
        }

        await updateUser(updatedUser);
        mutate();
    }

    useEffect(() => {
        // Do only refresh if effect was not previously executed or not Dev-Mode
        if (!!currentUser && (!effectRan.current || process.env.NODE_ENV !== 'development')) {
            checkForNewVersion();

            return () => effectRan.current = true;
        }
        // eslint-disable-next-line
    }, [currentUser])

    return (
        <>
            {Dialog}
            <Outlet />
        </>
    );
}

export default Changelog