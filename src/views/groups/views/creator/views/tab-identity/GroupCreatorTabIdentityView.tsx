import { FC, useCallback } from 'react';
import { CreateLinkEvent, LocalizeText } from '../../../../../../api';
import { useGroupsContext } from '../../../../context/GroupsContext';
import { GroupsActions } from '../../../../context/GroupsContext.types';

export const GroupCreatorTabIdentityView: FC<{}> = props =>
{
    const { groupsState = null, dispatchGroupsState = null } = useGroupsContext();
    const { groupName = '', groupDescription = '', groupHomeroomId = 0, availableRooms = null } = groupsState;
    
    const setName = useCallback((name: string) =>
    {
        dispatchGroupsState({
            type: GroupsActions.SET_GROUP_NAME,
            payload: {
                stringValue: name
            }
        })
    }, [ dispatchGroupsState ]);

    const setDescription = useCallback((description: string) =>
    {
        dispatchGroupsState({
            type: GroupsActions.SET_GROUP_DESCRIPTION,
            payload: {
                stringValue: description
            }
        })
    }, [ dispatchGroupsState ]);

    const setHomeroomId = useCallback((id: number) =>
    {
        dispatchGroupsState({
            type: GroupsActions.SET_GROUP_HOMEROOM_ID,
            payload: {
                numberValue: id
            }
        })
    }, [ dispatchGroupsState ]);

    return (<div className="d-flex flex-column justify-content-center h-100">
        <div className="form-group mb-2">
            <label className="fw-bold">{ LocalizeText('group.edit.name') }</label>
            <input type="text" className="form-control form-control-sm" value={ groupName } maxLength={ 29 } onChange={ (e) => setName(e.target.value) } />
        </div>
        <div className="form-group mb-2">
            <label className="fw-bold">{ LocalizeText('group.edit.desc') }</label>
            <input type="text" className="form-control form-control-sm" value={ groupDescription } maxLength={ 254 } onChange={ (e) => setDescription(e.target.value) } />
        </div>
        <div className="form-group mb-1">
            <label className="fw-bold">{ LocalizeText('group.edit.base') }</label>
            <select className="form-select form-select-sm" value={ groupHomeroomId } onChange={ (e) => setHomeroomId(Number(e.target.value)) }>
                <option value={ 0 } disabled>{ LocalizeText('group.edit.base.select.room') }</option>
                { availableRooms && availableRooms.map((room, index) =>
                {
                    return <option key={ index } value={ room.id }>{ room.name }</option>;
                }) }
            </select>
        </div>
        <div className="small mb-2">{ LocalizeText('group.edit.base.warning') }</div>
        <div className="cursor-pointer text-decoration-underline text-center" onClick={ () => CreateLinkEvent('navigator/create') }>{ LocalizeText('group.createroom') }</div>
    </div>);
};
