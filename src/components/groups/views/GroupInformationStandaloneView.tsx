import { GroupInformationEvent, GroupInformationParser } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { LocalizeText } from '../../../api';
import { CreateMessageHook } from '../../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../layout';
import { GroupInformationView } from './GroupInformationView';

export const GroupInformationStandaloneView: FC<{}> = props =>
{
    const [ groupInformation, setGroupInformation ] = useState<GroupInformationParser>(null);

    const onGroupInformationEvent = useCallback((event: GroupInformationEvent) =>
    {
        const parser = event.getParser();

        if((groupInformation && (groupInformation.id === parser.id)) || parser.flag) setGroupInformation(parser);
    }, [ groupInformation ]);

    CreateMessageHook(GroupInformationEvent, onGroupInformationEvent);

    if(!groupInformation) return null;

    return (
        <NitroCardView className="nitro-group-information-standalone" simple>
            <NitroCardHeaderView headerText={ LocalizeText('group.window.title') } onCloseClick={ event => setGroupInformation(null) } />
            <NitroCardContentView>
                <GroupInformationView groupInformation={ groupInformation } onClose={ () => setGroupInformation(null) } />
            </NitroCardContentView>
        </NitroCardView>
    );
};
