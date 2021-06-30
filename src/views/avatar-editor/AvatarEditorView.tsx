import { FC, useCallback, useEffect, useReducer, useState } from 'react';
import { AvatarEditorEvent } from '../../events/avatar-editor';
import { useUiEvent } from '../../hooks/events/ui/ui-event';
import { NitroCardContentView, NitroCardHeaderView, NitroCardTabsView, NitroCardView } from '../../layout';
import { LocalizeText } from '../../utils/LocalizeText';
import { AvatarEditorViewProps } from './AvatarEditorView.types';
import { AvatarEditorContextProvider } from './context/AvatarEditorContext';
import { AvatarEditorReducer, initialAvatarEditor } from './reducers/AvatarEditorReducer';

export const AvatarEditorView: FC<AvatarEditorViewProps> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ avatarEditorState, dispatchAvatarEditorState ] = useReducer(AvatarEditorReducer, initialAvatarEditor);

    const onAvatarEditorEvent = useCallback((event: AvatarEditorEvent) =>
    {
        switch(event.type)
        {
            case AvatarEditorEvent.SHOW_EDITOR:
                setIsVisible(true);
                return;
            case AvatarEditorEvent.HIDE_EDITOR:
                setIsVisible(false);
                return;   
            case AvatarEditorEvent.TOGGLE_EDITOR:
                setIsVisible(value => !value);
                return;
        }
    }, []);

    useUiEvent(AvatarEditorEvent.SHOW_EDITOR, onAvatarEditorEvent);
    useUiEvent(AvatarEditorEvent.HIDE_EDITOR, onAvatarEditorEvent);
    useUiEvent(AvatarEditorEvent.TOGGLE_EDITOR, onAvatarEditorEvent);

    useEffect(() =>
    {
        if(!isVisible) return;
    }, [ isVisible ]);

    return (
        <AvatarEditorContextProvider value={ { avatarEditorState, dispatchAvatarEditorState } }>
            { isVisible &&
                <NitroCardView className="nitro-avatar-editor">
                    <NitroCardHeaderView headerText={ LocalizeText('avatareditor.title') } onCloseClick={ event => setIsVisible(false) } />
                    <NitroCardTabsView>
                    </NitroCardTabsView>
                    <NitroCardContentView>
                        <div className="row h-100">
                            <div className="col-3">
                            </div>
                            <div className="col">
                            </div>
                        </div>
                    </NitroCardContentView>
                </NitroCardView> }
        </AvatarEditorContextProvider>
    );
}
