import { FC } from 'react';
import { NitroCardAccordionViewProps } from './NitroCardAccordionView.types';

export const NitroCardAccordionView: FC<NitroCardAccordionViewProps> = props =>
{
    const { className = '' } = props;

    return (
        <div className={ 'nitro-card-accordion text-black ' + className }>
            { props.children }
        </div>
    );
}
