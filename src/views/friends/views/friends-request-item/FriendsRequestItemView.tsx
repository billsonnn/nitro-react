import { FC } from 'react';
import { NitroCardAccordionItemView } from '../../../../layout';
import { UserProfileIconView } from '../../../shared/user-profile-icon/UserProfileIconView';
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
            <div>{ request.name }</div>
            <div className="ms-auto d-flex align-items-center gap-1">
               <i className="icon icon-accept cursor-pointer" onClick={ event => acceptFriend(request.requesterUserId) } />
               <i className="icon icon-deny cursor-pointer" onClick={ event => declineFriend(request.requesterUserId) } />
            </div>
        </NitroCardAccordionItemView>
    );
};
