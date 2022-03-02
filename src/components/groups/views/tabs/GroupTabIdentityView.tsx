import { GroupDeleteComposer, GroupSaveInformationComposer } from '@nitrots/nitro-renderer';
import { Dispatch, FC, SetStateAction, useCallback, useEffect, useState } from 'react';
import { CreateLinkEvent, LocalizeText } from '../../../../api';
import { Base, Button, Column, Flex, Text } from '../../../../common';
import { BatchUpdates, SendMessageHook } from '../../../../hooks';
import { NotificationUtilities } from '../../../../views/notification-center/common/NotificationUtilities';
import { IGroupData } from '../../common/IGroupData';

interface GroupTabIdentityViewProps
{
    groupData: IGroupData;
    setGroupData: Dispatch<SetStateAction<IGroupData>>;
    setCloseAction: Dispatch<SetStateAction<{ action: () => boolean }>>;
    isCreator?: boolean;
    availableRooms?: { id: number, name: string }[];
}

export const GroupTabIdentityView: FC<GroupTabIdentityViewProps> = props =>
{
    const { groupData = null, setGroupData = null, setCloseAction = null, isCreator = false, availableRooms = [] } = props;
    const [ groupName, setGroupName ] = useState<string>('');
    const [ groupDescription, setGroupDescription ] = useState<string>('');
    const [ groupHomeroomId, setGroupHomeroomId ] = useState<number>(-1);

    const deleteGroup = () =>
    {
        if(!groupData || (groupData.groupId <= 0)) return;

        NotificationUtilities.confirm(LocalizeText('group.deleteconfirm.desc'), () =>
            {
                SendMessageHook(new GroupDeleteComposer(groupData.groupId));
            }, null, null, null, LocalizeText('group.deleteconfirm.title'));
    }

    const saveIdentity = useCallback(() =>
    {
        if(!groupData || !groupName || !groupName.length) return false;

        if((groupName === groupData.groupName) && (groupDescription === groupData.groupDescription)) return true;

        if(groupData.groupId <= 0)
        {
            if(groupHomeroomId <= 0) return false;

            setGroupData(prevValue =>
                {
                    const newValue = { ...prevValue };

                    newValue.groupName = groupName;
                    newValue.groupDescription = groupDescription;
                    newValue.groupHomeroomId = groupHomeroomId;

                    return newValue;
                });

            return true;
        }

        SendMessageHook(new GroupSaveInformationComposer(groupData.groupId, groupName, (groupDescription || '')));

        return true;
    }, [ groupData, groupName, groupDescription, groupHomeroomId, setGroupData ]);

    useEffect(() =>
    {
        BatchUpdates(() =>
        {
            setGroupName(groupData.groupName || '');
            setGroupDescription(groupData.groupDescription || '');
            setGroupHomeroomId(groupData.groupHomeroomId);
        });
    }, [ groupData ]);

    useEffect(() =>
    {
        setCloseAction({ action: saveIdentity });

        return () => setCloseAction(null);
    }, [ setCloseAction, saveIdentity ]);

    if(!groupData) return null;

    return (
        <Column justifyContent="between" overflow="auto">
            <Column gap={ 1 }>
                <Flex alignItems="center" gap={ 1 }>
                    <Text center className="col-3">{ LocalizeText('group.edit.name') }</Text>
                    <input type="text" className="form-control form-control-sm" value={ groupName } maxLength={ 29 } onChange={ event => setGroupName(event.target.value) } />
                </Flex>
                <Flex alignItems="center" gap={ 1 }>
                    <Text center className="col-3">{ LocalizeText('group.edit.desc') }</Text>
                    <textarea className="form-control form-control-sm" value={ groupDescription } maxLength={ 254 } onChange={ event => setGroupDescription(event.target.value) } />
                </Flex>
                { isCreator &&
                    <>
                        <Flex alignItems="center" gap={ 1 }>
                            <Text center className="col-3">{ LocalizeText('group.edit.base') }</Text>
                            <Column fullWidth gap={ 1 }>
                                <select className="form-select form-select-sm" value={ groupHomeroomId } onChange={ event => setGroupHomeroomId(parseInt(event.target.value)) }>
                                    <option value={ -1 } disabled>{ LocalizeText('group.edit.base.select.room') }</option>
                                    { availableRooms && availableRooms.map((room, index) => <option key={ index } value={ room.id }>{ room.name }</option>) }
                                </select>
                            </Column>
                        </Flex>
                        <Flex gap={ 1 }>
                            <Base className="col-3">&nbsp;</Base>
                            <Text small>{ LocalizeText('group.edit.base.warning') }</Text>
                        </Flex>
                    </> }
            </Column>
            { !isCreator &&
                <Button variant="danger" onClick={ deleteGroup }>{ LocalizeText('group.delete') }</Button> }
            { isCreator &&
                <Text underline center fullWidth pointer onClick={ event => CreateLinkEvent('navigator/create') }>{ LocalizeText('group.createroom') }</Text> }
        </Column>
    );
};
