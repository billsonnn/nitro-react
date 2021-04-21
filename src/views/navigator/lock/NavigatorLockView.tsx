import { RoomDataParser } from 'nitro-renderer';
import { DraggableWindow } from '../../../hooks/draggable-window/DraggableWindow';
import { LocalizeText } from '../../../utils/LocalizeText';
import { NavigatorLockDoorbellView } from './doorbell/NavigatorLockDoorbellView';
import { NavigatorLockViewProps } from './NavigatorLockView.types';
import { NavigatorLockPasswordView } from './password/NavigatorLockPasswordView';

export function NavigatorLockView(props: NavigatorLockViewProps): JSX.Element
{
    const { roomData = null, stage = null, onHideLock = null, onVisitRoom = null } = props;

    function visitRoom(password?: string): void
    {
        onVisitRoom(roomData.roomId, password);
    }

    return (
        <DraggableWindow handle=".drag-handler">
            <div className="nitro-navigator-lock d-flex flex-column bg-primary border border-black shadow rounded position-absolute">
                <div className="drag-handler d-flex justify-content-between align-items-center px-3 pt-3">
                    <div className="h6 m-0">{ LocalizeText(roomData.doorMode === RoomDataParser.PASSWORD_STATE ? 'navigator.password.title' : 'navigator.doorbell.title') }</div>
                    <button type="button" className="close" onClick={ onHideLock }>
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <div className="p-3">
                    { roomData && <>
                        <h5>{ roomData.roomName }</h5>
                        { roomData.doorMode && roomData.doorMode === RoomDataParser.DOORBELL_STATE && <NavigatorLockDoorbellView stage={stage} onVisitRoom={ visitRoom } onHideLock={ onHideLock } /> }
                        { roomData.doorMode && roomData.doorMode === RoomDataParser.PASSWORD_STATE && <NavigatorLockPasswordView stage={stage} onVisitRoom={ visitRoom } onHideLock={ onHideLock } /> }
                    </> }
                </div>
            </div>
        </DraggableWindow>
    );
}
