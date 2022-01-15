import { FC, useCallback, useState } from 'react';
import { LocalizeText } from '../../api';
import { HelpEvent } from '../../events/help/HelpEvent';
import { HelpReportUserEvent } from '../../events/help/HelpReportUserEvent';
import { useUiEvent } from '../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../layout';
import { HelpContextProvider } from './context/HelpContext';
import { IHelpReportState, initialReportState } from './context/HelpContext.types';
import { HelpMessageHandler } from './HelpMessageHandler';
import { DescribeReportView } from './views/DescribeReportView';
import { HelpIndexView } from './views/HelpIndexView';
import { NameChangeView } from './views/name-change/NameChangeView';
import { SanctionSatusView } from './views/SanctionStatusView';
import { SelectReportedChatsView } from './views/SelectReportedChatsView';
import { SelectReportedUserView } from './views/SelectReportedUserView';
import { SelectTopicView } from './views/SelectTopicView';

export const HelpView: FC<{}> = props =>
{
    const [isVisible, setIsVisible] = useState(false);
    const [ helpReportState, setHelpReportState ] = useState<IHelpReportState>(initialReportState);

    const onHelpEvent = useCallback((event: HelpEvent) =>
    {
        setHelpReportState(initialReportState);

        switch(event.type)
        {
            case HelpEvent.SHOW_HELP_CENTER:
                setIsVisible(true);
                break;
            case HelpEvent.HIDE_HELP_CENTER:
                setIsVisible(false);
                break;
            case HelpEvent.TOGGLE_HELP_CENTER:
                setIsVisible(!isVisible);
                break;
            case HelpReportUserEvent.REPORT_USER:
                const reportEvent = event as HelpReportUserEvent;
                const reportState = Object.assign({}, helpReportState );
                reportState.reportedUserId = reportEvent.reportedUserId;
                reportState.currentStep = 2;
                setHelpReportState(reportState);
                setIsVisible(true);
                break;
        }
    }, [helpReportState, isVisible]);

    useUiEvent(HelpEvent.TOGGLE_HELP_CENTER, onHelpEvent);
    useUiEvent(HelpEvent.SHOW_HELP_CENTER, onHelpEvent);
    useUiEvent(HelpEvent.HIDE_HELP_CENTER, onHelpEvent);
    useUiEvent(HelpReportUserEvent.REPORT_USER, onHelpEvent);

    const CurrentStepView = useCallback(() =>
    {
        switch(helpReportState.currentStep)
        {
            case 0: return <HelpIndexView />
            case 1: return <SelectReportedUserView />
            case 2: return <SelectReportedChatsView />
            case 3: return <SelectTopicView />
            case 4: return <DescribeReportView />
        }

        return null;
    }, [helpReportState.currentStep]);

    return (
        <HelpContextProvider value={ { helpReportState, setHelpReportState } }>
            <HelpMessageHandler />
            {isVisible &&
                <NitroCardView className="nitro-help">
                    <NitroCardHeaderView headerText={LocalizeText('help.button.cfh')} onCloseClick={() => setIsVisible(false)} />
                    <NitroCardContentView className="text-black">
                        <CurrentStepView />
                    </NitroCardContentView>
                </NitroCardView>
            }
            <SanctionSatusView />
            <NameChangeView />
        </HelpContextProvider>
    );
}
