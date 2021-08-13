import { FC, useCallback } from 'react';
import { CreateRoomSession, GoToDesktop } from '../../../../api';
import { UpdateDoorStateEvent } from '../../../../events';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../layout';
import { LocalizeText } from '../../../../utils';
import { NavigatorRoomDoorbellViewProps } from './NavigatorRoomDoorbellView.types';

export const NavigatorRoomDoorbellView: FC<NavigatorRoomDoorbellViewProps> = props =>
{
    const { roomData = null, state = null, onClose = null } = props;

    const close = useCallback(() =>
    {
        if(state === UpdateDoorStateEvent.STATE_WAITING) GoToDesktop();

        onClose(null);
    }, [ state, onClose ]);

    const ring = useCallback(() =>
    {
        if(!roomData) return;

        CreateRoomSession(roomData.roomId);

        onClose(UpdateDoorStateEvent.STATE_PENDING_SERVER);
    }, [ roomData, onClose ]);

    return (
        <NitroCardView className="nitro-navigator-doorbell" simple={ true }>
            <NitroCardHeaderView headerText={ LocalizeText('navigator.doorbell.title') } onCloseClick={ close } />
            <NitroCardContentView className="text-black d-flex flex-column">
                { roomData && <span className="fw-bold">{ roomData.roomName }</span> }
                { (state === UpdateDoorStateEvent.START_DOORBELL) && <span>{ LocalizeText('navigator.doorbell.info') }</span> }
                { (state === UpdateDoorStateEvent.STATE_WAITING) && <span>{ LocalizeText('navigator.doorbell.waiting') }</span> }
                { (state === UpdateDoorStateEvent.STATE_NO_ANSWER) && <span>{ LocalizeText('navigator.doorbell.no.answer') }</span> }
                <div className="d-flex flex-column mt-1">
                    { (state === UpdateDoorStateEvent.START_DOORBELL) && <button type="button" className="btn btn-success btn-sm" onClick={ ring }>{ LocalizeText('navigator.doorbell.button.ring') }</button> }
                    <button type="button" className="btn btn-danger btn-sm mt-1" onClick={ close }>{ LocalizeText('generic.cancel') }</button>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
}
