import { FC, MouseEvent, useCallback, useEffect, useState } from 'react';
import { Overlay, Popover } from 'react-bootstrap';
import { BatchUpdates } from '../../../../../hooks';
import { NitroCardContentView, NitroCardGridItemView, NitroCardGridView } from '../../../../../layout';
import { ChatInputStyleSelectorViewProps } from './ChatInputStyleSelectorView.types';

export const ChatInputStyleSelectorView: FC<ChatInputStyleSelectorViewProps> = props =>
{
    const { chatStyleId = 0, chatStyleIds = null, selectChatStyleId = null } = props;
    const [ target, setTarget ] = useState<(EventTarget & HTMLElement)>(null);
    const [ selectorVisible, setSelectorVisible ] = useState(false);

    useEffect(() =>
    {
        if(selectorVisible) return;

        setTarget(null);
    }, [ selectorVisible ]);

    const selectStyle = (styleId: number) =>
    {
        BatchUpdates(() =>
        {
            selectChatStyleId(styleId);
            setSelectorVisible(false);
        });
    }

    const toggleSelector = useCallback((event: MouseEvent<HTMLElement>) =>
    {
        BatchUpdates(() =>
        {
            let visible = false;

            setSelectorVisible(prevValue =>
                {
                    visible = !prevValue;

                    return visible;
                });

            if(visible) setTarget((event.target as (EventTarget & HTMLElement)));
        })
    }, []);

    return (
        <>
            <i className="icon chatstyles-icon cursor-pointer" onClick={ toggleSelector } />
            <Overlay show={ selectorVisible } target={ target } placement="top">
                <Popover className="nitro-chat-style-selector-container" id="chat-style-selector">
                    <NitroCardContentView className="bg-transparent overflow-hidden">
                        <NitroCardGridView>
                            { chatStyleIds && (chatStyleIds.length > 0) && chatStyleIds.map((styleId) =>
                                {
                                    return (
                                        <NitroCardGridItemView key={ styleId } itemActive={ (chatStyleId === styleId) } onClick={ event => selectStyle(styleId) }>
                                            <div className="bubble-container">
                                                <div className={ 'w-100 chat-bubble bubble-' + styleId }>&nbsp;</div>
                                            </div>
                                        </NitroCardGridItemView>
                                    );
                                }) }
                        </NitroCardGridView>
                    </NitroCardContentView>
                </Popover>
            </Overlay>
        </>
    );
}
