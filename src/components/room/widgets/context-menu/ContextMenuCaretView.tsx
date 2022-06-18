import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, useMemo } from 'react';
import { Flex, FlexProps } from '../../../../common';

interface CaretViewProps extends FlexProps
{
    collapsed?: boolean;
}
export const ContextMenuCaretView: FC<CaretViewProps> = props =>
{
    const { justifyContent = 'center', alignItems = 'center', classNames = [], collapsed = true, ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'menu-footer' ];

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames ]);

    return <Flex justifyContent={ justifyContent } alignItems={ alignItems } classNames={ getClassNames } { ...rest }>
        <FontAwesomeIcon icon={ !collapsed ? 'caret-down' : 'caret-up' } className="align-self-center" />
    </Flex>
}
