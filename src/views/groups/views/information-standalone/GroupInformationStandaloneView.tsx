import { GroupInformationEvent, GroupInformationParser } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { CreateMessageHook } from '../../../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../layout';
import { GroupInformationView } from '../information/GroupInformationView';

export const GroupInformationBoxView: FC<{}> = props =>
{
    const [ groupInformation, setGroupInformation ] = useState<GroupInformationParser>(null);

    const onGroupInformationEvent = useCallback((event: GroupInformationEvent) =>
    {
        const parser = event.getParser();

        if(!parser.flag) return;

        if(groupInformation) setGroupInformation(null);

        setGroupInformation(parser);
    }, [ groupInformation ]);

    CreateMessageHook(GroupInformationEvent, onGroupInformationEvent);

    if(!groupInformation) return null;

    return (
        <NitroCardView className="nitro-group-information-standalone" simple={ true }>
            <NitroCardHeaderView headerText={ LocalizeText('group.window.title') } onCloseClick={ () => setGroupInformation(null) } />
            <NitroCardContentView className="pb-2">
                <GroupInformationView groupInformation={ groupInformation } onClose={ () => setGroupInformation(null) } />
            </NitroCardContentView>
        </NitroCardView>
    );
};
