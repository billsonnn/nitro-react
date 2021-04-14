import { useState } from 'react';
import { ToolbarViewProps } from './ToolbarView.types';

export function ToolbarView(props: ToolbarViewProps): JSX.Element
{
    const [ isInRoom, setIsInRoom ] = useState(false);

    const unseenInventoryCount = 0;
    const unseenFriendListCount = 0;
    const unseenAchievementsCount = 0;

    return (
        <div className="nitro-toolbar">
            <div className="card p-0 overflow-hidden">
                <ul className="list-group list-group-horizontal p-1">
                    { isInRoom && (
                        <li className="list-group-item">
                        <i className="icon icon-hotelview icon-nitro-light"></i>
                        </li>) }
                    { !isInRoom && (
                        <li className="list-group-item">
                            <i className="icon icon-house"></i>
                        </li>) }
                    <li className="list-group-item">
                        <i className="icon icon-rooms"></i>
                    </li>
                    <li className="list-group-item">
                        <i className="icon icon-catalog"></i>
                    </li>
                    <li className="list-group-item">
                        <i className="icon icon-inventory"></i>
                        { (unseenInventoryCount > 0) && (
                            <div className="position-absolute bg-danger px-1 py-0 rounded shadow count">{ unseenInventoryCount }</div>) }
                    </li>
                    <li className="list-group-item">
                        <i className="icon icon-friendall"></i>
                        { (unseenFriendListCount > 0) && (
                            <div className="position-absolute bg-danger px-1 py-0 rounded shadow count">{ unseenFriendListCount }</div>) }
                    </li>
                    <li className="list-group-item avatar-image">
                        { (unseenAchievementsCount > 0) && (
                            <div className="position-absolute bg-danger px-1 py-0 rounded shadow count">{ unseenAchievementsCount }</div>) }
                    </li>
                </ul>
            </div>
        </div>
    );
}
