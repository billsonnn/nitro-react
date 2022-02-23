import { FC, useCallback } from 'react';
import { LocalizeText } from '../../../../../api/utils/LocalizeText';
import { useGroupsContext } from '../../../GroupsContext';
import { GroupsActions } from '../../../reducers/GroupsReducer';

const STATES: string[] = ['regular', 'exclusive', 'private'];

export const GroupManagerTabSettingsView: FC<{}> = props =>
{
    const { groupsState = null, dispatchGroupsState = null } = useGroupsContext();
    const { groupState = null, groupCanMembersDecorate = false } = groupsState;

    const setState = useCallback((state: number) =>
    {
        dispatchGroupsState({
            type: GroupsActions.SET_GROUP_STATE,
            payload: {
                numberValues: [ state ]
            }
        })
    }, [ dispatchGroupsState ]);

    const toggleCanMembersDecorate = useCallback(() =>
    {
        dispatchGroupsState({
            type: GroupsActions.SET_GROUP_CAN_MEMBERS_DECORATE,
            payload: {
                boolValues: [ !groupCanMembersDecorate ]
            }
        })
    }, [ dispatchGroupsState, groupCanMembersDecorate ]);
    
    return (
        <>
            { STATES.map((state, index) =>
                {
                    return <div key={ index } className="form-check mb-1">
                    <input className="form-check-input" type="radio" name="groupState" id={ `groupState${ index }` } checked={ (groupState === index) } onChange={ () => setState(index) } />
                    <label className="form-check-label d-flex align-items-center gap-1 fw-bold" htmlFor={'groupState' + index}>
                        <i className={ `icon icon-group-type-${index}` } /> { LocalizeText(`group.edit.settings.type.${state}.label`) }
                    </label>
                    <div>{ LocalizeText(`group.edit.settings.type.${state}.help`) }</div>
                </div>
                }) }
            <hr className="bg-dark" />
            <div className="form-check">
                <input className="form-check-input" type="checkbox" id="groupCanMembersDecorate" checked={ groupCanMembersDecorate } onChange={() => toggleCanMembersDecorate() } />
                <label className="form-check-label fw-bold" htmlFor="groupCanMembersDecorate">
                    { LocalizeText('group.edit.settings.rights.caption') }
                </label>
                <div>{ LocalizeText('group.edit.settings.rights.members.help') }</div>
            </div>
        </>
    );
};
