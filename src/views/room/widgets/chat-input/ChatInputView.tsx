import { HabboClubLevelEnum, RoomControllerLevel } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { GetConfiguration, GetSessionDataManager, LocalizeText, RoomWidgetChatMessage, RoomWidgetChatTypingMessage, RoomWidgetUpdateChatInputContentEvent, RoomWidgetUpdateInfostandUserEvent, RoomWidgetUpdateRoomObjectEvent } from '../../../../api';
import { CreateEventDispatcherHook } from '../../../../hooks/events';
import { useRoomContext } from '../../context/RoomContext';
import { ChatInputStyleSelectorView } from './style-selector/ChatInputStyleSelectorView';

export const ChatInputView: FC<{}> = props =>
{
    const [ chatValue, setChatValue ] = useState<string>('');
    const [ selectedUsername, setSelectedUsername ] = useState('');
    const [ isTyping, setIsTyping ] = useState(false);
    const [ typingStartedSent, setTypingStartedSent ] = useState(false);
    const [ isIdle, setIsIdle ] = useState(false);
    const [ chatStyleId, setChatStyleId ] = useState(GetSessionDataManager().chatStyle);
    const [ needsChatStyleUpdate, setNeedsChatStyleUpdate ] = useState(false);
    const { eventDispatcher = null, widgetHandler = null } = useRoomContext();
    const inputRef = useRef<HTMLInputElement>();

    const chatModeIdWhisper = useMemo(() =>
    {
        return LocalizeText('widgets.chatinput.mode.whisper');
    }, []);

    const chatModeIdShout = useMemo(() =>
    {
        return LocalizeText('widgets.chatinput.mode.shout');
    }, []);

    const chatModeIdSpeak = useMemo(() =>
    {
        return LocalizeText('widgets.chatinput.mode.speak');
    }, []);

    const maxChatLength = useMemo(() =>
    {
        return GetConfiguration<number>('chat.input.maxlength', 100);
    }, []);

    const anotherInputHasFocus = useCallback(() =>
    {
        const activeElement = document.activeElement;

        if(!activeElement) return false;

        if(inputRef && (inputRef.current === activeElement)) return false;

        if(!(activeElement instanceof HTMLInputElement) && !(activeElement instanceof HTMLTextAreaElement)) return false;

        return true;
    }, [ inputRef ]);

    const setInputFocus = useCallback(() =>
    {
        inputRef.current.focus();

        inputRef.current.setSelectionRange((inputRef.current.value.length * 2), (inputRef.current.value.length * 2));
    }, [ inputRef ]);

    const checkSpecialKeywordForInput = useCallback(() =>
    {
        setChatValue(prevValue =>
            {
                if((prevValue !== chatModeIdWhisper) || !selectedUsername.length) return prevValue;

                return (`${ prevValue } ${ selectedUsername }`);
            });
    }, [ selectedUsername, chatModeIdWhisper ]);

    const sendChat = useCallback((text: string, chatType: number, recipientName: string = '', styleId: number = 0) =>
    {
        setChatValue('');

        widgetHandler.processWidgetMessage(new RoomWidgetChatMessage(RoomWidgetChatMessage.MESSAGE_CHAT, text, chatType, recipientName, styleId));
    }, [ widgetHandler ]);

    const sendChatValue = useCallback((value: string, shiftKey: boolean = false) =>
    {
        if(!value || (value === '')) return;

        let chatType = (shiftKey ? RoomWidgetChatMessage.CHAT_SHOUT : RoomWidgetChatMessage.CHAT_DEFAULT);
        let text = value;

        const parts = text.split(' ');

        let recipientName = '';
        let append = '';

        switch(parts[0])
        {
            case chatModeIdWhisper:
                chatType = RoomWidgetChatMessage.CHAT_WHISPER;
                recipientName = parts[1];
                append = (chatModeIdWhisper + ' ' + recipientName + ' ');

                parts.shift();
                parts.shift();
                break;
            case chatModeIdShout:
                chatType = RoomWidgetChatMessage.CHAT_SHOUT;

                parts.shift();
                break;
            case chatModeIdSpeak:
                chatType = RoomWidgetChatMessage.CHAT_DEFAULT;

                parts.shift();
                break;
        }

        text = parts.join(' ');

        setIsTyping(false);
        setIsIdle(false);

        if(text.length <= maxChatLength)
        {
            if(needsChatStyleUpdate)
            {
                console.log('send')
                GetSessionDataManager().sendChatStyleUpdate(chatStyleId);

                setNeedsChatStyleUpdate(false);
            }

            sendChat(text, chatType, recipientName, chatStyleId);
        }

        setChatValue(append);
    }, [ chatModeIdWhisper, chatModeIdShout, chatModeIdSpeak, maxChatLength, chatStyleId, needsChatStyleUpdate, sendChat ]);

    const updateChatInput = useCallback((value: string) =>
    {
        if(!value || !value.length)
        {
            setIsTyping(false);
        }
        else
        {
            setIsTyping(true);
            setIsIdle(true);
        }

        setChatValue(value);
    }, []);

    const onKeyDownEvent = useCallback((event: KeyboardEvent) =>
    {
        if(!inputRef.current || anotherInputHasFocus()) return;

        if(document.activeElement !== inputRef.current) setInputFocus();

        const value = (event.target as HTMLInputElement).value;

        switch(event.code)
        {
            case 'Space':
                checkSpecialKeywordForInput();
                return;
            case 'NumpadEnter':
            case 'Enter':
                sendChatValue(value, event.shiftKey);
                return;
            case 'Backspace':
                if(value)
                {
                    const parts = value.split(' ');

                    if((parts[0] === chatModeIdWhisper) && (parts.length === 3) && (parts[2] === ''))
                    {
                        setChatValue('');
                    }
                }
                return;
        }
        
    }, [ inputRef, chatModeIdWhisper, anotherInputHasFocus, setInputFocus, checkSpecialKeywordForInput, sendChatValue ]);

    const onRoomWidgetRoomObjectUpdateEvent = useCallback((event: RoomWidgetUpdateRoomObjectEvent) =>
    {
        setSelectedUsername('');
    }, []);

    CreateEventDispatcherHook(RoomWidgetUpdateRoomObjectEvent.OBJECT_DESELECTED, eventDispatcher, onRoomWidgetRoomObjectUpdateEvent);

    const onRoomWidgetUpdateInfostandUserEvent = useCallback((event: RoomWidgetUpdateInfostandUserEvent) =>
    {
        setSelectedUsername(event.name);
    }, []);

    CreateEventDispatcherHook(RoomWidgetUpdateInfostandUserEvent.PEER, eventDispatcher, onRoomWidgetUpdateInfostandUserEvent);

    const onRoomWidgetChatInputContentUpdateEvent = useCallback((event: RoomWidgetUpdateChatInputContentEvent) =>
    {
        switch(event.chatMode)
        {
            case RoomWidgetUpdateChatInputContentEvent.WHISPER: {
                setChatValue(`${ chatModeIdWhisper } ${ event.userName } `);
                return;
            }
            case RoomWidgetUpdateChatInputContentEvent.SHOUT:
                return;
        }
    }, [ chatModeIdWhisper ]);

    CreateEventDispatcherHook(RoomWidgetUpdateChatInputContentEvent.CHAT_INPUT_CONTENT, eventDispatcher, onRoomWidgetChatInputContentUpdateEvent);

    const selectChatStyleId = useCallback((styleId: number) =>
    {
        setChatStyleId(styleId);
        setNeedsChatStyleUpdate(true);
    }, []);

    const chatStyleIds = useMemo(() =>
    {
        let styleIds: number[] = [];

        const styles = GetConfiguration<{ styleId: number, minRank: number, isSystemStyle: boolean, isHcOnly: boolean, isAmbassadorOnly: boolean }[]>('chat.styles');

        for(const style of styles)
        {
            if(!style) continue;

            if(style.minRank > 0)
            {
                if(GetSessionDataManager().hasSecurity(style.minRank)) styleIds.push(style.styleId);

                continue;
            }

            if(style.isSystemStyle)
            {
                if(GetSessionDataManager().hasSecurity(RoomControllerLevel.MODERATOR))
                {
                    styleIds.push(style.styleId);

                    continue;
                }
            }

            if(GetConfiguration<number[]>('chat.styles.disabled').indexOf(style.styleId) >= 0) continue;

            if(style.isHcOnly && (GetSessionDataManager().clubLevel >= HabboClubLevelEnum.CLUB))
            {
                styleIds.push(style.styleId);

                continue;
            }

            if(style.isAmbassadorOnly && GetSessionDataManager().isAmbassador)
            {
                styleIds.push(style.styleId);

                continue;
            }

            if(!style.isHcOnly && !style.isAmbassadorOnly) styleIds.push(style.styleId);
        }

        return styleIds;
    }, []);

    useEffect(() =>
    {
        if(isTyping)
        {
            if(!typingStartedSent)
            {
                setTypingStartedSent(true);
                
                widgetHandler.processWidgetMessage(new RoomWidgetChatTypingMessage(isTyping));
            }
        }
        else
        {
            if(typingStartedSent)
            {
                setTypingStartedSent(false);

                widgetHandler.processWidgetMessage(new RoomWidgetChatTypingMessage(isTyping));
            }
        }
    }, [ widgetHandler, isTyping, typingStartedSent ]);

    useEffect(() =>
    {
        if(!isIdle) return;

        let timeout: ReturnType<typeof setTimeout> = null;

        if(isIdle)
        {
            timeout = setTimeout(() =>
            {
                setIsIdle(false);
                setIsTyping(false)
            }, 10000);
        }

        return () => clearTimeout(timeout);
    }, [ isIdle ]);

    useEffect(() =>
    {
        document.body.addEventListener('keydown', onKeyDownEvent);

        return () =>
        {
            document.body.removeEventListener('keydown', onKeyDownEvent);
        }
    }, [ onKeyDownEvent ]);

    useEffect(() =>
    {
        if(!inputRef.current) return;

        inputRef.current.parentElement.dataset.value = chatValue;
    }, [ chatValue ]);

    return (
        createPortal(
        <div className="nitro-chat-input-container">
            <div className="input-sizer">
                <input ref={ inputRef } type="text" className="chat-input" placeholder={ LocalizeText('widgets.chatinput.default') } value={ chatValue } maxLength={ maxChatLength } onChange={ event => updateChatInput(event.target.value) } onMouseDown={ event => setInputFocus() } />
            </div>
            <ChatInputStyleSelectorView chatStyleId={ chatStyleId } chatStyleIds={ chatStyleIds } selectChatStyleId={ selectChatStyleId } />
        </div>, document.getElementById('toolbar-chat-input-container'))
    );
}
