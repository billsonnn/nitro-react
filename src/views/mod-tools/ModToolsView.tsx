import { FC, useCallback, useEffect, useReducer, useState } from 'react';
import { ModToolsEvent } from '../../events/mod-tools/ModToolsEvent';
import { useUiEvent } from '../../hooks/events/ui/ui-event';
import { NitroCardContentView, NitroCardTabsView, NitroCardView } from '../../layout';
import { NitroCardSimpleHeaderView } from '../../layout/card/simple-header';
import { LocalizeText } from '../../utils/LocalizeText';
import { ModToolsContextProvider } from './context/ModToolsContext';
import { ModToolsViewProps } from './ModToolsView.types';
import { initialModTools, ModToolsReducer } from './reducers/ModToolsReducer';

export const ModToolsView: FC<ModToolsViewProps> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ modToolsState, dispatchModToolsState ] = useReducer(ModToolsReducer, initialModTools);
    
    const onModToolsEvent = useCallback((event: ModToolsEvent) =>
    {
        switch(event.type)
        {
            case ModToolsEvent.SHOW_MOD_TOOLS:
                setIsVisible(true);
                return;
            case ModToolsEvent.HIDE_MOD_TOOLS:
                setIsVisible(false);
                return;   
            case ModToolsEvent.TOGGLE_MOD_TOOLS:
                setIsVisible(value => !value);
                return;
        }
    }, []);

    useUiEvent(ModToolsEvent.SHOW_MOD_TOOLS, onModToolsEvent);
    useUiEvent(ModToolsEvent.HIDE_MOD_TOOLS, onModToolsEvent);
    useUiEvent(ModToolsEvent.TOGGLE_MOD_TOOLS, onModToolsEvent);

    useEffect(() =>
    {
        if(!isVisible) return;
    }, [ isVisible ]);

    return (
        <ModToolsContextProvider value={ { modToolsState, dispatchModToolsState } }>
            { isVisible &&
                <NitroCardView className="nitro-mod-tools">
                    <NitroCardSimpleHeaderView headerText={ LocalizeText('ModTools.title') } onCloseClick={ event => setIsVisible(false) } />
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
        </ModToolsContextProvider>
    );
}
