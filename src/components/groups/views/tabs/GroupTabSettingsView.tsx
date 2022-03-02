import { GroupSavePreferencesComposer } from '@nitrots/nitro-renderer';
import { Dispatch, FC, SetStateAction, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../api/utils/LocalizeText';
import { Column, Flex, HorizontalRule, Text } from '../../../../common';
import { BatchUpdates, SendMessageHook } from '../../../../hooks';
import { IGroupData } from '../../common/IGroupData';

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

        SendMessageHook(new GroupSavePreferencesComposer(groupData.groupId, groupState, groupDecorate ? 0 : 1));

        return true;
    }, [ groupData, groupState, groupDecorate, setGroupData ]);

    useEffect(() =>
    {
        BatchUpdates(() =>
        {
            setGroupState(groupData.groupState);
            setGroupDecorate(groupData.groupCanMembersDecorate);
        });
    }, [ groupData ]);

    useEffect(() =>
    {
        setCloseAction({ action: saveSettings });

        return () => setCloseAction(null);
    }, [ setCloseAction, saveSettings ]);
    
    return (
        <Column overflow="auto">
            <Column>
                { STATES.map((state, index) =>
                    {
                        return (
                            <Flex key={ index } alignItems="center" gap={ 1 }>
                                <input className="form-check-input" type="radio" name="groupState" checked={ (groupState === index) } onChange={ event => setGroupState(index) } />
                                <Column gap={ 0 }>
                                    <Flex gap={ 1 }>
                                        <i className={ `icon icon-group-type-${ index }` } />
                                        <Text bold>{ LocalizeText(`group.edit.settings.type.${ state }.label`) }</Text>
                                    </Flex>
                                    <Text>{ LocalizeText(`group.edit.settings.type.${ state }.help`) }</Text>
                                </Column>
                            </Flex>
                        );
                    }) }
            </Column>
            <HorizontalRule />
            <Flex alignItems="center" gap={ 1 }>
                <input className="form-check-input" type="checkbox" checked={ groupDecorate } onChange={ event => setGroupDecorate(prevValue => !prevValue) } />
                <Column gap={ 1 }>
                    <Text bold>{ LocalizeText('group.edit.settings.rights.caption') }</Text>
                    <Text>{ LocalizeText('group.edit.settings.rights.members.help') }</Text>
                </Column>
            </Flex>
        </Column>
    );
};
