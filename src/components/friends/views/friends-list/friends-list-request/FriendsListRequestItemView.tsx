import { FC } from 'react';
import { Base, Flex, NitroCardAccordionItemView, NitroCardAccordionItemViewProps, UserProfileIconView } from '../../../../../common';
import { MessengerRequest } from '../../../common/MessengerRequest';
import { useFriendsContext } from '../../../FriendsContext';

interface FriendsListRequestItemViewProps extends NitroCardAccordionItemViewProps
{
    request: MessengerRequest;
}

export const FriendsListRequestItemView: FC<FriendsListRequestItemViewProps> = props =>
{
    const { request = null, children = null, ...rest } = props;
    const { acceptFriend = null, declineFriend = null } = useFriendsContext();

    if(!request) return null;

    return (
        <NitroCardAccordionItemView justifyContent="between" className="px-2 py-1" { ...rest }>
            <Flex alignItems="center" gap={ 1 }>
                <UserProfileIconView userId={ request.id } />
                <div>{ request.name }</div>
            </Flex>
            <Flex alignItems="center" gap={ 1 }>
                <Base className="nitro-friends-spritesheet icon-accept cursor-pointer" onClick={ event => acceptFriend(request.requesterUserId) } />
                <Base className="nitro-friends-spritesheet icon-deny cursor-pointer" onClick={ event => declineFriend(request.requesterUserId) } />
            </Flex>
            { children }
        </NitroCardAccordionItemView>
    );
};
