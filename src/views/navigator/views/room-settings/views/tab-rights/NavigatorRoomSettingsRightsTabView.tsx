import { FC, useState } from 'react';
import { LocalizeText } from '../../../../../../api';
import { NavigatorRoomSettingsTabViewProps } from '../../NavigatorRoomSettingsView.types';

export const NavigatorRoomSettingsRightsTabView: FC<NavigatorRoomSettingsTabViewProps> = props =>
{
    const { roomSettingsData = null, setRoomSettingsData = null, onSave = null } = props;
    const [selectedUserId, setSelectedUserId] = useState<number>(-1);

    return (
        <>
            <div className="row">
                <div className="col-6">
                    <div className="fw-bold mb-2">{LocalizeText('navigator.flatctrls.userswithrights', ['displayed', 'total'], [roomSettingsData.usersWithRights.size.toString(), roomSettingsData.usersWithRights.size.toString()])}</div>
                </div>
                <div className="col-6">
                    <div className="fw-bold mb-2">{LocalizeText('navigator.flatctrls.friends', ['displayed', 'total'], [roomSettingsData.friendsWithoutRights.size.toString(), roomSettingsData.friendsWithoutRights.size.toString()])}</div>
                </div>
            </div>
            <div className="row">
                <div className="col-6">
                    <div className="list-container">
                        {
                            Array.from(roomSettingsData.usersWithRights.entries()).map(([id, name], index) =>
                            {
                                return <div key={index} className={'list-item' + ((id === selectedUserId) ? ' selected' : '')} onClick={e => setSelectedUserId(id)} >
                                    {name}
                                </div>
                            })
                        }
                    </div>
                </div>
                <div className="col-6">
                    <div className="list-container">
                        {
                            Array.from(roomSettingsData.friendsWithoutRights.entries()).map(([id, name], index) =>
                            {
                                return <div key={index} className={'list-item' + ((id === selectedUserId) ? ' selected' : '')} onClick={e => setSelectedUserId(id)} >
                                    {name}
                                </div>
                            })
                        }
                    </div>
                </div >
            </div >
        </>
    );
}
