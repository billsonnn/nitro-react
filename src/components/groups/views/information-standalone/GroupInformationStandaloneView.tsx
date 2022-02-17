import { GroupInformationEvent, GroupInformationParser } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { BatchUpdates, CreateMessageHook } from '../../../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../layout';
import { GroupInformationView } from '../information/GroupInformationView';

export const GroupInformationStandaloneView: FC<{}> = props =>
{
    const [ groupInformation, setGroupInformation ] = useState<GroupInformationParser>(null);

    const onGroupInformationEvent = useCallback((event: GroupInformationEvent) =>
    {
        const parser = event.getParser();

        if(!parser.flag) return;

        BatchUpdates(() =>
        {
            setGroupInformation(null);
            setGroupInformation(parser);
        });
    }, []);

    CreateMessageHook(GroupInformationEvent, onGroupInformationEvent);

    if(!groupInformation) return null;

    return (
        <NitroCardView className="nitro-group-information-standalone" simple>
            <NitroCardHeaderView headerText={ LocalizeText('group.window.title') } onCloseClick={ () => setGroupInformation(null) } />
            <NitroCardContentView>
                <GroupInformationView groupInformation={ groupInformation } onClose={ () => setGroupInformation(null) } />
            </NitroCardContentView>
        </NitroCardView>
    );
};
