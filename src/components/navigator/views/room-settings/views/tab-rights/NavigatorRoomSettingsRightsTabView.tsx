import { RemoveAllRightsMessageComposer, RoomGiveRightsComposer, RoomTakeRightsComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useMemo } from 'react';
import { LocalizeText } from '../../../../../../api';
import { SendMessageHook } from '../../../../../../hooks';
import { UserProfileIconView } from '../../../../../../layout';
import { NavigatorRoomSettingsRightsTabViewProps } from './NavigatorRoomSettingsRightsTabView.types';

export const NavigatorRoomSettingsRightsTabView: FC<NavigatorRoomSettingsRightsTabViewProps> = props =>
{
    const { roomSettingsData = null, setRoomSettingsData = null, onSave = null, friends = null } = props;

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

        friends.forEach((name, id) =>
        {
            if(!roomSettingsData.usersWithRights.has(id))
                map.set(id, name);
        });

        return map;
    }, [friends, roomSettingsData]);

    return (
        <div className="d-flex flex-column h-100 overflow-hidden user-rights">
            <div className="row">
                <div className="col">
                    filter
                </div>
            </div>
            <div className="row h-100">
                <div className="col-6 d-flex flex-column h-100">
                    <div className="fw-bold mb-1">{ LocalizeText('navigator.flatctrls.userswithrights', [ 'displayed', 'total' ], [ roomSettingsData.usersWithRights.size.toString(), roomSettingsData.usersWithRights.size.toString() ]) }</div>
                    <div className="d-flex flex-column justify-content-between rounded bg-white h-100 overflow-hidden px-2 py-1 user-rights-container">
                        <div className="row row-cols-1 overflow-auto">
                            { Array.from(roomSettingsData.usersWithRights.entries()).map(([id, name], index) =>
                                {
                                    return (
                                        <div key={index} className="d-flex align-items-center col w-100" onClick={ () => removeUserRights(id) }>
                                            <div className="d-flex align-items-center me-2">
                                                <UserProfileIconView userName={ name } />
                                                <span>{ name }</span>
                                            </div>
                                            <i className="fas fa-caret-right fw-bold text-black me-2" />
                                        </div>
                                    );
                                })
                            }
                        </div>
                        <button className="btn btn-danger btn-sm w-100" disabled={ !roomSettingsData.usersWithRights.size } onClick={ removeAllRights } >{ LocalizeText('navigator.flatctrls.clear') }</button>
                    </div>
                </div>
                <div className="col-6 d-flex flex-column h-100">
                    <div className="fw-bold mb-1">{ LocalizeText('navigator.flatctrls.friends', [ 'displayed', 'total' ], [ friendsWithoutRights.size.toString(), friendsWithoutRights.size.toString() ]) }</div>
                    <div className="d-flex flex-column rounded bg-white h-100 overflow-hidden px-2 py-1 user-rights-container">
                        <div className="row row-cols-1 overflow-auto">
                            { Array.from(friendsWithoutRights.entries()).map(([id, name], index) =>
                                {
                                    return (
                                        <div key={index} className="d-flex align-items-center col w-100" onClick={ () => giveUserRights(id, name) }>
                                            <i className="fas fa-caret-left fw-bold text-black me-2" />
                                            <div className="d-flex align-items-center">
                                                <UserProfileIconView userName={ name } />
                                                <span>{ name }</span>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
            // <div className="row h-100">
            //     <div className="col-6">
            //         <div className="fw-bold mb-2">{LocalizeText('navigator.flatctrls.userswithrights', ['displayed', 'total'], [roomSettingsData.usersWithRights.size.toString(), roomSettingsData.usersWithRights.size.toString()])}</div>
            //     </div>
            //     <div className="col-6">
            //         <div className="fw-bold mb-2">{LocalizeText('navigator.flatctrls.friends', ['displayed', 'total'], [friendsWithoutRights.size.toString(), friendsWithoutRights.size.toString()])}</div>
            //     </div>
            // </div>
            // <div className="row h-100">
            //     <div className="col-6 d-flex flex-column h-100">
            //         <div className="row row-cols-1 g-0 overflow-auto">
            //             {
            //                 Array.from(roomSettingsData.usersWithRights.entries()).map(([id, name], index) =>
            //                 {
            //                     return (
            //                         <div key={ index } className="col">
            //                             <span className="w-100" >{name}</span> 
            //                             <button className="btn btn-danger btn-sm rights-button" onClick={ () => removeUserRights(id) }>
            //                                 <i className="fas fa-times" />
            //                             </button>
            //                         </div>
            //                     );
            //                 })
            //             }
            //         </div>
            //         <button className={'btn btn-danger btn-sm w-100' + ((roomSettingsData.usersWithRights.size < 1) ? ' disabled' : '')} onClick={ removeAllRights } >{ LocalizeText('navigator.flatctrls.clear') }</button>
            //     </div>
            //     <div className="col-6 d-flex flex-column h-100">
            //         <div className="row row-cols-1 g-0 overflow-auto bg-white h-100">
            //             {
            //                 Array.from(friendsWithoutRights.entries()).map(([id, name], index) =>
            //                 {
            //                     return (
            //                         <div key={index} className="col">
            //                             <span className="w-100">{name}</span>
            //                             <button className="btn btn-success btn-sm rights-button" onClick={ () => giveUserRights(id, name) }>
            //                                 <i className="fas fa-chevron-left" />
            //                             </button>
            //                         </div>
            //                     );
            //                 })
            //             }
            //         </div>
            //     </div >
            // </div >
    );
}
