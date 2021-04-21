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
            return <div className="nitro-navigator-result rounded mt-1 py-1 px-2" onClick={ () => navigatorContext.onTryVisitRoom(result) }>
                        <div className="d-flex">
                            <div className="mr-2 align-self-center">
                                <div className={'badge badge-sm ' + getUserCounterColor() }><i className="fas fa-user"></i> { result.userCount }</div>
                            </div>
                            <div className="w-100 align-self-center">{ result.roomName }</div>
                            { result.doorMode !== RoomDataParser.OPEN_STATE && 
                                <div className="ml-2 small align-self-center">
                                    <i className={classNames({'fas': true, 'fa-lock': result.doorMode === RoomDataParser.DOORBELL_STATE, 'fa-key': result.doorMode === RoomDataParser.PASSWORD_STATE})}></i>
                                </div>
                            }
                            { result.habboGroupId > 0 && 
                                <div className="ml-2 small align-self-center">
                                    <i className="fas fa-users"></i>
                                </div>
                            }
                            <div className="ml-2 small align-self-center" onClick={ openInfo }>
                                <i className="fas fa-info-circle"></i>
                            </div>
                        </div>
                    </div>
        }}
        </NavigatorContext.Consumer>
    );
}
