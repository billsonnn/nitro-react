import { FC, useEffect } from 'react';
import { NotificationUtilities } from '../../api';
import { Base, Column, Text } from '../../common';

interface LoadingViewProps
{
    isError: boolean;
    message: string;
    percent: number;
}

export const LoadingView: FC<LoadingViewProps> = props =>
{
    const { isError = false, message = '', percent = 0 } = props;

    useEffect(() =>
    {
        if(!isError) return;

        NotificationUtilities.simpleAlert(message, null, null, null, 'Connection Error');
    }, [ isError, message ]);
    
    return (
        <Column fullHeight position="relative" className="nitro-loading">
            <Base fullHeight className="container h-100">
                <Column fullHeight alignItems="center" justifyContent="end">
                    <Base className="connecting-duck" />
                    <Column size={ 6 } className="text-center py-4">
                        { isError && (message && message.length) ?
                            <Base className="fs-4 text-shadow">{message}</Base>
                            :
                            <>
                                <Text fontSize={ 4 } variant="white" className="text-shadow">{ percent.toFixed() }%</Text>
                                <div className="nitro-loading-bar mt-2">
                                    <div className="nitro-loading-bar-inner" style={{ 'width': `${ percent }%` }}/>
                                </div>   
                            </>
                        }
                        
                    </Column>
                </Column>
            </Base>
        </Column>
    );
}
