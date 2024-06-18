import { FC } from 'react';
import { MessengerRequest } from '../../../../../api';
import { NitroCardAccordionItemView, UserProfileIconView } from '../../../../../common';
import { useFriends } from '../../../../../hooks';

export const FriendsListRequestItemView: FC<{ request: MessengerRequest }> = props =>
{
    const { request = null } = props;
    const { requestResponse = null } = useFriends();

    if(!request) return null;

    return (
        <NitroCardAccordionItemView className="px-2 py-1" justifyContent="between">
            <div className="flex items-center gap-1">
                <UserProfileIconView userId={ request.id } />
                <div>{ request.name }</div>
            </div>
            <div className="flex items-center gap-1">
                <div className="nitro-friends-spritesheet icon-accept cursor-pointer" onClick={ event => requestResponse(request.id, true) } />
                <div className="nitro-friends-spritesheet icon-deny cursor-pointer" onClick={ event => requestResponse(request.id, false) } />
            </div>
        </NitroCardAccordionItemView>
    );
};
