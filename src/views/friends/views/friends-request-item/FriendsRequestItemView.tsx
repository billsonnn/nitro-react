import { FC } from 'react';
import { NitroCardAccordionItemView, NitroLayoutFlex, UserProfileIconView } from '../../../../layout';
import { NitroLayoutBase } from '../../../../layout/base';
import { useFriendsContext } from '../../context/FriendsContext';
import { FriendsRequestItemViewProps } from './FriendsRequestItemView.types';

export const FriendsRequestItemView: FC<FriendsRequestItemViewProps> = props =>
{
    const { request = null } = props;
    const { acceptFriend = null, declineFriend = null } = useFriendsContext();

    if(!request) return null;

    return (
        <NitroCardAccordionItemView>
            <UserProfileIconView userId={ request.id } />
            <NitroLayoutBase>{ request.name }</NitroLayoutBase>
            <NitroLayoutFlex className="ms-auto align-items-center" gap={ 1 }>
               <NitroLayoutBase className="nitro-friends-spritesheet icon-accept cursor-pointer" onClick={ event => acceptFriend(request.requesterUserId) } />
               <NitroLayoutBase className="nitro-friends-spritesheet icon-deny cursor-pointer" onClick={ event => declineFriend(request.requesterUserId) } />
            </NitroLayoutFlex>
        </NitroCardAccordionItemView>
    );
};
