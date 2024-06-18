import { BannedUserData, BannedUsersFromRoomEvent, RoomBannedUsersComposer, RoomModerationSettings, RoomUnbanUserComposer } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { IRoomData, LocalizeText, SendMessageComposer } from '../../../../api';
import { Button, Column, Flex, Grid, Text, UserProfileIconView } from '../../../../common';
import { useMessageEvent } from '../../../../hooks';

interface NavigatorRoomSettingsTabViewProps
{
    roomData: IRoomData;
    handleChange: (field: string, value: string | number | boolean) => void;
}

export const NavigatorRoomSettingsModTabView: FC<NavigatorRoomSettingsTabViewProps> = props =>
{
    const { roomData = null, handleChange = null } = props;
    const [ selectedUserId, setSelectedUserId ] = useState<number>(-1);
    const [ bannedUsers, setBannedUsers ] = useState<BannedUserData[]>([]);

    const unBanUser = (userId: number) =>
    {
        setBannedUsers(prevValue =>
        {
            const newValue = [ ...prevValue ];

            const index = newValue.findIndex(value => (value.userId === userId));

            if(index >= 0) newValue.splice(index, 1);

            return newValue;
        });

        SendMessageComposer(new RoomUnbanUserComposer(userId, roomData.roomId));

        setSelectedUserId(-1);
    };

    useMessageEvent<BannedUsersFromRoomEvent>(BannedUsersFromRoomEvent, event =>
    {
        const parser = event.getParser();

        if(!roomData || (roomData.roomId !== parser.roomId)) return;

        setBannedUsers(parser.bannedUsers);
    });

    useEffect(() =>
    {
        SendMessageComposer(new RoomBannedUsersComposer(roomData.roomId));
    }, [ roomData.roomId ]);

    return (
        <Grid overflow="auto">
            <Column size={ 6 }>
                <Text bold>{ LocalizeText('navigator.roomsettings.moderation.banned.users') } ({ bannedUsers.length })</Text>
                <Flex className="bg-white rounded list-container p-2" overflow="hidden">
                    <Column fullWidth gap={ 1 } overflow="auto">
                        { bannedUsers && (bannedUsers.length > 0) && bannedUsers.map((user, index) =>
                        {
                            return (
                                <Flex key={ index } shrink alignItems="center" gap={ 1 } overflow="hidden">
                                    <UserProfileIconView userName={ user.userName } />
                                    <Text grow pointer onClick={ event => setSelectedUserId(user.userId) }> { user.userName }</Text>
                                </Flex>
                            );
                        }) }
                    </Column>
                </Flex>
                <Button disabled={ (selectedUserId <= 0) } onClick={ event => unBanUser(selectedUserId) }>
                    { LocalizeText('navigator.roomsettings.moderation.unban') } { selectedUserId > 0 && bannedUsers.find(user => (user.userId === selectedUserId))?.userName }
                </Button>
            </Column>
            <Column size={ 6 }>
                <div className="flex flex-col gap-1">
                    <Text bold>{ LocalizeText('navigator.roomsettings.moderation.mute.header') }</Text>
                    <div className="flex items-center gap-1">
                        <select className="form-select form-select-sm" value={ roomData.moderationSettings.allowMute } onChange={ event => handleChange('moderation_mute', event.target.value) }>
                            <option value={ RoomModerationSettings.MODERATION_LEVEL_NONE }>
                                { LocalizeText('navigator.roomsettings.moderation.none') }
                            </option>
                            <option value={ RoomModerationSettings.MODERATION_LEVEL_USER_WITH_RIGHTS }>
                                { LocalizeText('navigator.roomsettings.moderation.rights') }
                            </option>
                        </select>
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <Text bold>{ LocalizeText('navigator.roomsettings.moderation.kick.header') }</Text>
                    <div className="flex items-center gap-1">
                        <select className="form-select form-select-sm" value={ roomData.moderationSettings.allowKick } onChange={ event => handleChange('moderation_kick', event.target.value) }>
                            <option value={ RoomModerationSettings.MODERATION_LEVEL_NONE }>
                                { LocalizeText('navigator.roomsettings.moderation.none') }
                            </option>
                            <option value={ RoomModerationSettings.MODERATION_LEVEL_USER_WITH_RIGHTS }>
                                { LocalizeText('navigator.roomsettings.moderation.rights') }
                            </option>
                            <option value={ RoomModerationSettings.MODERATION_LEVEL_ALL }>
                                { LocalizeText('navigator.roomsettings.moderation.all') }
                            </option>
                        </select>
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <Text bold>{ LocalizeText('navigator.roomsettings.moderation.ban.header') }</Text>
                    <div className="flex items-center gap-1">
                        <select className="form-select form-select-sm" value={ roomData.moderationSettings.allowBan } onChange={ event => handleChange('moderation_ban', event.target.value) }>
                            <option value={ RoomModerationSettings.MODERATION_LEVEL_NONE }>
                                { LocalizeText('navigator.roomsettings.moderation.none') }
                            </option>
                            <option value={ RoomModerationSettings.MODERATION_LEVEL_USER_WITH_RIGHTS }>
                                { LocalizeText('navigator.roomsettings.moderation.rights') }
                            </option>
                        </select>
                    </div>
                </div>
            </Column>
        </Grid>
    );
};
