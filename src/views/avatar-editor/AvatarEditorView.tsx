import { AvatarEditorFigureCategory } from 'nitro-renderer';
import { FC, useCallback, useEffect, useReducer, useState } from 'react';
import { AvatarEditorEvent } from '../../events/avatar-editor';
import { useUiEvent } from '../../hooks/events/ui/ui-event';
import { NitroCardContentView, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardView } from '../../layout';
import { LocalizeText } from '../../utils/LocalizeText';
import { AvatarEditorViewProps } from './AvatarEditorView.types';
import { AvatarEditor } from './common/AvatarEditor';
import { BodyModel } from './common/BodyModel';
import { HeadModel } from './common/HeadModel';
import { IAvatarEditorCategoryModel } from './common/IAvatarEditorCategoryModel';
import { LegModel } from './common/LegModel';
import { TorsoModel } from './common/TorsoModel';
import { AvatarEditorContextProvider } from './context/AvatarEditorContext';
import { AvatarEditorReducer, initialAvatarEditor } from './reducers/AvatarEditorReducer';
import { AvatarEditorModelView } from './views/model/AvatarEditorModelView';

export const AvatarEditorView: FC<AvatarEditorViewProps> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ avatarEditorState, dispatchAvatarEditorState ] = useReducer(AvatarEditorReducer, initialAvatarEditor);
    const [ avatarEditor, setAvatarEditor ] = useState<AvatarEditor>(null);
    const [ categories, setCategories ] = useState<Map<string, IAvatarEditorCategoryModel>>(null);
    const [ activeCategory, setActiveCategory ] = useState<IAvatarEditorCategoryModel>(null);
    const [ isInitalized, setIsInitalized ] = useState(false);

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

    const selectCategory = useCallback((name: string) =>
    {
        setActiveCategory(categories.get(name));
    }, [ categories ]);

    useEffect(() =>
    {
        if(!isVisible || isInitalized) return;

        const newEditor = new AvatarEditor();

        setAvatarEditor(newEditor);

        const categories = new Map();

        categories.set(AvatarEditorFigureCategory.GENERIC, new BodyModel(newEditor));
        categories.set(AvatarEditorFigureCategory.HEAD, new HeadModel(newEditor));
        categories.set(AvatarEditorFigureCategory.TORSO, new TorsoModel(newEditor));
        categories.set(AvatarEditorFigureCategory.LEGS, new LegModel(newEditor));

        setCategories(categories);
        setActiveCategory(categories.get(AvatarEditorFigureCategory.GENERIC));
        setIsInitalized(true);
    }, [ isVisible, isInitalized ]);

    return (
        <AvatarEditorContextProvider value={ { avatarEditorState, dispatchAvatarEditorState } }>
            { isVisible &&
                <NitroCardView className="nitro-avatar-editor">
                    <NitroCardHeaderView headerText={ LocalizeText('avatareditor.title') } onCloseClick={ event => setIsVisible(false) } />
                    <NitroCardTabsView>
                        { categories && Array.from(categories.keys()).map(category =>
                            {
                                return (
                                    <NitroCardTabsItemView key={ category } isActive={ (activeCategory.name === category) } onClick={ event => selectCategory(category) }>
                                        { LocalizeText(`avatareditor.category.${ category }`) }
                                    </NitroCardTabsItemView>
                                );
                            })}
                    </NitroCardTabsView>
                    <NitroCardContentView>
                        { activeCategory && <AvatarEditorModelView model={ activeCategory } editor={ avatarEditor } /> }
                    </NitroCardContentView>
                </NitroCardView> }
        </AvatarEditorContextProvider>
    );
}
