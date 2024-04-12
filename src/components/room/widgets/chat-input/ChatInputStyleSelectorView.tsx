import { FC, MouseEvent, useEffect, useState } from 'react';
import { Overlay, Popover } from 'react-bootstrap';
import { Flex, Grid, NitroCardContentView } from '../../../../common';

interface ChatInputStyleSelectorViewProps
{
    chatStyleId: number;
    chatStyleIds: number[];
    selectChatStyleId: (styleId: number) => void;
}

export const ChatInputStyleSelectorView: FC<ChatInputStyleSelectorViewProps> = props =>
{
    const { chatStyleId = 0, chatStyleIds = null, selectChatStyleId = null } = props;
    const [ target, setTarget ] = useState<(EventTarget & HTMLElement)>(null);
    const [ selectorVisible, setSelectorVisible ] = useState(false);

    const selectStyle = (styleId: number) =>
    {
        selectChatStyleId(styleId);
        setSelectorVisible(false);
    }

    const toggleSelector = (event: MouseEvent<HTMLElement>) =>
    {
        let visible = false;

        setSelectorVisible(prevValue =>
        {
            visible = !prevValue;

            return visible;
        });

        if(visible) setTarget((event.target as (EventTarget & HTMLElement)));
    }

    useEffect(() =>
    {
        if(selectorVisible) return;

        setTarget(null);
    }, [ selectorVisible ]);

    return (
        <>
            <div className="icon chatstyles-icon cursor-pointer" onClick={ toggleSelector } />
            <Overlay placement="top" show={ selectorVisible } target={ target }>
                <Popover className="nitro-chat-style-selector-container image-rendering-pixelated">
                    <NitroCardContentView className="bg-transparent" overflow="hidden">
                        <Grid columnCount={ 3 } overflow="auto">
                            { chatStyleIds && (chatStyleIds.length > 0) && chatStyleIds.map((styleId) =>
                            {
                                return (
                                    <Flex key={ styleId } center pointer className="bubble-parent-container" onClick={ event => selectStyle(styleId) }>
                                        <div key={ styleId } className="bubble-container">
                                            <div className={ `chat-bubble bubble-${ styleId }` }>&nbsp;</div>
                                        </div>
                                    </Flex>
                                );
                            }) }
                        </Grid>
                    </NitroCardContentView>
                </Popover>
            </Overlay>
        </>
    );
}
