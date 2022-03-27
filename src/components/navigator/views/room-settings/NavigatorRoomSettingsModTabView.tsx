import { BannedUserData, BannedUsersFromRoomEvent, RoomBannedUsersComposer, RoomUnbanUserComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { IRoomData, LocalizeText, SendMessageComposer } from '../../../../api';
import { Button, Column, Flex, Grid, Text, UserProfileIconView } from '../../../../common';
import { UseMessageEventHook } from '../../../../hooks';

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

    const onBannedUsersFromRoomEvent = useCallback((event: BannedUsersFromRoomEvent) =>
    {
        const parser = event.getParser();

        if(!roomData || (roomData.roomId !== parser.roomId)) return;

        setBannedUsers(parser.bannedUsers);
    }, [ roomData ]);

    UseMessageEventHook(BannedUsersFromRoomEvent, onBannedUsersFromRoomEvent);

    const unBanUser = useCallback((userId: number) =>
    {
        setBannedUsers(prevValue =>
            {
                const newValue = [ ...prevValue ];

                const index = newValue.findIndex(value => (value.userId === userId));

                if(index >= 0) newValue.splice(index, 1);

                return newValue;
            })

        SendMessageComposer(new RoomUnbanUserComposer(userId, roomData.roomId));

        setSelectedUserId(-1);
    }, [ roomData ]);

    useEffect(() =>
    {
        SendMessageComposer(new RoomBannedUsersComposer(roomData.roomId));
    }, [ roomData.roomId ]);

    return (
        <Grid overflow="auto">
            <Column size={ 6 }>
                <Text bold>{ LocalizeText('navigator.roomsettings.moderation.banned.users') } ({ bannedUsers.length })</Text>
                <Flex overflow="hidden" className="bg-white rounded list-container p-2">
                    <Column fullWidth overflow="auto" gap={ 1 }>
                        { bannedUsers && (bannedUsers.length > 0) && bannedUsers.map((user, index) =>
                            {
                                return (
                                    <Flex key={ index } shrink alignItems="center" gap={ 1 } overflow="hidden">
                                        <UserProfileIconView userName={ user.userName } />
                                        <Text pointer grow onClick={ event => setSelectedUserId(user.userId) }> { user.userName }</Text>
                                    </Flex>
                                );
                            }) }
                    </Column>
                </Flex>
                <Button disabled={ (selectedUserId <= 0) } onClick={ event => unBanUser(selectedUserId) }>
                    { LocalizeText('navigator.roomsettings.moderation.unban') } {selectedUserId > 0 && bannedUsers.find(user => (user.userId === selectedUserId))?.userName }
                </Button>
            </Column>
            <Column size={ 6 }>
                <Column gap={ 1 }>
                    <Text bold>{ LocalizeText('navigator.roomsettings.moderation.mute.header') }</Text>
                    <Flex alignItems="center" gap={ 1 }>
                        <input className="form-check-input" type="checkbox" checked={ (roomData.moderationSettings.allowMute === 1) } onChange={ event => handleChange('moderation_mute', (event.target.checked ? 1 : 0)) } />
                        <Text>{ LocalizeText('navigator.roomsettings.moderation.rights') }</Text>
                    </Flex>
                </Column>
                <Column gap={ 1 }>
                    <Text bold>{LocalizeText('navigator.roomsettings.moderation.kick.header')}</Text>
                    <Flex alignItems="center" gap={ 1 }>
                        <input className="form-check-input" type="checkbox" checked={ (roomData.moderationSettings.allowKick === 0) } onChange={ event => handleChange('moderation_kick', (event.target.checked ? 0 : 2)) } />
                        <Text>{ LocalizeText('navigator.roomsettings.moderation.all') }</Text>
                    </Flex>
                    <Flex alignItems="center" gap={ 1 }>
                        <input className="form-check-input" type="checkbox" checked={ ((roomData.moderationSettings.allowKick === 1) || (roomData.moderationSettings.allowKick === 0)) } disabled={ (roomData.moderationSettings.allowKick === 0) } onChange={ event => handleChange('moderation_kick', (event.target.checked ? 1 : 2)) } />
                        <Text>{ LocalizeText('navigator.roomsettings.moderation.rights') }</Text>
                    </Flex>
                </Column>
                <Column gap={ 1 }>
                    <Text bold>{LocalizeText('navigator.roomsettings.moderation.ban.header')}</Text>
                    <Flex alignItems="center" gap={ 1 }>
                        <input className="form-check-input" type="checkbox" checked={ (roomData.moderationSettings.allowBan === 1) } onChange={ event => handleChange('moderation_ban', (event.target.checked ? 1 : 0)) } />
                        <Text>{ LocalizeText('navigator.roomsettings.moderation.rights') }</Text>
                    </Flex>
                </Column>
            </Column>
        </Grid>
    );
}
