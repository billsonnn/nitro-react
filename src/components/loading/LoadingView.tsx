import { FC } from 'react';
import { Base, Column } from '../../common';

interface LoadingViewProps
{
}

export const LoadingView: FC<LoadingViewProps> = props =>
{
    const {} = props;
    
    return (
        <Column fullHeight position="relative" className="nitro-loading">
            <Base fullHeight className="container h-100">
                <Column fullHeight alignItems="center" justifyContent="end">
                    <Base className="connecting-duck" />
                </Column>
            </Base>
        </Column>
    );
}
