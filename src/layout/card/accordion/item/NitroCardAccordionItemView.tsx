import { FC, useEffect, useState } from 'react';
import { NitroCardAccordionItemViewProps } from './NitroCardAccordionItemView.types';

export const NitroCardAccordionItemView: FC<NitroCardAccordionItemViewProps> = props =>
{
    const { className = '', headerClassName = '', contentClassName = '', headerText = '', defaultState = false } = props;

    const [ isExpanded, setIsExpanded ] = useState(false);

    useEffect(() =>
    {
        setIsExpanded(defaultState);
    }, [ defaultState ]);

    return (
        <div className={ 'nitro-card-accordion-item ' + className + (isExpanded ? ' active' : '') }>
            <div className={ 'nitro-card-accordion-item-header px-2 py-1 d-flex ' + headerClassName } onClick={ () => setIsExpanded((value) => !value) }>
                <div className="w-100">
                    { headerText }
                </div>
                <div className="justify-self-center">
                    <i className={ 'fas fa-caret-' + (isExpanded ? 'up' : 'down') } />
                </div>
            </div>
            <div className={ 'nitro-card-accordion-item-content ' + contentClassName + (!isExpanded ? ' d-none' : '') }>
                { props.children }
            </div>
        </div>
    );
}
