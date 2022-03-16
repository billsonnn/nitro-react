import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';
import { LocalizeText, RoomWidgetFriendRequestMessage } from '../../../../api';
import { Base, Button, Column, Flex, Text } from '../../../../common';
import { useRoomContext } from '../../RoomContext';
import { UserLocationView } from '../user-location/UserLocationView';

interface FriendRequestDialogViewProps
{
    requestId: number;
    userId: number;
    userName: string;
    close: () => void;
}

export const FriendRequestDialogView: FC<FriendRequestDialogViewProps> = props =>
{
    const { requestId = -1, userId = -1, userName = null, close = null } = props;
    const { widgetHandler = null } = useRoomContext();

    const respond = (flag: boolean) =>
    {
        widgetHandler.processWidgetMessage(new RoomWidgetFriendRequestMessage((flag ? RoomWidgetFriendRequestMessage.ACCEPT : RoomWidgetFriendRequestMessage.DECLINE), requestId));

        close();
    }

    return (
        <UserLocationView userId={ userId }>
            <Base className="nitro-friend-request-dialog nitro-context-menu p-2">
                <Column>
                    <Flex alignItems="center" justifyContent="between" gap={ 2 }>
                        <Text variant="white" fontSize={ 6 }>{ LocalizeText('widget.friendrequest.from', [ 'username' ], [ userName ]) }</Text>
                        <FontAwesomeIcon icon="times" className="cursor-pointer" onClick={ close } />
                    </Flex>
                    <Flex justifyContent="end" gap={ 1 }>
                        <Button variant="danger" onClick={ event => respond(false) }>{ LocalizeText('widget.friendrequest.decline') }</Button>
                        <Button variant="success" onClick={ event => respond(true) }>{ LocalizeText('widget.friendrequest.accept') }</Button>
                    </Flex>
                </Column>
            </Base>
        </UserLocationView>
    );
}
