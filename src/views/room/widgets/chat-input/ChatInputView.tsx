import { FC, MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { GetConfiguration, GetRoomSession, SendChatTypingMessage } from '../../../../api';
import { LocalizeText } from '../../../../utils/LocalizeText';
import { useRoomContext } from '../../context/RoomContext';
import { ChatInputMessageType, ChatInputViewProps } from './ChatInputView.types';

let lastContent = '';

export const ChatInputView: FC<ChatInputViewProps> = props =>
{
    const { eventDispatcher = null, widgetHandler = null } = useRoomContext();
    const [ chatValue, setChatValue ] = useState<string>('');
    const [ selectedUsername, setSelectedUsername ] = useState('');
    const [ isTyping, setIsTyping ] = useState(false);
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
                if((prevValue !== LocalizeText('widgets.chatinput.mode.whisper')) || !selectedUsername.length) return prevValue;

                return (`${ prevValue } ${ selectedUsername }`);
            });
    }, [ selectedUsername ]);

    const sendChat = useCallback((text: string, chatType: number, recipientName: string = '', styleId: number = 0) =>
    {
        setChatValue('');

        switch(chatType)
        {
            case ChatInputMessageType.CHAT_DEFAULT:
                GetRoomSession().sendChatMessage(text, styleId);
                return;
            case ChatInputMessageType.CHAT_WHISPER:
                GetRoomSession().sendWhisperMessage(recipientName, text, styleId);
                return;
            case ChatInputMessageType.CHAT_SHOUT:
                GetRoomSession().sendShoutMessage(text, styleId);
                return;
        }
    }, []);

    const sendChatValue = useCallback((value: string, shiftKey: boolean = false) =>
    {
        if(!value || (value === '')) return;

        let chatType = (shiftKey ? ChatInputMessageType.CHAT_SHOUT : ChatInputMessageType.CHAT_DEFAULT);
        let text = value;

        const parts = text.split(' ');

        let recipientName = '';
        let append = '';

        switch(parts[0])
        {
            case chatModeIdWhisper:
                chatType = ChatInputMessageType.CHAT_WHISPER;
                recipientName = parts[1];
                append = (chatModeIdWhisper + ' ' + recipientName + ' ');

                parts.shift();
                parts.shift();
                break;
            case chatModeIdShout:
                chatType = ChatInputMessageType.CHAT_SHOUT;

                parts.shift();
                break;
            case chatModeIdSpeak:
                chatType = ChatInputMessageType.CHAT_DEFAULT;

                parts.shift();
                break;
        }

        text = parts.join(' ');

        if(text.length <= maxChatLength)
        {
            // if(this.needsStyleUpdate)
            // {
            //     Nitro.instance.sessionDataManager.sendChatStyleUpdate(this.currentStyle);

            //     this.needsStyleUpdate = false;
            // }

            let currentStyle = 1;

            sendChat(text, chatType, recipientName, currentStyle);
        }
    }, [ chatModeIdWhisper, chatModeIdShout, chatModeIdSpeak, maxChatLength, sendChat ]);

    const onKeyDownEvent = useCallback((event: KeyboardEvent) =>
    {
        if(!inputRef.current || anotherInputHasFocus()) return;

        if(document.activeElement !== inputRef.current) setInputFocus();

        switch(event.key)
        {
            case 'Space':
                checkSpecialKeywordForInput();
                return;
            case 'Enter':
                sendChatValue((event.target as HTMLInputElement).value, event.shiftKey);
                return;
            case 'Backspace':
                return;
        }
        
    }, [ inputRef, anotherInputHasFocus, setInputFocus, checkSpecialKeywordForInput, sendChatValue ]);

    const onInputMouseDownEvent = useCallback((event: MouseEvent<HTMLInputElement>) =>
    {
        setInputFocus();
    }, [ setInputFocus ]);

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
        let idleTimer: ReturnType<typeof setTimeout> = null;

        if(!chatValue || !chatValue.length)
        {
            setIsTyping(prevValue =>
                {
                    if(!prevValue) return prevValue;
                    
                    if(prevValue) SendChatTypingMessage(false);

                    return false;
                });
        }
        else
        {
            setIsTyping(prevValue =>
                {
                    if(prevValue) return prevValue;
                    
                    if(!prevValue) SendChatTypingMessage(true);

                    return true;
                });

            lastContent = chatValue;

            idleTimer = setTimeout(() =>
            {
                setIsTyping(prevValue =>
                    {
                        if(prevValue) SendChatTypingMessage(false);

                        return false;
                    });
            }, 3000);
        }

        return () =>
        {
            if(idleTimer) clearTimeout(idleTimer);
        }
    }, [ chatValue ]);

    return (
        createPortal(
        <div className="nitro-chat-input">
            <div className="chatinput-container">
                <div className="input-sizer">
                    <input ref={ inputRef } type="text" className="chat-input" placeholder={ LocalizeText('widgets.chatinput.default') } value={ chatValue } maxLength={ maxChatLength } onChange={ event => { event.target.parentElement.dataset.value = event.target.value; setChatValue(event.target.value) } } onMouseDown={ onInputMouseDownEvent } />
                </div>
            </div>
        </div>, document.getElementById('toolbar-chat-input-container'))
    );
}
