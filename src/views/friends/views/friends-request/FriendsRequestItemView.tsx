import { FC } from 'react';
import { Base, Flex, NitroCardAccordionItemView, UserProfileIconView } from '../../../../common';
import { MessengerRequest } from '../../common/MessengerRequest';
import { useFriendsContext } from '../../FriendsContext';

interface FriendsRequestItemViewProps
{
    request: MessengerRequest;
}

export const FriendsRequestItemView: FC<FriendsRequestItemViewProps> = props =>
{
    const { request = null } = props;
    const { acceptFriend = null, declineFriend = null } = useFriendsContext();

    if(!request) return null;

    return (
        <NitroCardAccordionItemView>
            <UserProfileIconView userId={ request.id } />
            <Base>{ request.name }</Base>
            <Flex className="ms-auto align-items-center" gap={ 1 }>
               <Base className="nitro-friends-spritesheet icon-accept cursor-pointer" onClick={ event => acceptFriend(request.requesterUserId) } />
               <Base className="nitro-friends-spritesheet icon-deny cursor-pointer" onClick={ event => declineFriend(request.requesterUserId) } />
            </Flex>
        </NitroCardAccordionItemView>
    );
};
