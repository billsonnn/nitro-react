import { FC } from 'react';
import { NitroCardContentViewProps } from './NitroCardContextView.types';

export const NitroCardContentView: FC<NitroCardContentViewProps> = props =>
{
    const { className = null } = props;
    
    return (
        <div className={ 'container-fluid bg-light content-area ' + className }>
            { props.children }
        </div>
    );
}
