import { GuideOnDutyStatusMessageEvent, GuideSessionAttachedMessageEvent, GuideSessionOnDutyUpdateMessageComposer, GuideSessionStartedMessageEvent, ILinkEventTracker, PerkAllowancesMessageEvent, PerkEnum } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { AddEventLinkTracker, GetConfiguration, LocalizeText, RemoveLinkEventTracker } from '../../api';
import { GuideToolEvent, NotificationAlertEvent } from '../../events';
import { CreateMessageHook, dispatchUiEvent, SendMessageHook, useUiEvent } from '../../hooks';
import { NitroCardHeaderView, NitroCardView } from '../../layout';
import { GuideSessionState } from './common';
import { GuideToolAcceptView } from './views/guide-accept/GuideToolAcceptView';
import { GuideToolMenuView } from './views/guide-tool-menu/GuideToolMenuView';
import { GuideToolOngoingView } from './views/ongoing/GuideToolOngoingView';
import { GuildToolUserCreateRequestView } from './views/user-create-request/GuildToolUserCreateRequestView';

export const GuideToolView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState<boolean>(false);
    const [ headerText, setHeaderText ] = useState<string>(LocalizeText('guide.help.guide.tool.title'));
    const [ sessionState, setSessionState ] = useState<string>(GuideSessionState.GUIDE_TOOL_MENU);

    const [ isOnDuty, setIsOnDuty ] = useState<boolean>(false);
    const [ isHandlingBullyReports, setIsHandlingBullyReports ] = useState<boolean>(false);
    const [ isHandlingGuideRequests, setIsHandlingGuideRequests ] = useState<boolean>(false);
    const [ isHandlingHelpRequests, setIsHandlingHelpRequests ] = useState<boolean>(false);

    const [ helpersOnDuty, setHelpersOnDuty ] = useState<number>(0);
    const [ guidesOnDuty, setGuidesOnDuty ] = useState<number>(0);
    const [ guardiansOnDuty, setGuardiansOnDuty ] = useState<number>(0);

    const [ helpRequestDescription, setHelpRequestDescription ] = useState<string>(null);
    const [ helpRequestCountdown, setHelpRequestCountdown ] = useState<number>(0);

    const [ ongoingUserId, setOngoingUserId ] = useState<number>(0);
    const [ ongoingUsername, setOngoingUsername ] = useState<string>(null);
    const [ ongoingFigure, setOngoingFigure ] = useState<string>(null);

    const onGuideToolEvent = useCallback((event: GuideToolEvent) =>
    {
        switch(event.type)
        {
            case GuideToolEvent.SHOW_GUIDE_TOOL:
                setIsVisible(true);
                return;
            case GuideToolEvent.HIDE_GUIDE_TOOL:
                setIsVisible(false);
                return;   
            case GuideToolEvent.TOGGLE_GUIDE_TOOL:
                setIsVisible(value => !value);
                return;
            case GuideToolEvent.CREATE_HELP_REQUEST:
                setSessionState(GuideSessionState.USER_CREATE);
                setHeaderText(LocalizeText('guide.help.request.user.create.title'));
                setIsVisible(true);
                return;
        }
    }, []);

    useUiEvent(GuideToolEvent.SHOW_GUIDE_TOOL, onGuideToolEvent);
    useUiEvent(GuideToolEvent.HIDE_GUIDE_TOOL, onGuideToolEvent);
    useUiEvent(GuideToolEvent.TOGGLE_GUIDE_TOOL, onGuideToolEvent);
    useUiEvent(GuideToolEvent.CREATE_HELP_REQUEST, onGuideToolEvent);

    const onPerkAllowancesMessageEvent = useCallback((event: PerkAllowancesMessageEvent) =>
    {
        const parser = event.getParser();

        if(!parser.isAllowed(PerkEnum.USE_GUIDE_TOOL) && isOnDuty)
        {
            setIsOnDuty(false);
            SendMessageHook(new GuideSessionOnDutyUpdateMessageComposer(false, false, false, false));
        }
    }, [ isOnDuty, setIsOnDuty ]);

    CreateMessageHook(PerkAllowancesMessageEvent, onPerkAllowancesMessageEvent);

    const onGuideOnDutyStatusMessageEvent = useCallback((event: GuideOnDutyStatusMessageEvent) =>
    {
        const parser = event.getParser();

        setIsOnDuty(parser.onDuty);
        setGuidesOnDuty(parser.guidesOnDuty);
        setHelpersOnDuty(parser.helpersOnDuty);
        setGuardiansOnDuty(parser.guardiansOnDuty);
    }, [ setIsOnDuty, setHelpersOnDuty, setGuidesOnDuty, setGuardiansOnDuty ]);

    CreateMessageHook(GuideOnDutyStatusMessageEvent, onGuideOnDutyStatusMessageEvent);

    const onGuideSessionAttachedMessageEvent = useCallback((event: GuideSessionAttachedMessageEvent) =>
    {
        const parser = event.getParser();

        if(parser.asGuide)
        {
            if(!isOnDuty) return;

            setSessionState(GuideSessionState.GUIDE_ACCEPT);
            setHeaderText(LocalizeText('guide.help.request.guide.accept.title'));
            setHelpRequestDescription(parser.helpRequestDescription);
            setHelpRequestCountdown(parser.roleSpecificWaitTime);
        }
        else
        {
            setSessionState(GuideSessionState.USER_PENDING);
            setHeaderText(LocalizeText('guide.help.request.user.pending.title'));
            setHelpRequestDescription(parser.helpRequestDescription);
        }
        
        setIsVisible(true);
    }, [ isOnDuty ]);

    CreateMessageHook(GuideSessionAttachedMessageEvent, onGuideSessionAttachedMessageEvent);

    const onGuideSessionStartedMessageEvent = useCallback((event: GuideSessionStartedMessageEvent) =>
    {
        const parser = event.getParser();

        if(isOnDuty)
        {
            setSessionState(GuideSessionState.GUIDE_ONGOING);
            setHeaderText(LocalizeText('guide.help.request.guide.ongoing.title', ['name'], [parser.requesterName]));
            setOngoingUserId(parser.requesterUserId);
            setOngoingUsername(parser.requesterName);
            setOngoingFigure(parser.requesterFigure);
        }
        else
        {
            setSessionState(GuideSessionState.USER_ONGOING);
            setHeaderText(LocalizeText('guide.help.request.user.ongoing.title', ['name'], [parser.guideName]));
            setOngoingUserId(parser.guideUserId);
            setOngoingUsername(parser.guideName);
            setOngoingFigure(parser.guideFigure);
        }
        
        setIsVisible(true);
    }, [ isOnDuty ]);

    CreateMessageHook(GuideSessionStartedMessageEvent, onGuideSessionStartedMessageEvent);

    const linkReceived = useCallback((url: string) =>
    {
        const parts = url.split('/');

        if(parts.length < 2) return;

        switch(parts[1])
        {
            case 'tour':
                //Create Tour Request
                return;
        }
    }, []);

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived,
            eventUrlPrefix: 'help/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, [ linkReceived ]);

    const processAction = useCallback((action: string) =>
    {
        switch(action)
        {
            case 'close':
                setIsVisible(false);
                return;
            case 'toggle_duty':
                if(!isHandlingBullyReports && !isHandlingGuideRequests && !isHandlingHelpRequests)
                {
                    dispatchUiEvent(new NotificationAlertEvent([LocalizeText('guide.help.guide.tool.noqueueselected.message')], null, null, null, LocalizeText('guide.help.guide.tool.noqueueselected.caption'), null));
                    return;
                }

                setIsOnDuty(v =>
                    {
                        SendMessageHook(new GuideSessionOnDutyUpdateMessageComposer(!v, v ? false : isHandlingGuideRequests, v ? false : isHandlingHelpRequests, v ? false : isHandlingBullyReports));
                        return !v;
                    });
                
                return;
            case 'forum_link':
                const url: string = GetConfiguration<string>('group.homepage.url', '').replace('%groupid%', GetConfiguration<string>('guide.help.alpha.groupid', '0'));
                window.open(url);
                return;
        }
    }, [isHandlingBullyReports, isHandlingGuideRequests, isHandlingHelpRequests]);

    if(!isVisible) return null;

    return (
        <NitroCardView className="nitro-guide-tool" simple={ true }>
            <NitroCardHeaderView headerText={ headerText } onCloseClick={ () => processAction('close') } />
            { sessionState === GuideSessionState.GUIDE_TOOL_MENU &&
            <GuideToolMenuView isOnDuty={ isOnDuty }
            isHandlingGuideRequests={ isHandlingGuideRequests }
            setIsHandlingGuideRequests={ setIsHandlingGuideRequests }
            isHandlingHelpRequests={ isHandlingHelpRequests }
            setIsHandlingHelpRequests={ setIsHandlingHelpRequests }
            isHandlingBullyReports={ isHandlingBullyReports }
            setIsHandlingBullyReports={ setIsHandlingBullyReports }
            guidesOnDuty={ guidesOnDuty }
            helpersOnDuty={ helpersOnDuty }
            guardiansOnDuty={ guardiansOnDuty }
            processAction={ processAction }
            /> }
            { sessionState === GuideSessionState.GUIDE_ACCEPT &&
            <GuideToolAcceptView helpRequestDescription={ helpRequestDescription } helpRequestCountdown={ helpRequestCountdown } processAction={ processAction } /> }
            { [ GuideSessionState.GUIDE_ONGOING, GuideSessionState.USER_ONGOING].includes(sessionState) &&
            <GuideToolOngoingView isGuide={ isOnDuty } userId={ ongoingUserId } userName={ ongoingUsername } userFigure={ ongoingFigure } /> }
            { sessionState === GuideSessionState.USER_CREATE && <GuildToolUserCreateRequestView /> }
        </NitroCardView>
    );
};
