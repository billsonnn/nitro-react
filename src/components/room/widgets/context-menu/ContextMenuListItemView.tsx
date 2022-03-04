import { FC, MouseEvent, useMemo } from 'react';
import { Flex, FlexProps } from '../../../../common';

interface ContextMenuListItemViewProps extends FlexProps
{
    disabled?: boolean;
}

export const ContextMenuListItemView: FC<ContextMenuListItemViewProps> = props =>
{
    const { disabled = false, fullWidth = true, justifyContent = 'center', alignItems = 'center', classNames = [], onClick = null, ...rest } = props;

    const handleClick = (event: MouseEvent<HTMLDivElement>) =>
    {
        if(disabled) return;

        if(onClick) onClick(event);
    }

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'menu-item', 'list-item' ];

        if(disabled) newClassNames.push('disabled');

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ disabled, classNames ]);

    return <Flex fullWidth={ fullWidth } justifyContent={ justifyContent } alignItems={ alignItems } classNames={ getClassNames } onClick={ handleClick } { ...rest } />;
}
