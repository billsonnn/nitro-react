import { FC, useCallback, useState } from 'react';
import { CreateRoomSession } from '../../../../api';
import { UpdateDoorStateEvent } from '../../../../events';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../layout';
import { LocalizeText } from '../../../../utils';
import { NavigatorRoomPasswordViewProps } from './NavigatorRoomPasswordView.types';

export const NavigatorRoomPasswordView: FC<NavigatorRoomPasswordViewProps> = props =>
{
    const { roomData = null, state = null, onClose = null } = props;
    const [ password, setPassword ] = useState('');

    const close = useCallback(() =>
    {
        onClose(null);
    }, [ onClose ]);

    const tryEntering = useCallback(() =>
    {
        if(!roomData) return;

        CreateRoomSession(roomData.roomId, password);

        onClose(UpdateDoorStateEvent.STATE_PENDING_SERVER);
    }, [ roomData, password, onClose ]);

    return (
        <NitroCardView className="nitro-navigator-password" simple={ true }>
            <NitroCardHeaderView headerText={ LocalizeText('navigator.password.title') } onCloseClick={ close } />
            <NitroCardContentView className="text-black d-flex flex-column">
                { roomData && <span className="fw-bold">{ roomData.roomName }</span> }
                { (state === UpdateDoorStateEvent.START_PASSWORD) && <span>{ LocalizeText('navigator.password.info') }</span> }
                { (state === UpdateDoorStateEvent.STATE_WRONG_PASSWORD) && <span>{ LocalizeText('navigator.password.retryinfo') }</span> }
                <div className="form-group mt-1">
                    <label>{ LocalizeText('navigator.password.enter') }</label>
                    <input type="password" className="form-control form-control-sm" onChange={ event => setPassword(event.target.value) } />
                </div>
                <div className="d-flex flex-column mt-1">
                    <button type="button" className="btn btn-success btn-sm" onClick={ tryEntering }>{ LocalizeText('navigator.password.button.try') }</button>
                    <button type="button" className="btn btn-danger btn-sm mt-1" onClick={ close }>{ LocalizeText('generic.cancel') }</button>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
}
