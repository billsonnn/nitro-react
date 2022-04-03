import { FC } from 'react';
import { MessengerRequest } from '../../../../../api';
import { Base, Flex, NitroCardAccordionItemView, UserProfileIconView } from '../../../../../common';
import { useFriends } from '../../../../../hooks';

export const FriendsListRequestItemView: FC<{ request: MessengerRequest }> = props =>
{
    const { request = null } = props;
    const { requestResponse = null } = useFriends();

    if(!request) return null;

    return (
        <NitroCardAccordionItemView justifyContent="between" className="px-2 py-1">
            <Flex alignItems="center" gap={ 1 }>
                <UserProfileIconView userId={ request.id } />
                <div>{ request.name }</div>
            </Flex>
            <Flex alignItems="center" gap={ 1 }>
                <Base className="nitro-friends-spritesheet icon-accept cursor-pointer" onClick={ event => requestResponse(request.id, true) } />
                <Base className="nitro-friends-spritesheet icon-deny cursor-pointer" onClick={ event => requestResponse(request.id, false) } />
            </Flex>
        </NitroCardAccordionItemView>
    );
}
