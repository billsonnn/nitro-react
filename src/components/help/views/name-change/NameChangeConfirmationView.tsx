import { ChangeUserNameMessageComposer, GetSessionDataManager, UserNameChangeMessageEvent } from '@nitrots/nitro-renderer';
import { FC, useState } from 'react';
import { LocalizeText, SendMessageComposer } from '../../../../api';
import { useMessageEvent } from '../../../../hooks';
import { NameChangeLayoutViewProps } from './NameChangeView.types';

export const NameChangeConfirmationView: FC<NameChangeLayoutViewProps> = props =>
{
    const { username = '', onAction = null } = props;
    const [ isConfirming, setIsConfirming ] = useState<boolean>(false);

    const confirm = () =>
    {
        if(isConfirming) return;

        setIsConfirming(true);
        SendMessageComposer(new ChangeUserNameMessageComposer(username));
    };

    useMessageEvent<UserNameChangeMessageEvent>(UserNameChangeMessageEvent, event =>
    {
        const parser = event.getParser();

        if(!parser) return;

        if(parser.webId !== GetSessionDataManager().userId) return;

        onAction('close');
    });

    return (
        <div className="flex flex-col gap-4 h-full">
            <div className="bg-muted rounded p-2 text-center">{ LocalizeText('tutorial.name_change.info.confirm') }</div>
            <div className="flex flex-col items-center gap-1 h-full">
                <div>{ LocalizeText('tutorial.name_change.confirm') }</div>
                <div className="font-bold	">{ username }</div>
            </div>
            <div className="flex gap-2">
                <button className="btn btn-success w-full" disabled={ isConfirming } onClick={ confirm }>{ LocalizeText('generic.ok') }</button>
                <button className="btn btn-primary w-full" onClick={ () => onAction('close') }>{ LocalizeText('cancel') }</button>
            </div>
        </div>
    );
};
