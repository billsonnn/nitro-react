import { CreateLinkEvent, ExtendedProfileChangedMessageEvent, GetSessionDataManager, RelationshipStatusInfoEvent, RelationshipStatusInfoMessageParser, RoomEngineObjectEvent, RoomObjectCategory, RoomObjectType, UserCurrentBadgesComposer, UserCurrentBadgesEvent, UserProfileEvent, UserProfileParser, UserRelationshipsComposer } from '@nitrots/nitro-renderer';
import { FC, useState } from 'react';
import { GetRoomSession, GetUserProfile, LocalizeText, SendMessageComposer } from '../../api';
import { Column, Flex, Grid, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../common';
import { useMessageEvent, useNitroEvent } from '../../hooks';
import { BadgesContainerView } from './views/BadgesContainerView';
import { FriendsContainerView } from './views/FriendsContainerView';
import { GroupsContainerView } from './views/GroupsContainerView';
import { UserContainerView } from './views/UserContainerView';

export const UserProfileView: FC<{}> = props =>
{
    const [userProfile, setUserProfile] = useState<UserProfileParser>(null);
    const [userBadges, setUserBadges] = useState<string[]>([]);
    const [userRelationships, setUserRelationships] = useState<RelationshipStatusInfoMessageParser>(null);

    const onClose = () =>
    {
        setUserProfile(null);
        setUserBadges([]);
        setUserRelationships(null);
    }

    const onLeaveGroup = () =>
    {
        if (!userProfile || (userProfile.id !== GetSessionDataManager().userId)) return;

        GetUserProfile(userProfile.id);
    }

    useMessageEvent<UserCurrentBadgesEvent>(UserCurrentBadgesEvent, event =>
    {
        const parser = event.getParser();

        if (!userProfile || (parser.userId !== userProfile.id)) return;

        setUserBadges(parser.badges);
    });

    useMessageEvent<RelationshipStatusInfoEvent>(RelationshipStatusInfoEvent, event =>
    {
        const parser = event.getParser();

        if (!userProfile || (parser.userId !== userProfile.id)) return;

        setUserRelationships(parser);
    });

    useMessageEvent<UserProfileEvent>(UserProfileEvent, event =>
    {
        const parser = event.getParser();

        let isSameProfile = false;

        setUserProfile(prevValue =>
        {
            if (prevValue && prevValue.id) isSameProfile = (prevValue.id === parser.id);

            return parser;
        });

        if (!isSameProfile)
        {
            setUserBadges([]);
            setUserRelationships(null);
        }

        SendMessageComposer(new UserCurrentBadgesComposer(parser.id));
        SendMessageComposer(new UserRelationshipsComposer(parser.id));
    });

    useMessageEvent<ExtendedProfileChangedMessageEvent>(ExtendedProfileChangedMessageEvent, event =>
    {
        const parser = event.getParser();

        if (parser.userId != userProfile?.id) return;

        GetUserProfile(parser.userId);
    });

    useNitroEvent<RoomEngineObjectEvent>(RoomEngineObjectEvent.SELECTED, event =>
    {
        if (!userProfile) return;

        if (event.category !== RoomObjectCategory.UNIT) return;

        const userData = GetRoomSession().userDataManager.getUserDataByIndex(event.objectId);

        if (userData.type !== RoomObjectType.USER) return;

        GetUserProfile(userData.webID);
    });

    if (!userProfile) return null;

    return (
        <NitroCardView className="w-[470px] h-[460px]" theme="primary-slim" uniqueKey="nitro-user-profile">
            <NitroCardHeaderView headerText={LocalizeText('extendedprofile.caption')} onCloseClick={onClose} />
            <NitroCardContentView overflow="hidden">
                <Grid fullHeight={false} gap={2}>
                    <Column className="border-r border-r-gray pe-2" gap={1} size={7}>
                        <UserContainerView userProfile={userProfile} />
                        <Grid fullHeight className="bg-muted rounded px-2 py-1" columnCount={5}>
                            <BadgesContainerView center fullWidth badges={userBadges} />
                        </Grid>
                    </Column>
                    <Column size={5}>
                        {userRelationships &&
                            <FriendsContainerView friendsCount={userProfile.friendsCount} relationships={userRelationships} />}
                    </Column>
                </Grid>
                <Flex alignItems="center" className=" border-t border-t-gray border-b border-b-gray  px-2 py-1">
                    <Flex alignItems="center" gap={1} onClick={event => CreateLinkEvent(`navigator/search/hotel_view/owner:${userProfile.username}`)}>
                        <i className="nitro-icon icon-rooms" />
                        <Text bold pointer underline>{LocalizeText('extendedprofile.rooms')}</Text>
                    </Flex>
                </Flex>
                <GroupsContainerView fullWidth groups={userProfile.groups} itsMe={userProfile.id === GetSessionDataManager().userId} onLeaveGroup={onLeaveGroup} />
            </NitroCardContentView>
        </NitroCardView>
    )
}
