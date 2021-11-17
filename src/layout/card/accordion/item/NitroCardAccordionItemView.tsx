import { FC } from 'react';
import { NitroLayoutBase } from '../../../base';
import { NitroCardAccordionItemViewProps } from './NitroCardAccordionItemView.types';

export const NitroCardAccordionItemView: FC<NitroCardAccordionItemViewProps> = props =>
{
    const { children = null, ...rest } = props;

    return (
        <NitroLayoutBase className="px-2 py-1 d-flex gap-1 align-items-center">
            { children }
        </NitroLayoutBase>
    );
}
