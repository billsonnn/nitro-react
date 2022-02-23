import { GuideOnDutyStatusMessageEvent, GuideSessionAttachedMessageEvent, GuideSessionDetachedMessageEvent, GuideSessionEndedMessageEvent, GuideSessionInvitedToGuideRoomMessageEvent, GuideSessionMessageMessageEvent, GuideSessionOnDutyUpdateMessageComposer, GuideSessionPartnerIsTypingMessageEvent, GuideSessionStartedMessageEvent, ILinkEventTracker, PerkAllowancesMessageEvent, PerkEnum } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { AddEventLinkTracker, GetConfiguration, GetSessionDataManager, LocalizeText, RemoveLinkEventTracker } from '../../api';
import { GuideToolEvent, NotificationAlertEvent } from '../../events';
import { CreateMessageHook, dispatchUiEvent, SendMessageHook, useUiEvent } from '../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../layout';
import { GuideSessionState } from './common/GuideSessionState';
import { GuideToolMessage } from './common/GuideToolMessage';
import { GuideToolMessageGroup } from './common/GuideToolMessageGroup';
import { GuideToolAcceptView } from './views/GuideToolAcceptView';
import { GuideToolMenuView } from './views/GuideToolMenuView';
import { GuideToolOngoingView } from './views/GuideToolOngoingView';
import { GuideToolUserCreateRequestView } from './views/GuideToolUserCreateRequestView';
import { GuideToolUserFeedbackView } from './views/GuideToolUserFeedbackView';
import { GuideToolUserPendingView } from './views/GuideToolUserPendingView';
import { GuideToolUserThanksView } from './views/GuideToolUserThanksView';

