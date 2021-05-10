import { FC } from 'react';
import { NitroCardContentViewProps } from './NitroCardContextView.types';

export const NitroCardContentView: FC<NitroCardContentViewProps> = props =>
{
    return (
        <div className="bg-light p-2 content-area">
            { props.children }
        </div>
    );
}
