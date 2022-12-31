import { FlatControllerAddedEvent, FlatControllerRemovedEvent, FlatControllersEvent, RemoveAllRightsMessageComposer, RoomGiveRightsComposer, RoomTakeRightsComposer, RoomUsersWithRightsComposer } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { IRoomData, LocalizeText, MessengerFriend, SendMessageComposer } from '../../../../api';
import { Button, Column, Flex, Grid, Text, UserProfileIconView } from '../../../../common';
import { useFriends, useMessageEvent } from '../../../../hooks';

interface NavigatorRoomSettingsTabViewProps
{
    roomData: IRoomData;
    handleChange: (field: string, value: string | number | boolean) => void;
}

export const NavigatorRoomSettingsRightsTabView: FC<NavigatorRoomSettingsTabViewProps> = props =>
{
    const { roomData = null } = props;
    const [ usersWithRights, setUsersWithRights ] = useState<Map<number, string>>(new Map());
    const { friends = [] } = useFriends();

    useMessageEvent<FlatControllersEvent>(FlatControllersEvent, event =>
    {
        const parser = event.getParser();

        if(!roomData || (roomData.roomId !== parser.roomId)) return;

        setUsersWithRights(parser.users);
    });

    useMessageEvent<FlatControllerAddedEvent>(FlatControllerAddedEvent, event =>
    {
        const parser = event.getParser();

        if(!roomData || (roomData.roomId !== parser.roomId)) return;

        setUsersWithRights(prevValue =>
        {
            const newValue = new Map(prevValue);

            newValue.set(parser.data.userId, parser.data.userName);

            return newValue;
        });
    });

    useMessageEvent<FlatControllerRemovedEvent>(FlatControllerRemovedEvent, event =>
    {
        const parser = event.getParser();

        if(!roomData || (roomData.roomId !== parser.roomId)) return;

        setUsersWithRights(prevValue =>
        {
            const newValue = new Map(prevValue);

            newValue.delete(parser.userId);

            return newValue;
        });
    });

    useEffect(() =>
    {
        SendMessageComposer(new RoomUsersWithRightsComposer(roomData.roomId));
    }, [ roomData.roomId ]);

    const friendsWithoutRights = friends.map( (friend: MessengerFriend) => friend ).filter(friend => friend.id !== -1 && !Array.from(usersWithRights.keys()).includes(friend.id));

    return (
        <Grid>
            <Column size={ 6 }>
                <Text bold>
                    { LocalizeText('navigator.flatctrls.userswithrights', [ 'displayed', 'total' ], [ usersWithRights.size.toString(), usersWithRights.size.toString() ]) }
                </Text>
                <Flex overflow="hidden" className="bg-white rounded list-container p-2">
                    <Column fullWidth overflow="auto" gap={ 1 }>
                        { Array.from(usersWithRights.entries()).map(([ id, name ], index) =>
                        {
                            return (
                                <Flex key={ index } shrink alignItems="center" gap={ 1 } overflow="hidden">
                                    <UserProfileIconView userId={ id } />
                                    <Text pointer grow onClick={ event => SendMessageComposer(new RoomTakeRightsComposer(id)) }> { name }</Text>
                                </Flex>
                            );
                        }) }
                    </Column>
                </Flex>
                <Column>
                    <Button variant="danger" disabled={ !usersWithRights.size } onClick={ event => SendMessageComposer(new RemoveAllRightsMessageComposer(roomData.roomId)) } >
                        { LocalizeText('navigator.flatctrls.clear') }
                    </Button>
                </Column>
            </Column>
            <Column size={ 6 }>
                <Text bold>
                    { LocalizeText('navigator.flatctrls.friends', [ 'displayed', 'total' ], [ friendsWithoutRights.length.toString(), friendsWithoutRights.length.toString() ]) }
                </Text>
                <Flex overflow="hidden" className="bg-white rounded list-container p-2">
                    <Column fullWidth overflow="auto" gap={ 1 }>
                        { friendsWithoutRights && friendsWithoutRights.map((friend: MessengerFriend, index) =>
                        {
                            return (
                                <Flex key={ index } shrink alignItems="center" gap={ 1 } overflow="hidden">
                                    <UserProfileIconView userId={ friend.id } />
                                    <Text pointer grow onClick={ event => SendMessageComposer(new RoomGiveRightsComposer(friend.id)) }> { friend.name }</Text>
                                </Flex>
                            );
                        }) }
                    </Column>
                </Flex>
            </Column>
        </Grid>
    );
}
