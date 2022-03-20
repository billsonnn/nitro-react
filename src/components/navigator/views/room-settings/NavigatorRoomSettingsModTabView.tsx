import { RoomUnbanUserComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { LocalizeText, SendMessageComposer } from '../../../../api';
import { Base, Button, Column, Grid, Text } from '../../../../common';
import RoomSettingsData from '../../common/RoomSettingsData';

interface NavigatorRoomSettingsTabViewProps
{
    roomSettingsData: RoomSettingsData;
    handleChange: (field: string, value: string | number | boolean) => void;
}

export const NavigatorRoomSettingsModTabView: FC<NavigatorRoomSettingsTabViewProps> = props =>
{
    const { roomSettingsData = null, handleChange = null } = props;
    const [ selectedUserId, setSelectedUserId ] = useState<number>(-1);

    const unBanUser = useCallback((userId: number) =>
    {
        handleChange('unban_user', userId)

        SendMessageComposer(new RoomUnbanUserComposer(userId, roomSettingsData.roomId));
        setSelectedUserId(-1);
    }, [ roomSettingsData, handleChange ]);

    return (
        <Grid overflow="auto">
            <Column size={ 6 }>
            <Text bold>{ LocalizeText('navigator.roomsettings.moderation.banned.users') } ({ roomSettingsData.bannedUsers.length })</Text>
                <Column className="bg-white rounded" overflow="hidden">
                    <Base className="list-container" overflow="auto">
                        { roomSettingsData.bannedUsers.map((user, index) =>
                            {
                                return <Text key={ index } className={ ((user.userId === selectedUserId) ? 'selected' : '') } onClick={ event => setSelectedUserId(user.userId)}>{ user.userName }</Text>
                            }) }
                    </Base>
                </Column>
            </Column>
            <Column size={ 6 } justifyContent="end">
                <Button disabled={ (selectedUserId < 1) } onClick={ event => unBanUser(selectedUserId) }>
                    {/* { LocalizeText('navigator.roomsettings.moderation.unban')} {selectedUserId > 0 && roomSettingsData.bannedUsers.get(selectedUserId) } */}
                </Button>
            </Column>
        </Grid>
    );
}
