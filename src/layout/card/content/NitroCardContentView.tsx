import { FC } from 'react';
import { useNitroCardContext } from '../context';
import { NitroCardContentViewProps } from './NitroCardContextView.types';

export const NitroCardContentView: FC<NitroCardContentViewProps> = props =>
{
    const { className = null, children = null } = props;
    const { simple = false } = useNitroCardContext();
    
    return (
        <div className={ `container-fluid bg-light content-area ${ (simple ? 'simple' : '') } ${ className || '' }` }>
            { children }
        </div>
    );
}
