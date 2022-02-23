import { GuideSessionCreateMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { LocalizeText } from '../../../api';
import { SendMessageHook } from '../../../hooks';
import { NitroCardContentView } from '../../../layout';

interface GuideToolUserCreateRequestViewProps
{
    userRequest: string;
    setUserRequest: (value: string) => void;
}

const MIN_REQUEST_LENGTH: number = 15;

export const GuideToolUserCreateRequestView: FC<GuideToolUserCreateRequestViewProps> = props =>
{
    const { userRequest = '', setUserRequest = null } = props;

    const [ isPending, setIsPending ] = useState<boolean>(false);

    const sendRequest = useCallback(() =>
    {
        setIsPending(true);
        SendMessageHook(new GuideSessionCreateMessageComposer(1, userRequest));
    }, [ userRequest ]);

    return (
        <NitroCardContentView className="text-black flex flex-column gap-2">
            <div>{ LocalizeText('guide.help.request.user.create.help') }</div>
            <textarea className="request-message" maxLength={ 140 } value={ userRequest } onChange={ (e) => setUserRequest(e.target.value) } placeholder={ LocalizeText('guide.help.request.user.create.input.help') }></textarea>
            <button className="btn btn-success" disabled={ userRequest.length < MIN_REQUEST_LENGTH || isPending } onClick={ sendRequest }>{ LocalizeText('guide.help.request.user.create.input.button') }</button>
        </NitroCardContentView>
    );
};
