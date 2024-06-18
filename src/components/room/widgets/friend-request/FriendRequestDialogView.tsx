import { RoomObjectCategory } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { FaTimes } from 'react-icons/fa';
import { LocalizeText, MessengerRequest } from '../../../../api';
import { Button, Text } from '../../../../common';
import { ObjectLocationView } from '../object-location/ObjectLocationView';

export const FriendRequestDialogView: FC<{ roomIndex: number, request: MessengerRequest, hideFriendRequest: (userId: number) => void, requestResponse: (requestId: number, flag: boolean) => void }> = props =>
{
    const { roomIndex = -1, request = null, hideFriendRequest = null, requestResponse = null } = props;

    return (
        <ObjectLocationView category={ RoomObjectCategory.UNIT } objectId={ roomIndex }>
            <div className="nitro-friend-request-dialog nitro-context-menu p-2">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 justify-between">
                        <Text fontSize={ 6 } variant="white">{ LocalizeText('widget.friendrequest.from', [ 'username' ], [ request.name ]) }</Text>
                        <FaTimes className="cursor-pointer fa-icon" onClick={ event => hideFriendRequest(request.requesterUserId) } />
                    </div>
                    <div className="flex justify-end gap-1">
                        <Button variant="danger" onClick={ event => requestResponse(request.requesterUserId, false) }>{ LocalizeText('widget.friendrequest.decline') }</Button>
                        <Button variant="success" onClick={ event => requestResponse(request.requesterUserId, true) }>{ LocalizeText('widget.friendrequest.accept') }</Button>
                    </div>
                </div>
            </div>
        </ObjectLocationView>
    );
};
