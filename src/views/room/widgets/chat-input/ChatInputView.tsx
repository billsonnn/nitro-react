import { createRef, FC, MouseEvent, useCallback, useEffect, useState } from 'react';
import { SendChatTypingMessage } from '../../../../api/nitro/session/SendChatTypingMessage';
import { LocalizeText } from '../../../../utils/LocalizeText';
import { ChatInputViewProps } from './ChatInputView.types';

// const chatModeIdShout   = LocalizeText('widgets.chatinput.mode.shout');
// const chatModeIdSpeak   = LocalizeText('widgets.chatinput.mode.speak');
// const maxChatLength     = GetConfiguration<number>('chat.input.maxlength', 100);

let lastContent = '';

export const ChatInputView: FC<ChatInputViewProps> = props =>
{
    const [ chatValue, setChatValue ] = useState<string>('');
    const [ selectedUsername, setSelectedUsername ] = useState('');
    const [ isTyping, setIsTyping ] = useState(false);
    const [ maxCharacters, setMaxCharacters ] = useState<number>(100);

    const inputRef = createRef<HTMLInputElement>();

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

    const sendChatValue = useCallback((shiftKey: boolean = false) =>
    {
        if(!chatValue || (chatValue === '')) return;
    }, [ chatValue ]);

    const onKeyDownEvent = useCallback((event: KeyboardEvent) =>
    {
        if(!inputRef.current) return;

        if(anotherInputHasFocus()) return;

        if(document.activeElement !== inputRef.current) setInputFocus();

        switch(event.key)
        {
            case 'Space':
                checkSpecialKeywordForInput();
                return;
            case 'Enter':
                sendChatValue(event.shiftKey);
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
        <div className="nitro-chat-input">
            <div className="chatinput-container">
                <div className="input-sizer">
                    <input ref={ inputRef } type="text" className="chat-input" placeholder={ LocalizeText('widgets.chatinput.default') } value={ chatValue } maxLength={ maxCharacters } onChange={ event => { event.target.parentElement.dataset.value = event.target.value; setChatValue(event.target.value) } } onMouseDown={ onInputMouseDownEvent } />
                    {/* <input #chatInputView type="text" class="chat-input" placeholder="{{ 'widgets.chatinput.default' | translate }}" (input)="chatInputView.parentElement.dataset.value = chatInputView.value" [disabled]="floodBlocked" [maxLength]="inputMaxLength" /> */}
                </div>
            </div>
        </div>
    );
}
