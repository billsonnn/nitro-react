import
{
    CreateLinkEvent,
    GroupDeleteComposer,
    GroupSaveInformationComposer,
} from '@nitrots/nitro-renderer';
import
{
    Dispatch,
    FC,
    SetStateAction,
    useCallback,
    useEffect,
    useState,
} from 'react';
import { IGroupData, LocalizeText, SendMessageComposer } from '../../../../api';
import { Button, Column, Text } from '../../../../common';
import { useNotification } from '../../../../hooks';
import { NitroInput } from '../../../../layout';

interface GroupTabIdentityViewProps {
    groupData: IGroupData;
    setGroupData: Dispatch<SetStateAction<IGroupData>>;
    setCloseAction: Dispatch<SetStateAction<{ action: () => boolean }>>;
    onClose: () => void;
    isCreator?: boolean;
    availableRooms?: { id: number; name: string }[];
}

export const GroupTabIdentityView: FC<GroupTabIdentityViewProps> = (props) =>
{
    const {
        groupData = null,
        setGroupData = null,
        setCloseAction = null,
        onClose = null,
        isCreator = false,
        availableRooms = [],
    } = props;
    const [groupName, setGroupName] = useState<string>('');
    const [groupDescription, setGroupDescription] = useState<string>('');
    const [groupHomeroomId, setGroupHomeroomId] = useState<number>(-1);
    const { showConfirm = null } = useNotification();

    const deleteGroup = () =>
    {
        if(!groupData || groupData.groupId <= 0) return;

        showConfirm(
            LocalizeText('group.deleteconfirm.desc'),
            () =>
            {
                SendMessageComposer(new GroupDeleteComposer(groupData.groupId));

                if(onClose) onClose();
            },
            null,
            null,
            null,
            LocalizeText('group.deleteconfirm.title')
        );
    };

    const saveIdentity = useCallback(() =>
    {
        if(!groupData || !groupName || !groupName.length) return false;

        if(
            groupName === groupData.groupName &&
            groupDescription === groupData.groupDescription
        )
            return true;

        if(groupData.groupId <= 0)
        {
            if(groupHomeroomId <= 0) return false;

            setGroupData((prevValue) =>
            {
                const newValue = { ...prevValue };

                newValue.groupName = groupName;
                newValue.groupDescription = groupDescription;
                newValue.groupHomeroomId = groupHomeroomId;

                return newValue;
            });

            return true;
        }

        SendMessageComposer(
            new GroupSaveInformationComposer(
                groupData.groupId,
                groupName,
                groupDescription || ''
            )
        );

        return true;
    }, [groupData, groupName, groupDescription, groupHomeroomId, setGroupData]);

    useEffect(() =>
    {
        setGroupName(groupData.groupName || '');
        setGroupDescription(groupData.groupDescription || '');
        setGroupHomeroomId(groupData.groupHomeroomId);
    }, [groupData]);

    useEffect(() =>
    {
        setCloseAction({ action: saveIdentity });

        return () => setCloseAction(null);
    }, [setCloseAction, saveIdentity]);

    if(!groupData) return null;

    return (
        <Column justifyContent="between" overflow="auto">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1">
                    <Text center className="col-span-3">
                        {LocalizeText('group.edit.name')}
                    </Text>
                    <NitroInput
                        maxLength={29}
                        type="text"
                        value={groupName}
                        onChange={(event) => setGroupName(event.target.value)}
                    />
                </div>
                <div className="flex items-center gap-1">
                    <Text center className="col-span-3">
                        {LocalizeText('group.edit.desc')}
                    </Text>
                    <textarea
                        className="min-h-[calc(1.5em+ .5rem+2px)] px-[.5rem] py-[.25rem]  rounded-[.2rem] form-control-sm"
                        maxLength={254}
                        value={groupDescription}
                        onChange={(event) =>
                            setGroupDescription(event.target.value)
                        }
                    />
                </div>
                {isCreator && (
                    <>
                        <div className="flex items-center gap-1">
                            <Text center className="col-span-3">
                                {LocalizeText('group.edit.base')}
                            </Text>
                            <Column fullWidth gap={1}>
                                <select
                                    className="form-select form-select-sm"
                                    value={groupHomeroomId}
                                    onChange={(event) =>
                                        setGroupHomeroomId(
                                            parseInt(event.target.value)
                                        )
                                    }
                                >
                                    <option disabled value={-1}>
                                        {LocalizeText(
                                            'group.edit.base.select.room'
                                        )}
                                    </option>
                                    {availableRooms &&
                                        availableRooms.map((room, index) => (
                                            <option key={index} value={room.id}>
                                                {room.name}
                                            </option>
                                        ))}
                                </select>
                            </Column>
                        </div>
                        <div className="flex gap-1">
                            <div className="col-span-3">&nbsp;</div>
                            <Text small>
                                {LocalizeText('group.edit.base.warning')}
                            </Text>
                        </div>
                    </>
                )}
            </div>
            {!isCreator && (
                <Button variant="danger" onClick={deleteGroup}>
                    {LocalizeText('group.delete')}
                </Button>
            )}
            {isCreator && (
                <Text
                    center
                    fullWidth
                    pointer
                    underline
                    onClick={(event) => CreateLinkEvent('navigator/create')}
                >
                    {LocalizeText('group.createroom')}
                </Text>
            )}
        </Column>
    );
};
