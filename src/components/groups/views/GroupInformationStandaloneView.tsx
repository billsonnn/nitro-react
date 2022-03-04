import { GroupInformationEvent, GroupInformationParser } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { LocalizeText } from '../../../api';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../common';
import { UseMessageEventHook } from '../../../hooks';
import { GroupInformationView } from './GroupInformationView';

export const GroupInformationStandaloneView: FC<{}> = props =>
{
    const [ groupInformation, setGroupInformation ] = useState<GroupInformationParser>(null);

    const onGroupInformationEvent = useCallback((event: GroupInformationEvent) =>
    {
        const parser = event.getParser();

        if((groupInformation && (groupInformation.id === parser.id)) || parser.flag) setGroupInformation(parser);
    }, [ groupInformation ]);

    UseMessageEventHook(GroupInformationEvent, onGroupInformationEvent);

    if(!groupInformation) return null;

    return (
        <NitroCardView className="nitro-group-information-standalone" theme="primary-slim">
            <NitroCardHeaderView headerText={ LocalizeText('group.window.title') } onCloseClick={ event => setGroupInformation(null) } />
            <NitroCardContentView>
                <GroupInformationView groupInformation={ groupInformation } onClose={ () => setGroupInformation(null) } />
            </NitroCardContentView>
        </NitroCardView>
    );
};
