import { FC, useCallback } from 'react';
import { LocalizeText, RoomWidgetFriendRequestMessage } from '../../../../api';
import { NitroLayoutButton, NitroLayoutFlex, NitroLayoutFlexColumn } from '../../../../layout';
import { NitroLayoutBase } from '../../../../layout/base';
import { useRoomContext } from '../../context/RoomContext';
import { UserLocationView } from '../user-location/UserLocationView';
import { FriendRequestDialogViewProps } from './FriendRequestDialogView.types';

export const FriendRequestDialogView: FC<FriendRequestDialogViewProps> = props =>
{
    const { requestId = -1, userId = -1, userName = null, close = null } = props;
    const { widgetHandler = null } = useRoomContext();

    const accept = useCallback(() =>
    {
        widgetHandler.processWidgetMessage(new RoomWidgetFriendRequestMessage(RoomWidgetFriendRequestMessage.ACCEPT, requestId));

        close();
    }, [ requestId, widgetHandler, close ]);

    const decline = useCallback(() =>
    {
        widgetHandler.processWidgetMessage(new RoomWidgetFriendRequestMessage(RoomWidgetFriendRequestMessage.ACCEPT, requestId));

        close();
    }, [ requestId, widgetHandler, close ]);

    return (
        <UserLocationView userId={ userId }>
            <NitroLayoutBase className="nitro-friend-request-dialog nitro-context-menu p-2">
                <NitroLayoutFlexColumn>
                    <NitroLayoutBase className="h6">
                        { LocalizeText('widget.friendrequest.from', [ 'username' ], [ userName ]) }
                    </NitroLayoutBase>
                    <NitroLayoutFlex className="justify-content-end align-items-center" gap={ 2 }>
                        <NitroLayoutButton variant="danger" size="sm" onClick={ decline }>
                            { LocalizeText('widget.friendrequest.decline') }
                        </NitroLayoutButton>
                        <NitroLayoutButton variant="success" size="sm" onClick={ accept }>
                            { LocalizeText('widget.friendrequest.accept') }
                        </NitroLayoutButton>
                    </NitroLayoutFlex>
                </NitroLayoutFlexColumn>
            </NitroLayoutBase>
        </UserLocationView>
    );
}
