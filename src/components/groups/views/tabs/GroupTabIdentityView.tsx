import { FC } from 'react';
import { CreateLinkEvent, LocalizeText } from '../../../../api';
import { Column, Flex, Text } from '../../../../common';
import { useGroupsContext } from '../../GroupsContext';
import { GroupsActions } from '../../reducers/GroupsReducer';

interface GroupTabIdentityViewProps
{
    isCreator?: boolean;
}

export const GroupTabIdentityView: FC<GroupTabIdentityViewProps> = props =>
{
    const { isCreator = false } = props;
    const { groupsState = null, dispatchGroupsState = null } = useGroupsContext();
    const { groupName = '', groupDescription = '', groupHomeroomId = 0, availableRooms = null } = groupsState;
    
    const setName = (name: string) =>
    {
        dispatchGroupsState({
            type: GroupsActions.SET_GROUP_NAME,
            payload: {
                stringValues: [ name ]
            }
        })
    }

    const setDescription = (description: string) =>
    {
        dispatchGroupsState({
            type: GroupsActions.SET_GROUP_DESCRIPTION,
            payload: {
                stringValues: [ description ]
            }
        })
    }

    const setHomeroomId = (id: number) =>
    {
        dispatchGroupsState({
            type: GroupsActions.SET_GROUP_HOMEROOM_ID,
            payload: {
                numberValues: [ id ]
            }
        })
    }

    return (
        <>
            <Column gap={ 1 }>
                <Flex alignItems="center" gap={ 1 }>
                    <Text className="col-3">{ LocalizeText('group.edit.name') }</Text>
                    <input type="text" className="form-control form-control-sm" value={ groupName } maxLength={ 29 } onChange={ event => setName(event.target.value) } />
                </Flex>
                <Flex alignItems="center" gap={ 1 }>
                    <Text className="col-3">{ LocalizeText('group.edit.desc') }</Text>
                    <textarea className="form-control form-control-sm" value={ groupDescription } maxLength={ 254 } onChange={ event => setDescription(event.target.value) } />
                </Flex>
                { isCreator &&
                    <Flex gap={ 1 }>
                        <Text className="col-3">{ LocalizeText('group.edit.base') }</Text>
                        <Column gap={ 1 }>
                            <select className="form-select form-select-sm" value={ groupHomeroomId } onChange={ event => setHomeroomId(Number(event.target.value)) }>
                                <option value={ 0 } disabled>{ LocalizeText('group.edit.base.select.room') }</option>
                                { availableRooms && availableRooms.map((room, index) => <option key={ index } value={ room.id }>{ room.name }</option>) }
                            </select>
                            <Text small>{ LocalizeText('group.edit.base.warning') }</Text>
                        </Column>
                    </Flex> }
            </Column>
            { isCreator &&
                <Text underline center fullWidth pointer onClick={ event => CreateLinkEvent('navigator/create') }>{ LocalizeText('group.createroom') }</Text> }
        </>
    );
};
