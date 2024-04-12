import { FC } from 'react';
import { Column } from '../../common';

interface LoadingViewProps
{
}

export const LoadingView: FC<LoadingViewProps> = props =>
{
    const {} = props;
    
    return (
        <Column fullHeight className="nitro-loading" position="relative">
            <div className="container h-100">
                <Column fullHeight alignItems="center" justifyContent="end">
                    <div className="connecting-duck" />
                </Column>
            </div>
        </Column>
    );
}
