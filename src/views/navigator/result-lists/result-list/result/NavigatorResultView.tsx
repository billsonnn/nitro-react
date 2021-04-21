import classNames from 'classnames';
import { RoomDataParser } from 'nitro-renderer';
import React from 'react';
import { NavigatorContext } from '../../../NavigatorView';
import { NavigatorResultViewProps } from './NavigatorResultView.types';

export function NavigatorResultView(props: NavigatorResultViewProps): JSX.Element
{
    const { result = null } = props;

    function getUserCounterColor(): string
    {
        const num: number = (100 * (result.userCount / result.maxUserCount));

        let bg = 'badge-primary';

        if(num >= 92)
        {
            bg = 'badge-danger';
        }
        else if(num >= 50)
        {
            bg = 'badge-warning text-white';
        }
        else if(num > 0)
        {
            bg = 'badge-success';
        }

        return bg;
    }

    function openInfo(event: React.MouseEvent): void
    {
        event.stopPropagation();
        console.log('info');
    }

    return (
        <NavigatorContext.Consumer>
        { navigatorContext => {
            return <div className="d-flex flex-column justify-content-center align-items-center nitro-navigator-result" onClick={ () => navigatorContext.onTryVisitRoom(result) }>
                        <div className="d-flex justify-content-between w-100 px-2 py-1">
                            <div className="d-flex justify-content-center flex-grow-1 overflow-hidden">
                                <div className={ "d-flex justify-content-center align-items-center badge text-center " + getUserCounterColor() }>
                                    <i className="fas fa-user mr-1 small"></i> { result.userCount }
                                </div>
                                <div className="d-flex flex-column justify-content-center align-items-start flex-grow-1 px-2 overflow-hidden">
                                    <span className="d-block text-truncate" style={ { maxWidth: '95%' } }>{ result.roomName }</span>
                                </div>
                            </div>
                            <div className="d-flex flex-row-reverse align-items-center">
                                <i className="fas fa-info-circle small" onClick={ openInfo }></i>
                                { result.habboGroupId > 0 && <i className="fas fa-users mr-2 small"></i> }
                                { result.doorMode !== RoomDataParser.OPEN_STATE && 
                                    <i className={ "mr-2 fas small" + classNames( {'fa-lock': result.doorMode === RoomDataParser.DOORBELL_STATE, 'fa-key': result.doorMode === RoomDataParser.PASSWORD_STATE })}></i>
                                }
                            </div>
                        </div>
                    </div>
        }}
        </NavigatorContext.Consumer>
    );
}
