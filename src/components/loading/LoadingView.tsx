import { FC, useEffect, useState } from 'react';
import { Base, Column } from '../../common';
import { NotificationUtilities } from '../../views/notification-center/common/NotificationUtilities';

interface LoadingViewProps
{
    isError: boolean;
    message: string;
}

export const LoadingView: FC<LoadingViewProps> = props =>
{
    const { isError = false, message = '' } = props;
    const [ loadingShowing, setLoadingShowing ] = useState(false);

    useEffect(() =>
    {
        if(!isError) return;

        NotificationUtilities.simpleAlert(message, null, null, null, 'Connection Error');
    }, [ isError, message ]);

    useEffect(() =>
    {
        const timeout = setTimeout(() => setLoadingShowing(true), 500);

        return () => clearTimeout(timeout);
    }, []);
    
    return (
        <Column fit center position="relative" className="nitro-loading">
            <Base className="connecting-duck" />
            { isError && (message && message.length) &&
                <Base className="m-auto bottom-3 fs-4 text-shadow" position="absolute">{ message }</Base> }
        </Column>
    );
}
