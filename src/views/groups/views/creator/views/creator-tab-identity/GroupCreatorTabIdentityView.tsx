import { FC, useCallback } from 'react';
import { CreateLinkEvent, LocalizeText } from '../../../../../../api';
import { useGroupsContext } from '../../../../context/GroupsContext';
import { GroupsActions } from '../../../../context/GroupsContext.types';
import { GroupCreatorTabIdentityViewProps } from './GroupCreatorTabIdentityView.types';

export const GroupCreatorTabIdentityView: FC<GroupCreatorTabIdentityViewProps> = props =>
{
    const { groupsState = null, dispatchGroupsState = null } = useGroupsContext();
    const { groupName = '', groupDescription = '', groupHomeroomId = 0 } = groupsState;

    const { availableRooms = null } = props;
    
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

    return (<>
        <div className="form-group mb-2">
            <label>{ LocalizeText('group.edit.name') }</label>
            <input type="text" className="form-control form-control-sm" value={ groupName } onChange={ (e) => setName(e.target.value) } />
        </div>
        <div className="form-group mb-2">
            <label>{ LocalizeText('group.edit.desc') }</label>
            <input type="text" className="form-control form-control-sm" value={ groupDescription } onChange={ (e) => setDescription(e.target.value) } />
        </div>
        <div className="form-group mb-1">
            <label>{ LocalizeText('group.edit.base') }</label>
            <select className="form-select form-select-sm" value={ groupHomeroomId } onChange={ (e) => setHomeroomId(Number(e.target.value)) }>
                <option value={ 0 } disabled>{ LocalizeText('group.edit.base.select.room') }</option>
                { availableRooms && Array.from(availableRooms.keys()).map((roomId, index) =>
                {
                    return <option key={ index } value={ roomId }>{ availableRooms.get(roomId) }</option>;
                }) }
            </select>
        </div>
        <div className="small mb-2">{ LocalizeText('group.edit.base.warning') }</div>
        <div className="cursor-pointer text-decoration-underline text-center" onClick={ () => CreateLinkEvent('navigator/create') }>{ LocalizeText('group.createroom') }</div>
    </>);
};
