import { CreateLinkEvent, ExtendedProfileChangedMessageEvent, GetSessionDataManager, RelationshipStatusInfoEvent, RelationshipStatusInfoMessageParser, RoomEngineObjectEvent, RoomObjectCategory, RoomObjectType, UserCurrentBadgesComposer, UserCurrentBadgesEvent, UserProfileEvent, UserProfileParser, UserRelationshipsComposer } from '@nitrots/nitro-renderer';
import { FC, useState } from 'react';
import { GetRoomSession, GetUserProfile, LocalizeText, SendMessageComposer } from '../../api';
import { Flex, Grid, LayoutBadgeImageView, Text } from '../../common';
import { useMessageEvent, useNitroEvent } from '../../hooks';
import { NitroCard } from '../../layout';
import { FriendsContainerView } from './FriendsContainerView';
import { GroupsContainerView } from './GroupsContainerView';
import { UserContainerView } from './UserContainerView';

export const UserProfileView: FC<{}> = props =>
{
    const [ userProfile, setUserProfile ] = useState<UserProfileParser>(null);
    const [ userBadges, setUserBadges ] = useState<string[]>([]);
    const [ userRelationships, setUserRelationships ] = useState<RelationshipStatusInfoMessageParser>(null);

    const onClose = () =>
    {
        setUserProfile(null);
        setUserBadges([]);
        setUserRelationships(null);
    };

    const onLeaveGroup = () =>
    {
        if(!userProfile || (userProfile.id !== GetSessionDataManager().userId)) return;

        GetUserProfile(userProfile.id);
    };

    useMessageEvent<UserCurrentBadgesEvent>(UserCurrentBadgesEvent, event =>
    {
        const parser = event.getParser();

        if(!userProfile || (parser.userId !== userProfile.id)) return;

        setUserBadges(parser.badges);
    });

    useMessageEvent<RelationshipStatusInfoEvent>(RelationshipStatusInfoEvent, event =>
    {
        const parser = event.getParser();

        if(!userProfile || (parser.userId !== userProfile.id)) return;

        setUserRelationships(parser);
    });

    useMessageEvent<UserProfileEvent>(UserProfileEvent, event =>
    {
        const parser = event.getParser();

        let isSameProfile = false;

        setUserProfile(prevValue =>
        {
            if(prevValue && prevValue.id) isSameProfile = (prevValue.id === parser.id);

            return parser;
        });

        if(!isSameProfile)
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

        if(parser.userId != userProfile?.id) return;

        GetUserProfile(parser.userId);
    });

    useNitroEvent<RoomEngineObjectEvent>(RoomEngineObjectEvent.SELECTED, event =>
    {
        if(!userProfile) return;

        if(event.category !== RoomObjectCategory.UNIT) return;

        const userData = GetRoomSession().userDataManager.getUserDataByIndex(event.objectId);

        if(userData.type !== RoomObjectType.USER) return;

        GetUserProfile(userData.webID);
    });

    if(!userProfile) return null;

    return (
        <NitroCard className="w-[470px] h-[460px]" uniqueKey="nitro-user-profile">
            <NitroCard.Header
                headerText={ LocalizeText('extendedprofile.caption') }
                onCloseClick={ onClose } />
            <NitroCard.Content
                className="overflow-hidden">
                <Grid fullHeight={ false } gap={ 2 }>
                    <div className="flex flex-col col-span-7 gap-1 border-r border-r-gray pe-2">
                        <UserContainerView userProfile={ userProfile } />
                        <div className="flex items-center justify-center w-full gap-3 p-2 rounded bg-muted">
                            { userBadges && (userBadges.length > 0) && userBadges.map((badge, index) => <LayoutBadgeImageView key={ badge } badgeCode={ badge } />) }
                        </div>
                    </div>
                    <div className="flex flex-col col-span-5">
                        { userRelationships &&
                            <FriendsContainerView friendsCount={ userProfile.friendsCount } relationships={ userRelationships } /> }
                    </div>
                </Grid>
                <Flex alignItems="center" className="px-2 py-1 border-t border-b border-t-gray border-b-gray">
                    <Flex alignItems="center" gap={ 1 } onClick={ event => CreateLinkEvent(`navigator/search/hotel_view/owner:${ userProfile.username }`) }>
                        <i className="nitro-icon icon-rooms" />
                        <Text bold pointer underline>{ LocalizeText('extendedprofile.rooms') }</Text>
                    </Flex>
                </Flex>
                <GroupsContainerView fullWidth groups={ userProfile.groups } itsMe={ userProfile.id === GetSessionDataManager().userId } onLeaveGroup={ onLeaveGroup } />
            </NitroCard.Content>
        </NitroCard>
    );
};
