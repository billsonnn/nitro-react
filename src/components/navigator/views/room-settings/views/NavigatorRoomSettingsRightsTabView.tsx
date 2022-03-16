import { RemoveAllRightsMessageComposer, RoomTakeRightsComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { LocalizeText, SendMessageComposer } from '../../../../../api';
import { Button, Column, Flex, Grid, Text, UserProfileIconView } from '../../../../../common';
import { NavigatorRoomSettingsTabViewProps } from './NavigatorRoomSettingsTabViewProps.types';

export const NavigatorRoomSettingsRightsTabView: FC<NavigatorRoomSettingsTabViewProps> = props =>
{
    const { roomSettingsData = null, handleChange = null } = props;

    const removeUserRights = useCallback( (userId: number) =>
    {
        handleChange('remove_rights_user', userId);

        SendMessageComposer(new RoomTakeRightsComposer(userId));
    }, [ handleChange ]);

    const removeAllRights = useCallback( () =>
    {
        handleChange('remove_all_rights', null);
        
        SendMessageComposer(new RemoveAllRightsMessageComposer(roomSettingsData.roomId));
    }, [ roomSettingsData, handleChange ]);

    return (
        <Grid>
            <Column size={ 6 }>
                <Text bold>
                    { LocalizeText('navigator.flatctrls.userswithrights', [ 'displayed', 'total' ], [ roomSettingsData.usersWithRights.size.toString(), roomSettingsData.usersWithRights.size.toString() ]) }
                </Text>
                <Flex overflow="hidden" className="bg-white rounded list-container p-2">
                    <Column fullWidth overflow="auto" gap={ 1 }>
                        { Array.from(roomSettingsData.usersWithRights.entries()).map(([id, name], index) =>
                            {
                                return (
                                    <Flex key={ index } shrink alignItems="center" gap={ 1 } overflow="hidden">
                                        <UserProfileIconView userName={ name } />
                                        <Text pointer grow key={index} onClick={ event => removeUserRights(id) }> { name }</Text>
                                    </Flex>
                                );
                            }) }
                    </Column>
                </Flex>
                <Button variant="danger" disabled={ !roomSettingsData.usersWithRights.size } onClick={ removeAllRights } >
                    { LocalizeText('navigator.flatctrls.clear') }
                </Button>
            </Column>
            <Column size={ 6 }>
                <Column gap={ 1 }>
                    <Text bold>{ LocalizeText('navigator.roomsettings.moderation.mute.header') }</Text>
                    <Flex alignItems="center" gap={ 1 }>
                        <input className="form-check-input" type="checkbox" checked={ (roomSettingsData.muteState === 1) } onChange={ event => handleChange('moderation_mute', (event.target.checked ? 1 : 0)) } />
                        <Text>{ LocalizeText('navigator.roomsettings.moderation.rights') }</Text>
                    </Flex>
                </Column>
                <Column gap={ 1 }>
                    <Text bold>{LocalizeText('navigator.roomsettings.moderation.kick.header')}</Text>
                    <Flex alignItems="center" gap={ 1 }>
                        <input className="form-check-input" type="checkbox" checked={ (roomSettingsData.kickState === 0) } onChange={ event => handleChange('moderation_kick', (event.target.checked ? 0 : 2)) } />
                        <Text>{ LocalizeText('navigator.roomsettings.moderation.all') }</Text>
                    </Flex>
                    <Flex alignItems="center" gap={ 1 }>
                        <input className="form-check-input" type="checkbox" checked={ ((roomSettingsData.kickState === 1) || (roomSettingsData.kickState === 0)) } disabled={ (roomSettingsData.kickState === 0) } onChange={ event => handleChange('moderation_kick', (event.target.checked ? 1 : 2)) } />
                        <Text>{ LocalizeText('navigator.roomsettings.moderation.rights') }</Text>
                    </Flex>
                </Column>
                <Column gap={ 1 }>
                    <Text bold>{LocalizeText('navigator.roomsettings.moderation.ban.header')}</Text>
                    <Flex alignItems="center" gap={ 1 }>
                        <input className="form-check-input" type="checkbox" checked={ (roomSettingsData.banState === 1) } onChange={ event => handleChange('moderation_ban', (event.target.checked ? 1 : 0)) } />
                        <Text>{ LocalizeText('navigator.roomsettings.moderation.rights') }</Text>
                    </Flex>
                </Column>
            </Column>
        </Grid>
    );
}
