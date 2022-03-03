import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, MouseEvent, useCallback, useMemo } from 'react';
import { Base, Column, ColumnProps, Flex } from '..';
import { useNitroCardContext } from './NitroCardContext';

interface NitroCardHeaderViewProps extends ColumnProps
{
    headerText: string;
    theme?: string;
    noCloseButton?: boolean;
    onCloseClick: (event: MouseEvent) => void;
}

export const NitroCardHeaderView: FC<NitroCardHeaderViewProps> = props =>
{
    const { headerText = null, noCloseButton = false, onCloseClick = null, overflow = 'hidden', justifyContent = 'center', alignItems = 'center', classNames = [], children = null, ...rest } = props;
    const { simple = false } = useNitroCardContext();

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'drag-handler', 'container-fluid', 'nitro-card-header' ];

        if(simple) newClassNames.push('bg-tertiary-split');

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ simple, classNames ]);

    const onMouseDown = useCallback((event: MouseEvent<HTMLDivElement>) =>
    {
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
    }, []);

    return (
        <Column center overflow={ overflow } classNames={ getClassNames } { ...rest }>
            <Flex fullWidth center position="relative">
                <span className="nitro-card-header-text">{ headerText }</span>
                <Base position="absolute" className="header-close" onMouseDownCapture={ onMouseDown } onClick={ onCloseClick }>
                    <FontAwesomeIcon icon="times" />
                </Base>
            </Flex>
        </Column>
    );
}
