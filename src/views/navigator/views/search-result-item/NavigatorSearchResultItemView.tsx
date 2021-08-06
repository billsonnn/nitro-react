import { RoomDataParser } from '@nitrots/nitro-renderer';
import classNames from 'classnames';
import { FC, MouseEvent } from 'react';
import { TryVisitRoom } from '../../../../api/navigator/TryVisitRoom';
import { NavigatorSearchResultItemViewProps } from './NavigatorSearchResultItemView.types';

export const NavigatorSearchResultItemView: FC<NavigatorSearchResultItemViewProps> = props =>
{
    const { roomData = null } = props;

    function getUserCounterColor(): string
    {
        const num: number = (100 * (roomData.userCount / roomData.maxUserCount));

        let bg = 'bg-primary';

        if(num >= 92)
        {
            bg = 'bg-danger';
        }
        else if(num >= 50)
        {
            bg = 'bg-warning';
        }
        else if(num > 0)
        {
            bg = 'bg-success';
        }

        return bg;
    }

    function openInfo(event: MouseEvent): void
    {
        event.stopPropagation();
        console.log('info');
    }

    function visitRoom(): void
    {
        TryVisitRoom(roomData.roomId);
    }

    return (
        <div className="col">
            <div className="d-flex flex-column justify-content-center align-items-center nitro-navigator-result small cursor-pointer" onClick={ visitRoom }>
                <div className="d-flex justify-content-between w-100 px-2 py-1">
                    <div className="d-flex justify-content-center flex-grow-1 overflow-hidden">
                        <div className={ 'd-flex align-items-center justify-content-center badge p-1 ' + getUserCounterColor() }>
                            <i className="fas fa-user"></i>
                            { roomData.userCount }
                        </div>
                        <div className="d-flex flex-column justify-content-center align-items-start flex-grow-1 px-2 overflow-hidden">
                            <span className="d-block text-truncate" style={ { maxWidth: '95%' } }>{ roomData.roomName }</span>
                        </div>
                    </div>
                    <div className="d-flex flex-row-reverse align-items-center">
                        <i className="fas fa-info-circle text-secondary" onClick={ openInfo }></i>
                        { roomData.habboGroupId > 0 && <i className="fas fa-users mr-2"></i> }
                        { roomData.doorMode !== RoomDataParser.OPEN_STATE && 
                            <i className={ 'mr-2 fas ' + classNames( {'fa-lock': roomData.doorMode === RoomDataParser.DOORBELL_STATE, 'fa-key': roomData.doorMode === RoomDataParser.PASSWORD_STATE })}></i>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
