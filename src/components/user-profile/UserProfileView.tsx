import { RelationshipStatusInfoEvent, RelationshipStatusInfoMessageParser, UserCurrentBadgesComposer, UserCurrentBadgesEvent, UserProfileEvent, UserProfileParser, UserRelationshipsComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { GetSessionDataManager, GetUserProfile, LocalizeText } from '../../api';
import { Column, Flex, Grid } from '../../common';
import { BatchUpdates, CreateMessageHook, SendMessageHook } from '../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../layout';
import { BadgesContainerView } from './views/BadgesContainerView';
import { FriendsContainerView } from './views/FriendsContainerView';
import { GroupsContainerView } from './views/GroupsContainerView';
import { UserContainerView } from './views/UserContainerView';

export const UserProfileView: FC<{}> = props =>
{
    const [ userProfile, setUserProfile ] = useState<UserProfileParser>(null);
    const [ userBadges, setUserBadges ] = useState<string[]>([]);
    const [ userRelationships, setUserRelationships ] = useState<RelationshipStatusInfoMessageParser>(null);

    const onClose = () =>
    {
        BatchUpdates(() =>
        {
            setUserProfile(null);
            setUserBadges([]);
            setUserRelationships(null);
        });
    }

    const onLeaveGroup = useCallback(() =>
    {
        if(userProfile && userProfile.id === GetSessionDataManager().userId)
        {
            GetUserProfile(userProfile.id);
        }
    }, [ userProfile ]);
    
    const onUserCurrentBadgesEvent = useCallback((event: UserCurrentBadgesEvent) =>
    {
        const parser = event.getParser();

        if(!userProfile || (parser.userId !== userProfile.id)) return;
        
        setUserBadges(parser.badges);
    }, [ userProfile ]);

    CreateMessageHook(UserCurrentBadgesEvent, onUserCurrentBadgesEvent);

    const OnUserRelationshipsEvent = useCallback((event: RelationshipStatusInfoEvent) =>
    {
        const parser = event.getParser();

        if(!userProfile || (parser.userId !== userProfile.id)) return;
        
        setUserRelationships(parser);
    }, [ userProfile ]);

    CreateMessageHook(RelationshipStatusInfoEvent, OnUserRelationshipsEvent);

    const onUserProfileEvent = useCallback((event: UserProfileEvent) =>
    {
        const parser = event.getParser();

        if(userProfile)
        {
            BatchUpdates(() =>
            {
                setUserProfile(null);
                setUserBadges([]);
                setUserRelationships(null);
            });
        }
        
        setUserProfile(parser);

        SendMessageHook(new UserCurrentBadgesComposer(parser.id));
        SendMessageHook(new UserRelationshipsComposer(parser.id));
    }, [ userProfile ]);

    CreateMessageHook(UserProfileEvent, onUserProfileEvent);

    if(!userProfile) return null;

    return (
        <NitroCardView className="user-profile" simple>
            <NitroCardHeaderView headerText={ LocalizeText('extendedprofile.caption') } onCloseClick={ onClose } />
            <NitroCardContentView>
                <Grid>
                    <Column size={ 7 } className="user-container">
                        <UserContainerView userProfile={ userProfile } />
                        <BadgesContainerView badges={ userBadges } />
                    </Column>
                    <Column size={ 5 }>
                        {
                            userRelationships && <FriendsContainerView relationships={userRelationships} friendsCount={userProfile.friendsCount} />
                        }
                    </Column>
                </Grid>
                <Flex alignItems="center" className="rooms-button-container">
                    <i className="icon icon-rooms" /><span className="rooms-button">{LocalizeText('extendedprofile.rooms')}</span>
                </Flex>
                <GroupsContainerView itsMe={ userProfile.id === GetSessionDataManager().userId } groups={ userProfile.groups } onLeaveGroup={ onLeaveGroup } />
            </NitroCardContentView>
        </NitroCardView>
    )
}
