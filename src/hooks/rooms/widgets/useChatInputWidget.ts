import { useEffect, useState } from 'react';
import { useRoom } from '../useRoom';

const useChatInputWidgetState = () =>
{
    const [ isTyping, setIsTyping ] = useState<boolean>(false);

    const { roomSession = null, widgetHandler = null } = useRoom();

    useEffect(() =>
    {
        if(!isTyping || !roomSession) return;


    }, [ isTyping, roomSession ]);
}

export const useChatInputWidget = useChatInputWidgetState;