export const GuideToolView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState<boolean>(false);
    const [ headerText, setHeaderText ] = useState<string>(LocalizeText('guide.help.guide.tool.title'));
    const [ noCloseButton, setNoCloseButton ] = useState<boolean>(false);
    const [ sessionState, setSessionState ] = useState<string>(GuideSessionState.GUIDE_TOOL_MENU);

    const [ isOnDuty, setIsOnDuty ] = useState<boolean>(false);
    const [ isHandlingBullyReports, setIsHandlingBullyReports ] = useState<boolean>(false);
    const [ isHandlingGuideRequests, setIsHandlingGuideRequests ] = useState<boolean>(false);
    const [ isHandlingHelpRequests, setIsHandlingHelpRequests ] = useState<boolean>(false);

    const [ helpersOnDuty, setHelpersOnDuty ] = useState<number>(0);
    const [ guidesOnDuty, setGuidesOnDuty ] = useState<number>(0);
    const [ guardiansOnDuty, setGuardiansOnDuty ] = useState<number>(0);

    const [ userRequest, setUserRequest ] = useState<string>('');

    const [ helpRequestDescription, setHelpRequestDescription ] = useState<string>(null);
    const [ helpRequestAverageTime, setHelpRequestAverageTime ] = useState<number>(0);

    const [ ongoingUserId, setOngoingUserId ] = useState<number>(0);
    const [ ongoingUsername, setOngoingUsername ] = useState<string>(null);
    const [ ongoingFigure, setOngoingFigure ] = useState<string>(null);
    const [ ongoingIsTyping, setOngoingIsTyping ] = useState<boolean>(false);
    const [ ongoingMessageGroups, setOngoingMessageGroups ] = useState<GuideToolMessageGroup[]>([]);

    const updateSessionState = useCallback((newState: string, replacement?: string) =>
    {
        switch(newState)
        {
            case GuideSessionState.GUIDE_TOOL_MENU:
                setHeaderText(LocalizeText('guide.help.guide.tool.title'));
                setNoCloseButton(false);
                break;
            case GuideSessionState.GUIDE_ACCEPT:
                setHeaderText(LocalizeText('guide.help.request.guide.accept.title'));
                setNoCloseButton(true);
                break;
            case GuideSessionState.GUIDE_ONGOING:
                setHeaderText(LocalizeText('guide.help.request.guide.ongoing.title', ['name'], [replacement]));
                setNoCloseButton(true);
                break;
            case GuideSessionState.USER_CREATE:
                setHeaderText(LocalizeText('guide.help.request.user.create.title'));
                setNoCloseButton(false);
                break;
            case GuideSessionState.USER_PENDING:
                setHeaderText(LocalizeText('guide.help.request.user.pending.title'));
                setNoCloseButton(true);
                break;
            case GuideSessionState.USER_ONGOING:
                setHeaderText(LocalizeText('guide.help.request.user.ongoing.title', ['name'], [replacement]));
                setNoCloseButton(true);
                break;
            case GuideSessionState.USER_FEEDBACK:
                setHeaderText(LocalizeText('guide.help.request.user.feedback.title'));
                setNoCloseButton(true);
                break;
            case GuideSessionState.USER_THANKS:
                setHeaderText(LocalizeText('guide.help.request.user.thanks.title'));
                setNoCloseButton(false);
                break;
        }

        setSessionState(newState);
        setIsVisible(true);
    }, []);

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
                updateSessionState(GuideSessionState.USER_CREATE);
                return;
        }
    }, [ updateSessionState ]);

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

        setHelpRequestDescription(parser.helpRequestDescription);
        setHelpRequestAverageTime(parser.roleSpecificWaitTime);

        if(parser.asGuide && isOnDuty) updateSessionState(GuideSessionState.GUIDE_ACCEPT);
        
        if(!parser.asGuide) updateSessionState(GuideSessionState.USER_PENDING);
        
    }, [ isOnDuty, updateSessionState ]);

    CreateMessageHook(GuideSessionAttachedMessageEvent, onGuideSessionAttachedMessageEvent);
    
    const onGuideSessionStartedMessageEvent = useCallback((event: GuideSessionStartedMessageEvent) =>
    {
        const parser = event.getParser();

        if(isOnDuty)
        {
            setOngoingUserId(parser.requesterUserId);
            setOngoingUsername(parser.requesterName);
            setOngoingFigure(parser.requesterFigure);
            updateSessionState(GuideSessionState.GUIDE_ONGOING, parser.requesterName);
        }
        else
        {
            setOngoingUserId(parser.guideUserId);
            setOngoingUsername(parser.guideName);
            setOngoingFigure(parser.guideFigure);
            updateSessionState(GuideSessionState.USER_ONGOING, parser.guideName);
        }
    }, [ isOnDuty, updateSessionState ]);

    CreateMessageHook(GuideSessionStartedMessageEvent, onGuideSessionStartedMessageEvent);

    const onGuideSessionPartnerIsTypingMessageEvent = useCallback((event: GuideSessionPartnerIsTypingMessageEvent) =>
    {
        const parser = event.getParser();

        setOngoingIsTyping(parser.isTyping);
    }, []);

    CreateMessageHook(GuideSessionPartnerIsTypingMessageEvent, onGuideSessionPartnerIsTypingMessageEvent);
    
    const onGuideSessionMessageMessageEvent = useCallback((event: GuideSessionMessageMessageEvent) =>
    {
        const parser = event.getParser();

        const messageGroups = [...ongoingMessageGroups];

        let lastGroup = messageGroups[messageGroups.length - 1];

        if(!lastGroup || lastGroup.userId !== parser.senderId)
        {
            lastGroup = new GuideToolMessageGroup(parser.senderId);
            messageGroups.push(lastGroup);
        }

        lastGroup.addChat(new GuideToolMessage(parser.chatMessage));
        setOngoingMessageGroups(messageGroups);
    }, [ ongoingMessageGroups ]);

    CreateMessageHook(GuideSessionMessageMessageEvent, onGuideSessionMessageMessageEvent);

    const onGuideSessionInvitedToGuideRoomMessageEvent = useCallback((event: GuideSessionInvitedToGuideRoomMessageEvent) =>
    {
        const parser = event.getParser();

        const messageGroups = [...ongoingMessageGroups];

        let lastGroup = messageGroups[messageGroups.length - 1];

        const guideId = (isOnDuty ? GetSessionDataManager().userId : ongoingUserId);

        if(!lastGroup || lastGroup.userId !== guideId)
        {
            lastGroup = new GuideToolMessageGroup(guideId);
            messageGroups.push(lastGroup);
        }

        lastGroup.addChat(new GuideToolMessage(parser.roomName, parser.roomId));
        setOngoingMessageGroups(messageGroups);
    }, [isOnDuty, ongoingMessageGroups, ongoingUserId]);

    CreateMessageHook(GuideSessionInvitedToGuideRoomMessageEvent, onGuideSessionInvitedToGuideRoomMessageEvent);

    const onGuideSessionEndedMessageEvent = useCallback((event: GuideSessionEndedMessageEvent) =>
    {
        if(isOnDuty)
        {
            setOngoingUserId(0);
            setOngoingUsername(null);
            setOngoingFigure(null);
            setOngoingIsTyping(false);
            setOngoingMessageGroups([]);
            updateSessionState(GuideSessionState.GUIDE_TOOL_MENU);
        }
        else
        {
            updateSessionState(GuideSessionState.USER_FEEDBACK);
        }
    }, [ isOnDuty, updateSessionState ]);

    CreateMessageHook(GuideSessionEndedMessageEvent, onGuideSessionEndedMessageEvent);

    const onGuideSessionDetachedMessageEvent = useCallback((event: GuideSessionDetachedMessageEvent) =>
    {
        setOngoingUserId(0);
        setOngoingUsername(null);
        setOngoingFigure(null);
        setOngoingIsTyping(false);
        setOngoingMessageGroups([]);

        if(isOnDuty)
        {
            
            updateSessionState(GuideSessionState.GUIDE_TOOL_MENU);
        }
        else
        {
            updateSessionState(GuideSessionState.USER_THANKS);
        }
    }, [ isOnDuty, updateSessionState ]);

    CreateMessageHook(GuideSessionDetachedMessageEvent, onGuideSessionDetachedMessageEvent);

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
                setUserRequest('');
                setSessionState(GuideSessionState.GUIDE_TOOL_MENU);
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
        <NitroCardView className="nitro-guide-tool" simple>
            <NitroCardHeaderView headerText={ headerText } onCloseClick={ event => processAction('close') } noCloseButton={ noCloseButton } />
            <NitroCardContentView className="text-black">
                { (sessionState === GuideSessionState.GUIDE_TOOL_MENU) &&
                    <GuideToolMenuView isOnDuty={ isOnDuty } isHandlingGuideRequests={ isHandlingGuideRequests } setIsHandlingGuideRequests={ setIsHandlingGuideRequests } isHandlingHelpRequests={ isHandlingHelpRequests } setIsHandlingHelpRequests={ setIsHandlingHelpRequests } isHandlingBullyReports={ isHandlingBullyReports } setIsHandlingBullyReports={ setIsHandlingBullyReports } guidesOnDuty={ guidesOnDuty } helpersOnDuty={ helpersOnDuty } guardiansOnDuty={ guardiansOnDuty } processAction={ processAction } /> } 
                { (sessionState === GuideSessionState.GUIDE_ACCEPT) &&
                    <GuideToolAcceptView helpRequestDescription={ helpRequestDescription } helpRequestAverageTime={ helpRequestAverageTime } /> }
                { [ GuideSessionState.GUIDE_ONGOING, GuideSessionState.USER_ONGOING ].includes(sessionState) &&
                    <GuideToolOngoingView isGuide={ isOnDuty } userId={ ongoingUserId } userName={ ongoingUsername } userFigure={ ongoingFigure } isTyping={ ongoingIsTyping } messageGroups={ ongoingMessageGroups } /> }
                { (sessionState === GuideSessionState.USER_CREATE) &&
                    <GuideToolUserCreateRequestView userRequest={ userRequest } setUserRequest={ setUserRequest } /> }
                { (sessionState === GuideSessionState.USER_PENDING) &&
                    <GuideToolUserPendingView helpRequestDescription={ helpRequestDescription } helpRequestAverageTime={ helpRequestAverageTime } /> }
                { (sessionState === GuideSessionState.USER_FEEDBACK) &&
                    <GuideToolUserFeedbackView userName={ ongoingUsername } /> }
                { (sessionState === GuideSessionState.USER_THANKS) &&
                    <GuideToolUserThanksView /> }
            </NitroCardContentView>
        </NitroCardView>
    );
};
