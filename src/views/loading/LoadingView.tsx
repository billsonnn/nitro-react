import { FC, useEffect, useState } from 'react';
import { NitroLayoutFlexColumn } from '../../layout';
import { NitroLayoutBase } from '../../layout/base';
import { NotificationAlertType } from '../notification-center/common/NotificationAlertType';
import { NotificationUtilities } from '../notification-center/common/NotificationUtilities';
import { LoadingViewProps } from './LoadingView.types';

export const LoadingView: FC<LoadingViewProps> = props =>
{
    const { isError = false, message = '' } = props;
    const [ loadingShowing, setLoadingShowing ] = useState(false);

    useEffect(() =>
    {
        if(!isError) return;

        NotificationUtilities.simpleAlert(message, NotificationAlertType.DEFAULT, null, null, 'Connection Error');
    }, [ isError, message ]);

    useEffect(() =>
    {
        const timeout = setTimeout(() =>
        {
            setLoadingShowing(true);
        }, 500);

        return () =>
        {
            clearTimeout(timeout);
        }
    }, []);
    
    return (
        <NitroLayoutFlexColumn className='position-relative nitro-loading justify-content-center align-items-center w-100 h-100'>
            <NitroLayoutBase className="connecting-duck" />
            {/* <TransitionAnimation className="loading-area" type={ TransitionAnimationTypes.FADE_IN } inProp={ loadingShowing }>
                <NitroLayoutBase className="connecting-duck" />
            </TransitionAnimation> */}
            {/* <TransitionAnimation className="loading-area" type={ TransitionAnimationTypes.FADE_IN } inProp={ !loadingShowing } timeout={ 500 }>
                <NitroLayoutBase position="absolute" className="logo" />
            </TransitionAnimation> */}
            { isError && (message && message.length) &&
                <NitroLayoutBase className="m-auto bottom-3 fs-4 text-shadow" position="absolute">{ message }</NitroLayoutBase> }
        </NitroLayoutFlexColumn>
    );
}
