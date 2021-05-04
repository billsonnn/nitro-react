import { FC } from 'react';
import { NitroCardContentViewProps } from './NitroCardContextView.types';

export const NitroCardContentView: FC<NitroCardContentViewProps> = props =>
{
    return (
        <div className="bg-light rounded-bottom border border-top-0 p-2 shadow overflow-hidden content-area">
            { props.children }
        </div>
    );
}
