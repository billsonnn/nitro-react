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
    };

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'relative mb-[2px] p-[3px] overflow-hidden', 'h-[24px] max-h-[24px] p-[3px] bg-[repeating-linear-gradient(#131e25,_#131e25_50%,_#0d171d_50%,_#0d171d_100%)] cursor-pointer' ];

        if(disabled) newClassNames.push('disabled');

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ disabled, classNames ]);

    return <Flex alignItems={ alignItems } classNames={ getClassNames } fullWidth={ fullWidth } justifyContent={ justifyContent } onClick={ handleClick } { ...rest } />;
};
