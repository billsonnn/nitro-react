import { RelationshipStatusInfoEvent, RelationshipStatusInfoMessageParser, UserCurrentBadgesComposer, UserCurrentBadgesEvent, UserProfileEvent, UserProfileParser, UserRelationshipsComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { GetSessionDataManager, GetUserProfile, LocalizeText } from '../../api';
import { CreateMessageHook, SendMessageHook } from '../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../layout';
import { BadgesContainerView } from './views/badges-container/BadgesContainerView';
import { FriendsContainerView } from './views/friends-container/FriendsContainerView';
import { GroupsContainerView } from './views/groups-container/GroupsContainerView';
import { UserContainerView } from './views/user-container/UserContainerView';

export const UserProfileView: FC = props =>
{
    const [userProfile, setUserProfile] = useState<UserProfileParser>(null);
    const [userBadges, setUserBadges] = useState<string[]>([]);
    const [userRelationships, setUserRelationships] = useState<RelationshipStatusInfoMessageParser>(null);

    const OnClose = useCallback(() =>
    {
        setUserProfile(null);
        setUserBadges([]);
        setUserRelationships(null);
    }, []);

    const onLeaveGroup = useCallback(() =>
    {
        if(userProfile && userProfile.id === GetSessionDataManager().userId)
        {
            GetUserProfile(userProfile.id);
        }
    }, [ userProfile ]);
    
    const OnUserCurrentBadgesEvent = useCallback((event: UserCurrentBadgesEvent) =>
    {
        const parser = event.getParser();

        if(userProfile && parser.userId === userProfile.id)
            setUserBadges(parser.badges);
    }, [userProfile, setUserBadges]);

    CreateMessageHook(UserCurrentBadgesEvent, OnUserCurrentBadgesEvent);

    const OnUserRelationshipsEvent = useCallback((event: RelationshipStatusInfoEvent) =>
    {
        const parser = event.getParser();

        if(userProfile && parser.userId === userProfile.id)
            setUserRelationships(parser);
    }, [userProfile, setUserRelationships]);

    CreateMessageHook(RelationshipStatusInfoEvent, OnUserRelationshipsEvent);

    const OnUserProfileEvent = useCallback((event: UserProfileEvent) =>
    {
        const parser = event.getParser();

        if(userProfile)
        {
            setUserProfile(null);
            setUserBadges([]);
            setUserRelationships(null);
        }
        
        setUserProfile(parser);
        SendMessageHook(new UserCurrentBadgesComposer(parser.id));
        SendMessageHook(new UserRelationshipsComposer(parser.id));
    }, [userProfile]);

    CreateMessageHook(UserProfileEvent, OnUserProfileEvent);

    if(!userProfile) return null;

    return (
        <NitroCardView simple={ true } className="user-profile">
                <NitroCardHeaderView headerText={LocalizeText('extendedprofile.caption')} onCloseClick={OnClose} />
                <NitroCardContentView>
                    <div className="row">
                        <div className="col-sm-7 user-container">
                            <UserContainerView userProfile={ userProfile } />
                            <BadgesContainerView badges={ userBadges } />
                        </div>
                        <div className="col-sm-5">
                            {
                                userRelationships && <FriendsContainerView relationships={userRelationships} friendsCount={userProfile.friendsCount} />
                            }
                        </div>
                    </div>
                    <div className="d-flex rooms-button-container align-items-center py-1">
                        <div className="d-flex align-items-center w-100">
                            <i className="icon icon-rooms" /><span className="rooms-button">{LocalizeText('extendedprofile.rooms')}</span>
                        </div>
                    </div>
                    <GroupsContainerView itsMe={ userProfile.id === GetSessionDataManager().userId } groups={ userProfile.groups } onLeaveGroup={ onLeaveGroup } />
            </NitroCardContentView>
        </NitroCardView>
    )
}
