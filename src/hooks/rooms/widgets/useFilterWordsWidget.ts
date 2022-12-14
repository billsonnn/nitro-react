import { RoomGetFilterWordsMessageEvent } from '@nitrots/nitro-renderer';
import { useState } from 'react';
import { useMessageEvent } from '../../events';

const useFilterWordsWidgetState = () =>
{
    const [ wordsFilter, setWordsFilter ] = useState<string[]>(null);
    const [ isVisible, setIsVisible ] = useState<boolean>(false);

    const onClose = () => setIsVisible(false);

    useMessageEvent<RoomGetFilterWordsMessageEvent>(RoomGetFilterWordsMessageEvent, event =>
    {
        const parser = event.getParser();

        setIsVisible(true);
        setWordsFilter(parser.words);
    });

    return { wordsFilter, isVisible, setWordsFilter, onClose };
}

export const useFilterWordsWidget = useFilterWordsWidgetState;
