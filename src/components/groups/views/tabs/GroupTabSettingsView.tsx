import { GroupSavePreferencesComposer } from '@nitrots/nitro-renderer';
import { Dispatch, FC, SetStateAction, useCallback, useEffect, useState } from 'react';
import { IGroupData, LocalizeText, SendMessageComposer } from '../../../../api';
import { Flex, HorizontalRule, Text } from '../../../../common';

const STATES: string[] = [ 'regular', 'exclusive', 'private' ];

interface GroupTabSettingsViewProps
{
    groupData: IGroupData;
    setGroupData: Dispatch<SetStateAction<IGroupData>>;
    setCloseAction: Dispatch<SetStateAction<{ action: () => boolean }>>;
}

export const GroupTabSettingsView: FC<GroupTabSettingsViewProps> = props =>
{
    const { groupData = null, setGroupData = null, setCloseAction = null } = props;
    const [ groupState, setGroupState ] = useState<number>(groupData.groupState);
    const [ groupDecorate, setGroupDecorate ] = useState<boolean>(groupData.groupCanMembersDecorate);

    const saveSettings = useCallback(() =>
    {
        if(!groupData) return false;

        if((groupState === groupData.groupState) && (groupDecorate === groupData.groupCanMembersDecorate)) return true;

        if(groupData.groupId <= 0)
        {
            setGroupData(prevValue =>
            {
                const newValue = { ...prevValue };

                newValue.groupState = groupState;
                newValue.groupCanMembersDecorate = groupDecorate;

                return newValue;
            });

            return true;
        }

        SendMessageComposer(new GroupSavePreferencesComposer(groupData.groupId, groupState, groupDecorate ? 0 : 1));

        return true;
    }, [ groupData, groupState, groupDecorate, setGroupData ]);

    useEffect(() =>
    {
        setGroupState(groupData.groupState);
        setGroupDecorate(groupData.groupCanMembersDecorate);
    }, [ groupData ]);

    useEffect(() =>
    {
        setCloseAction({ action: saveSettings });

        return () => setCloseAction(null);
    }, [ setCloseAction, saveSettings ]);

    return (
        <div className="flex flex-col overflow-auto">
            <div className="flex flex-col">
                { STATES.map((state, index) =>
                {
                    return (
                        <Flex key={ index } alignItems="center" gap={ 1 }>
                            <input checked={ (groupState === index) } className="form-check-input" name="groupState" type="radio" onChange={ event => setGroupState(index) } />
                            <div className="flex flex-col gap-0">
                                <div className="flex gap-1">
                                    <i className={ `icon icon-group-type-${ index }` } />
                                    <Text bold>{ LocalizeText(`group.edit.settings.type.${ state }.label`) }</Text>
                                </div>
                                <Text>{ LocalizeText(`group.edit.settings.type.${ state }.help`) }</Text>
                            </div>
                        </Flex>
                    );
                }) }
            </div>
            <HorizontalRule />
            <div className="flex items-center gap-1">
                <input checked={ groupDecorate } className="form-check-input" type="checkbox" onChange={ event => setGroupDecorate(prevValue => !prevValue) } />
                <div className="flex flex-col gap-1">
                    <Text bold>{ LocalizeText('group.edit.settings.rights.caption') }</Text>
                    <Text>{ LocalizeText('group.edit.settings.rights.members.help') }</Text>
                </div>
            </div>
        </div>
    );
};
