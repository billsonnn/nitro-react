import { FC } from 'react';
import { LoadingViewProps } from './LoadingView.types';

export const LoadingView: FC<LoadingViewProps> = props =>
{
    const { isError = false, message = '' } = props;
    
    return (
        <div className="nitro-loading d-flex flex-column justify-content-center align-items-center w-100 h-100">
            <div className="logo mb-4"></div>
            { message && message.length && (<div className="h4 m-0">{ message }</div>) }
            { !isError && (<div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>) }
        </div>
    );
}
