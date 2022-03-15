import { FC, useEffect, useState } from 'react';
import { NotificationUtilities } from '../../api';
import { Base, Column } from '../../common';

interface LoadingViewProps
{
    isError: boolean;
    message: string;
    percent: number;
}

export const LoadingView: FC<LoadingViewProps> = props =>
{
    const { isError = false, message = '', percent = 0 } = props;
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
        <Column position="relative" className="nitro-loading h-100">
            <div className="container h-100">
                <div className="row h-100 justify-content-center">
                    <Base className="connecting-duck" />
                    <div className="col-6 align-self-end text-center py-4">
                        { isError && (message && message.length) ?
                            <Base className="fs-4 text-shadow">{message}</Base>
                            :
                            <>
                                <Base className="fs-4 text-shadow">{percent.toFixed()}%</Base>
                                <div className="nitro-loading-bar mt-4">
                                    <div className="nitro-loading-bar-inner" style={{ 'width': `${ percent }%` }}/>
                                </div>   
                            </>
                        }
                        
                    </div>
                </div>
            </div>
            
        </Column>
    );
}
