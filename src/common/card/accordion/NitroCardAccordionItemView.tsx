import { FC } from 'react';
import { Flex, FlexProps } from '../..';

export interface NitroCardAccordionItemViewProps extends FlexProps
{

}

export const NitroCardAccordionItemView: FC<NitroCardAccordionItemViewProps> = props =>
{
    const { alignItems = 'center', gap = 1, children = null, ...rest } = props;

    return (
        <Flex alignItems={ alignItems } gap={ gap } { ...rest }>
            { children }
        </Flex>
    );
};
