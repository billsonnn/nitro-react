import { FC } from 'react';
import { NitroCardContentViewProps } from './NitroCardContextView.types';

export const NitroCardContentView: FC<NitroCardContentViewProps> = props =>
{
    return (
        <div className={ 'container-fluid bg-light content-area ' + props.className }>
            { props.children }
        </div>
    );
}
