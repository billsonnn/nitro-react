import { FC, useCallback, useMemo, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../common';
import { HelpNameChangeEvent } from '../../../../events';
import { UseUiEvent } from '../../../../hooks';
import { NameChangeConfirmationView } from './NameChangeConfirmationView';
import { NameChangeInitView } from './NameChangeInitView';
import { NameChangeInputView } from './NameChangeInputView';

const INIT: string = 'INIT';
const INPUT: string = 'INPUT';
const CONFIRMATION: string = 'CONFIRMATION';

export const NameChangeView:FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState<boolean>(false);
    const [ layout, setLayout ] = useState<string>(INIT);
    const [ newUsername, setNewUsername ] = useState<string>('');

    const onHelpNameChangeEvent = useCallback((event: HelpNameChangeEvent) =>
    {
        setLayout(INIT);
        setIsVisible(true);
    }, []);

    UseUiEvent(HelpNameChangeEvent.INIT, onHelpNameChangeEvent);

    const onAction = useCallback((action: string, value?: string) =>
    {
        switch(action)
        {
            case 'start':
                setLayout(INPUT);
                break;
            case 'confirmation':
                setNewUsername(value);
                setLayout(CONFIRMATION);
                break;
            case 'close':
                setNewUsername('');
                setIsVisible(false);
                break;
        }
    }, []);

    const titleKey = useMemo(() =>
    {
        switch(layout)
        {
            case INIT: return 'tutorial.name_change.title.main';
            case INPUT: return 'tutorial.name_change.title.select';
            case CONFIRMATION: return 'tutorial.name_change.title.confirm';
        }
    }, [layout]);
    
    if(!isVisible) return null;

    return (
        <NitroCardView className="nitro-change-username" theme="primary-slim">
            <NitroCardHeaderView headerText={LocalizeText(titleKey)} onCloseClick={ () => onAction('close') } />
            <NitroCardContentView className="text-black">
                { layout === INIT && <NameChangeInitView onAction={ onAction } /> }
                { layout === INPUT && <NameChangeInputView onAction={ onAction } /> }
                { layout === CONFIRMATION && <NameChangeConfirmationView username={ newUsername } onAction={ onAction } /> }
            </NitroCardContentView>
        </NitroCardView>
    )
}
