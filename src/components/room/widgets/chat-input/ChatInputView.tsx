import { HabboClubLevelEnum, RoomControllerLevel } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChatMessageTypeEnum, GetClubMemberLevel, GetConfiguration, GetRoomSession, GetSessionDataManager, LocalizeText, RoomWidgetUpdateChatInputContentEvent } from '../../../../api';
import { Text } from '../../../../common';
import { useChatInputWidget, useSessionInfo, useUiEvent } from '../../../../hooks';
import { ChatInputStyleSelectorView } from './ChatInputStyleSelectorView';

export const ChatInputView: FC<{}> = props =>
{
    const [ chatValue, setChatValue ] = useState<string>('');
    const { chatStyleId = 0, updateChatStyleId = null } = useSessionInfo();
    const { selectedUsername = '', floodBlocked = false, floodBlockedSeconds = 0, setIsTyping = null, setIsIdle = null, sendChat = null } = useChatInputWidget();
    const inputRef = useRef<HTMLInputElement>();

    const chatModeIdWhisper = useMemo(() => LocalizeText('widgets.chatinput.mode.whisper'), []);
    const chatModeIdShout = useMemo(() => LocalizeText('widgets.chatinput.mode.shout'), []);
    const chatModeIdSpeak = useMemo(() => LocalizeText('widgets.chatinput.mode.speak'), []);
    const maxChatLength = useMemo(() => GetConfiguration<number>('chat.input.maxlength', 100), []);

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

    const sendChatValue = useCallback((value: string, shiftKey: boolean = false) =>
    {
        if(!value || (value === '')) return;

        let chatType = (shiftKey ? ChatMessageTypeEnum.CHAT_SHOUT : ChatMessageTypeEnum.CHAT_DEFAULT);
        let text = value;

        const parts = text.split(' ');

        let recipientName = '';
        let append = '';

        switch(parts[0])
        {
            case chatModeIdWhisper:
                chatType = ChatMessageTypeEnum.CHAT_WHISPER;
                recipientName = parts[1];
                append = (chatModeIdWhisper + ' ' + recipientName + ' ');

                parts.shift();
                parts.shift();
                break;
            case chatModeIdShout:
                chatType = ChatMessageTypeEnum.CHAT_SHOUT;

                parts.shift();
                break;
            case chatModeIdSpeak:
                chatType = ChatMessageTypeEnum.CHAT_DEFAULT;

                parts.shift();
                break;
        }

        text = parts.join(' ');

        setIsTyping(false);
        setIsIdle(false);

        if(text.length <= maxChatLength)
        {
            if(/%CC%/g.test(encodeURIComponent(text)))
            {
                setChatValue('');
            }
            else
            {
                setChatValue('');
                sendChat(text, chatType, recipientName, chatStyleId);
            }
        }

        setChatValue(append);
    }, [ chatModeIdWhisper, chatModeIdShout, chatModeIdSpeak, maxChatLength, chatStyleId, setIsTyping, setIsIdle, sendChat ]);

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
    }, [ setIsTyping, setIsIdle ]);

    const onKeyDownEvent = useCallback((event: KeyboardEvent) =>
    {
        if(floodBlocked || !inputRef.current || anotherInputHasFocus()) return;

        if(document.activeElement !== inputRef.current) setInputFocus();

        const value = (event.target as HTMLInputElement).value;

        switch(event.key)
        {
            case ' ':
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

    }, [ floodBlocked, inputRef, chatModeIdWhisper, anotherInputHasFocus, setInputFocus, checkSpecialKeywordForInput, sendChatValue ]);

    useUiEvent<RoomWidgetUpdateChatInputContentEvent>(RoomWidgetUpdateChatInputContentEvent.CHAT_INPUT_CONTENT, event =>
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
    });

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

            if(style.isHcOnly && (GetClubMemberLevel() >= HabboClubLevelEnum.CLUB))
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

    if(GetRoomSession().isSpectator) return null;

    return (
        createPortal(
            <div className="nitro-chat-input-container">
                <div className="input-sizer align-items-center">
                    { !floodBlocked &&
                    <input ref={ inputRef } type="text" className="chat-input" placeholder={ LocalizeText('widgets.chatinput.default') } value={ chatValue } maxLength={ maxChatLength } onChange={ event => updateChatInput(event.target.value) } onMouseDown={ event => setInputFocus() } /> }
                    { floodBlocked &&
                    <Text variant="danger">{ LocalizeText('chat.input.alert.flood', [ 'time' ], [ floodBlockedSeconds.toString() ]) } </Text> }
                </div>
                <ChatInputStyleSelectorView chatStyleId={ chatStyleId } chatStyleIds={ chatStyleIds } selectChatStyleId={ updateChatStyleId } />
            </div>, document.getElementById('toolbar-chat-input-container'))
    );
}
