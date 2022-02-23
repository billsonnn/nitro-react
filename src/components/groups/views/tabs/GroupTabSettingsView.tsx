import { FC } from 'react';
import { LocalizeText } from '../../../../api/utils/LocalizeText';
import { Column, Flex, Text } from '../../../../common';
import { useGroupsContext } from '../../GroupsContext';
import { GroupsActions } from '../../reducers/GroupsReducer';

const STATES: string[] = ['regular', 'exclusive', 'private'];

export const GroupTabSettingsView: FC<{}> = props =>
{
    const { groupsState = null, dispatchGroupsState = null } = useGroupsContext();
    const { groupState = null, groupCanMembersDecorate = false } = groupsState;

    const setState = (state: number) =>
    {
        dispatchGroupsState({
            type: GroupsActions.SET_GROUP_STATE,
            payload: {
                numberValues: [ state ]
            }
        })
    }

    const toggleCanMembersDecorate = () =>
    {
        dispatchGroupsState({
            type: GroupsActions.SET_GROUP_CAN_MEMBERS_DECORATE,
            payload: {
                boolValues: [ !groupCanMembersDecorate ]
            }
        })
    }
    
    return (
        <>
            { STATES.map((state, index) =>
                {
                    return (
                        <Flex key={ index } alignItems="center" gap={ 1 }>
                            <input className="form-check-input" type="radio" name="groupState" checked={ (groupState === index) } onChange={ event => setState(index) } />
                            <Column gap={ 0 }>
                                <Flex gap={ 1 }>
                                    <i className={ `icon icon-group-type-${index}` } />
                                    <Text bold>{ LocalizeText(`group.edit.settings.type.${state}.label`) }</Text>
                                </Flex>
                                <Text>{ LocalizeText(`group.edit.settings.type.${state}.help`) }</Text>
                            </Column>
                        </Flex>
                    );
                }) }
            <hr className="m-0 bg-dark" />
            <Flex alignItems="center" gap={ 1 }>
                <input className="form-check-input" type="checkbox" checked={ groupCanMembersDecorate } onChange={() => toggleCanMembersDecorate() } />
                <Column gap={ 1 }>
                    <Text bold>{ LocalizeText('group.edit.settings.rights.caption') }</Text>
                    <Text>{ LocalizeText('group.edit.settings.rights.members.help') }</Text>
                </Column>
            </Flex>
        </>
    );
};
