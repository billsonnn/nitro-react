import { FC } from 'react';
import { NitroCardAccordionViewProps } from './NitroCardAccordionView.types';

export const NitroCardAccordionView: FC<NitroCardAccordionViewProps> = props =>
{
    const { className = '' } = props;

    return (
        <div className={ 'nitro-card-accordion bg-light text-black ' + className }>
            { props.children }
        </div>
    );
}
