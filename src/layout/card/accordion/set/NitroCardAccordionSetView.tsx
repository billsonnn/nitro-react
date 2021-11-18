import classNames from 'classnames';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { NitroLayoutFlex } from '../../..';
import { NitroLayoutBase } from '../../../base';
import { useNitroCardAccordionContext } from '../NitroCardAccordionContext';
import { NitroCardAccordionSetViewProps } from './NitroCardAccordionSetView.types';

export const NitroCardAccordionSetView: FC<NitroCardAccordionSetViewProps> = props =>
{
    const { headerText = '', isExpanded = false, className = '', children = null, ...rest } = props;
    const [ isOpen, setIsOpen ] = useState(false);
    const { setClosers = null, closeAll = null } = useNitroCardAccordionContext();

    const getClassName = useMemo(() =>
    {
        let newClassName = 'nitro-card-accordion-set';

        if(isOpen) newClassName += ' active';

        if(className && className.length) newClassName += ` ${ className }`;

        return newClassName;
    }, [ className, isOpen ]);

    const onClick = useCallback(() =>
    {
        closeAll();
        
        setIsOpen(prevValue => !prevValue);
        // if(isOpen)
        // {
        //     closeAll();
        // }
        // else
        // {
        //     BatchUpdates(() =>
        //     {
        //         closeAll();
        //         setIsOpen(true);
        //     });
        // }
    }, [ closeAll ]);

    const close = useCallback(() =>
    {
        setIsOpen(false);
    }, []);

    useEffect(() =>
    {
        setIsOpen(isExpanded);
    }, [ isExpanded ]);

    useEffect(() =>
    {
        const closeFunction = close;

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
        }
    }, [ close, setClosers ]);

    return (
        <NitroLayoutBase className={ getClassName } { ...rest }>
            <NitroLayoutFlex className="nitro-card-accordion-set-header px-2 py-1" onClick={ onClick }>
                <div className="w-100">
                    { headerText }
                </div>
                <div className="justify-self-center">
                    <i className={ 'fas fa-caret-' + (isOpen ? 'up' : 'down') } />
                </div>
            </NitroLayoutFlex>
            <NitroLayoutBase className={ 'nitro-card-accordion-set-content ' + classNames({ 'd-none': !isOpen }) }>
                { children }
            </NitroLayoutBase>
        </NitroLayoutBase>
    );
}
