import classNames from 'classnames';
import { FC, useEffect, useMemo, useState } from 'react';
import { NitroLayoutFlex } from '../../..';
import { NitroLayoutBase } from '../../../base';
import { NitroCardAccordionSetViewProps } from './NitroCardAccordionSetView.types';

export const NitroCardAccordionSetView: FC<NitroCardAccordionSetViewProps> = props =>
{
    const { headerText = '', isExpanded = false, className = '', children = null, ...rest } = props;
    const [ isOpen, setIsOpen ] = useState(false);

    const getClassName = useMemo(() =>
    {
        let newClassName = 'nitro-card-accordion-set';

        if(isOpen) newClassName += ' active';

        if(className && className.length) newClassName += ` ${ className }`;

        return newClassName;
    }, [ className, isOpen ]);

    useEffect(() =>
    {
        setIsOpen(isExpanded);
    }, [ isExpanded ]);

    return (
        <NitroLayoutBase className={ getClassName } { ...rest }>
            <NitroLayoutFlex className="nitro-card-accordion-set-header px-2 py-1" onClick={ event => setIsOpen(!isOpen) }>
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
