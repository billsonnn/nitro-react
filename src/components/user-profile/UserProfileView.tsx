import { RelationshipStatusInfoEvent, RelationshipStatusInfoMessageParser, UserCurrentBadgesComposer, UserCurrentBadgesEvent, UserProfileEvent, UserProfileParser, UserRelationshipsComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { GetSessionDataManager, GetUserProfile, LocalizeText, SendMessageComposer } from '../../api';
import { Column, Flex, Grid, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../common';
import { BatchUpdates, UseMessageEventHook } from '../../hooks';
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
        if(!userProfile || (userProfile.id !== GetSessionDataManager().userId)) return;
        
        GetUserProfile(userProfile.id);
    }, [ userProfile ]);
    
    const onUserCurrentBadgesEvent = useCallback((event: UserCurrentBadgesEvent) =>
    {
        const parser = event.getParser();

        if(!userProfile || (parser.userId !== userProfile.id)) return;
        
        setUserBadges(parser.badges);
    }, [ userProfile ]);

    UseMessageEventHook(UserCurrentBadgesEvent, onUserCurrentBadgesEvent);

    const onUserRelationshipsEvent = useCallback((event: RelationshipStatusInfoEvent) =>
    {
        const parser = event.getParser();

        if(!userProfile || (parser.userId !== userProfile.id)) return;
        
        setUserRelationships(parser);
    }, [ userProfile ]);

    UseMessageEventHook(RelationshipStatusInfoEvent, onUserRelationshipsEvent);

    const onUserProfileEvent = useCallback((event: UserProfileEvent) =>
    {
        const parser = event.getParser();
        
        BatchUpdates(() =>
        {
            setUserProfile(parser);
            setUserBadges([]);
            setUserRelationships(null);
        });

        SendMessageComposer(new UserCurrentBadgesComposer(parser.id));
        SendMessageComposer(new UserRelationshipsComposer(parser.id));
    }, []);

    UseMessageEventHook(UserProfileEvent, onUserProfileEvent);

    if(!userProfile) return null;

    return (
        <NitroCardView uniqueKey="nitro-user-profile" theme="primary-slim" className="user-profile">
            <NitroCardHeaderView headerText={ LocalizeText('extendedprofile.caption') } onCloseClick={ onClose } />
            <NitroCardContentView overflow="hidden">
                <Grid fullHeight={ false } gap={ 2 }>
                    <Column size={ 7 } gap={ 1 } className="user-container pe-2">
                        <UserContainerView userProfile={ userProfile } />
                        <Grid columnCount={ 5 } fullHeight className="bg-muted rounded px-2 py-1">
                            <BadgesContainerView fullWidth center badges={ userBadges } />
                        </Grid>
                    </Column>
                    <Column size={ 5 }>
                        { userRelationships &&
                            <FriendsContainerView relationships={ userRelationships } friendsCount={ userProfile.friendsCount } /> }
                    </Column>
                </Grid>
                <Flex alignItems="center" className="rooms-button-container px-2 py-1">
                    <Flex alignItems="center" gap={ 1 }>
                        <i className="icon icon-rooms" />
                        <Text bold underline pointer>{ LocalizeText('extendedprofile.rooms') }</Text>
                    </Flex>
                </Flex>
                <GroupsContainerView fullWidth itsMe={ userProfile.id === GetSessionDataManager().userId } groups={ userProfile.groups } onLeaveGroup={ onLeaveGroup } />
            </NitroCardContentView>
        </NitroCardView>
    )
}
