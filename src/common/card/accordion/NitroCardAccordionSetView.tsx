import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { Column, ColumnProps, Flex, Text } from '../..';
import { useNitroCardAccordionContext } from './NitroCardAccordionContext';

export interface NitroCardAccordionSetViewProps extends ColumnProps
{
    headerText: string;
    isExpanded?: boolean;
}

export const NitroCardAccordionSetView: FC<NitroCardAccordionSetViewProps> = props =>
{
    const { headerText = '', isExpanded = false, gap = 0, classNames = [], children = null, ...rest } = props;
    const [ isOpen, setIsOpen ] = useState(false);
    const { setClosers = null, closeAll = null } = useNitroCardAccordionContext();

    const onClick = () =>
    {
        closeAll();

        setIsOpen(prevValue => !prevValue);
    };

    const onClose = useCallback(() => setIsOpen(false), []);

    const getClassNames = useMemo(() =>
    {
        const newClassNames = [ 'nitro-card-accordion-set' ];

        if(isOpen) newClassNames.push('active');

        if(classNames && classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ isOpen, classNames ]);

    useEffect(() =>
    {
        setIsOpen(isExpanded);
    }, [ isExpanded ]);

    useEffect(() =>
    {
        const closeFunction = onClose;

        setClosers(prevValue =>
        {
            const newClosers = [ ...prevValue ];

            newClosers.push(closeFunction);

            return newClosers;
        });

        return () =>
        {
            setClosers(prevValue =>
            {
                const newClosers = [ ...prevValue ];

                const index = newClosers.indexOf(closeFunction);

                if(index >= 0) newClosers.splice(index, 1);

                return newClosers;
            });
        };
    }, [ onClose, setClosers ]);

    return (
        <Column classNames={ getClassNames } gap={ gap } { ...rest }>
            <Flex pointer className="nitro-card-accordion-set-header px-2 py-1" justifyContent="between" onClick={ onClick }>
                <Text>{ headerText }</Text>
                { isOpen && <FaCaretUp className="fa-icon" /> }
                { !isOpen && <FaCaretDown className="fa-icon" /> }
            </Flex>
            { isOpen &&
                <Column fullHeight className="nitro-card-accordion-set-content" gap={ 0 } overflow="auto">
                    { children }
                </Column> }
        </Column>
    );
};
