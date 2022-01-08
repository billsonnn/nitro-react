import { FC, useMemo } from 'react';
import { GetRoomObjectBounds, GetRoomSession } from '../../../../../../api';
import { DraggableWindow, DraggableWindowPosition } from '../../../../../../layout';
import { AvatarInfoRentableBotChatViewProps } from './AvatarInfoRentableBotChatView.types';

export const AvatarInfoRentableBotChatView: FC<AvatarInfoRentableBotChatViewProps> = props =>
{
    const { chatEvent = null } = props;

    const getObjectLocation = useMemo(() =>
    {
        return GetRoomObjectBounds(GetRoomSession().roomId, chatEvent.objectId, chatEvent.category, 1);
    }, [ chatEvent ]);

    return (
        <DraggableWindow position={ DraggableWindowPosition.NOTHING } handleSelector=".drag-handler" style={ { top: getObjectLocation.y, left: getObjectLocation.x } }>
            <div className="nitro-context-menu">
                <div className="drag-handler">test!!!!!</div>
            </div>
        </DraggableWindow>
    );
}
