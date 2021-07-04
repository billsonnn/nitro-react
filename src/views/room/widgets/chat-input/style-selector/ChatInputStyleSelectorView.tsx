import { FC, useState } from 'react';
import { ChatInputStyleSelectorViewProps } from './ChatInputStyleSelectorView.types';

export const ChatInputStyleSelectorView: FC<ChatInputStyleSelectorViewProps> = props =>
{
    const { onStyleSelected = null } = props;
    const [ selectorVisible, setSelectorVisible ] = useState(false);

    return (
        <>
            <div className="nitro-chat-style-selector-button">
                <i className="icon chatstyles-icon" />
            </div>
            { selectorVisible &&
                <div className="nitro-chat-style-selector-container">

                </div> }
        </>
    )
}
