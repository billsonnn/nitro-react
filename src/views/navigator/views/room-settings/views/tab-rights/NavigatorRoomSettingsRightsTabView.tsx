import { RemoveAllRightsMessageComposer, RoomGiveRightsComposer, RoomTakeRightsComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useMemo } from 'react';
import { LocalizeText } from '../../../../../../api';
import { SendMessageHook } from '../../../../../../hooks';
import { NavigatorRoomSettingsTabViewProps } from '../../NavigatorRoomSettingsView.types';

export const NavigatorRoomSettingsRightsTabView: FC<NavigatorRoomSettingsTabViewProps> = props =>
{
    const { roomSettingsData = null, setRoomSettingsData = null, onSave = null } = props;

    const removeUserRights = useCallback( (userId: number) =>
    {
        const clone = Object.assign({}, roomSettingsData);

        clone.usersWithRights.delete(userId);

        setRoomSettingsData(clone);
        SendMessageHook(new RoomTakeRightsComposer(userId));
    }, [roomSettingsData, setRoomSettingsData]);

    const giveUserRights = useCallback( (userId: number, name: string) =>
    {
        const clone = Object.assign({}, roomSettingsData);

        clone.usersWithRights.set(userId, name);

        setRoomSettingsData(clone);
        SendMessageHook(new RoomGiveRightsComposer(userId));
    }, [roomSettingsData, setRoomSettingsData]);

    const removeAllRights = useCallback( () =>
    {
        const clone = Object.assign({}, roomSettingsData);

        clone.usersWithRights = new Map();

        setRoomSettingsData(clone);
        SendMessageHook(new RemoveAllRightsMessageComposer(clone.roomId));
    }, [roomSettingsData, setRoomSettingsData]);

    const friendsWithoutRights = useMemo(() =>
    {
        const map = new Map<number, string>();

        roomSettingsData.friends.forEach((name, id) =>
        {
            if(!roomSettingsData.usersWithRights.has(id))
                map.set(id, name);
        });

        return map;
    }, [roomSettingsData]);

    return (
        <>
            <div className="row">
                <div className="col-6">
                    <div className="fw-bold mb-2">{LocalizeText('navigator.flatctrls.userswithrights', ['displayed', 'total'], [roomSettingsData.usersWithRights.size.toString(), roomSettingsData.usersWithRights.size.toString()])}</div>
                </div>
                <div className="col-6">
                    <div className="fw-bold mb-2">{LocalizeText('navigator.flatctrls.friends', ['displayed', 'total'], [friendsWithoutRights.size.toString(), friendsWithoutRights.size.toString()])}</div>
                </div>
            </div>
            <div className="row h-100">
                <div className="col-6">
                    <div className="list-container rights justify-content-center align-items-center">
                        {
                            Array.from(roomSettingsData.usersWithRights.entries()).map(([id, name], index) =>
                            {
                                return <div key={index} className={'list-item flex-row'} >
                                    <span className="w-100" >{name}</span> 
                                    <button className="btn btn-danger btn-sm rights-button" onClick={ () => removeUserRights(id) }>
                                                <i className="fas fa-times" />
                                    </button>
                                </div>
                            })
                        }
                    </div>
                    <button className={'btn btn-danger btn-sm w-100' + ((roomSettingsData.usersWithRights.size < 1) ? ' disabled' : '')} onClick={ removeAllRights } >{ LocalizeText('navigator.flatctrls.clear') }</button>
                </div>
                <div className="col-6">
                    <div className="list-container h-100 friends-rights">
                        {
                            Array.from(friendsWithoutRights.entries()).map(([id, name], index) =>
                            {
                                return <div key={index} className={'list-item flex-row'} >
                                    <span className="w-100">{name}</span>
                                    <button className="btn btn-success btn-sm rights-button" onClick={ () => giveUserRights(id, name) }>
                                                <i className="fas fa-chevron-left" />
                                    </button>
                                </div>
                            })
                        }
                    </div>
                </div >
            </div >
        </>
    );
}
