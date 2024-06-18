import { GuideSessionCreateMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useState } from 'react';
import { LocalizeText, SendMessageComposer } from '../../../api';
import { Button, Text } from '../../../common';

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

    const sendRequest = () =>
    {
        setIsPending(true);
        SendMessageComposer(new GuideSessionCreateMessageComposer(1, userRequest));
    };

    return (
        <div className="flex flex-col">
            <Text>{ LocalizeText('guide.help.request.user.create.help') }</Text>
            <textarea className="request-message" maxLength={ 140 } placeholder={ LocalizeText('guide.help.request.user.create.input.help') } value={ userRequest } onChange={ event => setUserRequest(event.target.value) }></textarea>
            <Button fullWidth disabled={ (userRequest.length < MIN_REQUEST_LENGTH) || isPending } variant="success" onClick={ sendRequest }>{ LocalizeText('guide.help.request.user.create.input.button') }</Button>
        </div>
    );
};
