import { ChangeUserNameMessageComposer, UserNameChangeMessageEvent } from '@nitrots/nitro-renderer';
import { FC, useState } from 'react';
import { GetSessionDataManager, LocalizeText, SendMessageComposer } from '../../../../api';
import { useMessageEvent } from '../../../../hooks';
import { NameChangeLayoutViewProps } from './NameChangeView.types';

export const NameChangeConfirmationView:FC<NameChangeLayoutViewProps> = props =>
{
    const { username = '', onAction = null } = props;
    const [ isConfirming, setIsConfirming ] = useState<boolean>(false);

    const confirm = () =>
    {
        if(isConfirming) return;

        setIsConfirming(true);
        SendMessageComposer(new ChangeUserNameMessageComposer(username));
    }
    
    useMessageEvent<UserNameChangeMessageEvent>(UserNameChangeMessageEvent, event =>
    {
        const parser = event.getParser();

        if(!parser) return;

        if(parser.webId !== GetSessionDataManager().userId) return;

        onAction('close');
    });

    return (
        <div className="d-flex flex-column gap-4 h-100">
            <div className="bg-muted rounded p-2 text-center">{ LocalizeText('tutorial.name_change.info.confirm') }</div>
            <div className="d-flex flex-column align-items-center gap-1 h-100">
                <div>{ LocalizeText('tutorial.name_change.confirm') }</div>
                <div className="fw-bold">{ username }</div>
            </div>
            <div className="d-flex gap-2">
                <button className="btn btn-success w-100" disabled={ isConfirming } onClick={ confirm }>{ LocalizeText('generic.ok') }</button>
                <button className="btn btn-primary w-100" onClick={ () => onAction('close') }>{ LocalizeText('cancel') }</button>
            </div>
        </div>
    );
}
