import { AvatarEditorFigureCategory } from 'nitro-renderer';
import { FC, useCallback, useEffect, useReducer, useState } from 'react';
import { GetSessionDataManager } from '../../api';
import { AvatarEditorEvent } from '../../events/avatar-editor';
import { useUiEvent } from '../../hooks/events/ui/ui-event';
import { NitroCardContentView, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardView } from '../../layout';
import { LocalizeText } from '../../utils/LocalizeText';
import { AvatarEditorViewProps } from './AvatarEditorView.types';
import { AvatarEditor } from './common/AvatarEditor';
import { BodyModel } from './common/BodyModel';
import { FigureData } from './common/FigureData';
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

    const selectCategory = useCallback((name: string) =>
    {
        setActiveCategory(categories.get(name));
    }, [ categories ]);

    const resetCategories = useCallback((editor: AvatarEditor) =>
    {
        const categories = new Map();

        categories.set(AvatarEditorFigureCategory.GENERIC, new BodyModel(editor));
        categories.set(AvatarEditorFigureCategory.HEAD, new HeadModel(editor));
        categories.set(AvatarEditorFigureCategory.TORSO, new TorsoModel(editor));
        categories.set(AvatarEditorFigureCategory.LEGS, new LegModel(editor));

        setCategories(categories);
        setActiveCategory(categories.get(AvatarEditorFigureCategory.GENERIC));
    }, []);

    const selectGender = useCallback((gender: string) =>
    {
        if(gender === avatarEditor.gender) return;
        
        avatarEditor.gender = gender;

        resetCategories(avatarEditor);
    }, [ avatarEditor, resetCategories ]);

    const loadAvatarInEditor = useCallback((figure: string, gender: string, reset: boolean = true) =>
    {
        if(!avatarEditor) return;
        
        switch(gender)
        {
            case FigureData.MALE:
            case 'm':
            case 'M':
                gender = FigureData.MALE;
                break;
            case FigureData.FEMALE:
            case 'f':
            case 'F':
                gender = FigureData.FEMALE;
                break;
            default:
                gender = FigureData.MALE;
        }

        let update = false;

        if(gender !== avatarEditor.gender)
        {
            avatarEditor.gender = gender;

            update = true;
        }

        const figureData = avatarEditor.figureData;

        if(!figureData) return;

        if(figure !== figureData.getFigureString())
        {
            update = true;
        }

        figureData.loadAvatarData(figure, gender);

        if(update)
        {
            resetCategories(avatarEditor);
        }
    }, [ avatarEditor, resetCategories ]);

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
                setIsVisible(prevValue => !prevValue);
                return;
        }
    }, []);

    useUiEvent(AvatarEditorEvent.SHOW_EDITOR, onAvatarEditorEvent);
    useUiEvent(AvatarEditorEvent.HIDE_EDITOR, onAvatarEditorEvent);
    useUiEvent(AvatarEditorEvent.TOGGLE_EDITOR, onAvatarEditorEvent);

    useEffect(() =>
    {
        if(!isVisible || isInitalized) return;

        const newEditor = new AvatarEditor();

        setAvatarEditor(newEditor);
        setIsInitalized(true);
    }, [ isVisible, isInitalized ]);

    useEffect(() =>
    {
        if(!isVisible || !avatarEditor) return;

        loadAvatarInEditor(GetSessionDataManager().figure, GetSessionDataManager().gender);
    }, [ isVisible, avatarEditor, loadAvatarInEditor ]);

    return (
        <AvatarEditorContextProvider value={ { avatarEditorState, dispatchAvatarEditorState } }>
            { isVisible &&
                <NitroCardView className="nitro-avatar-editor">
                    <NitroCardHeaderView headerText={ LocalizeText('avatareditor.title') } onCloseClick={ event => setIsVisible(false) } />
                    <NitroCardTabsView>
                        { categories && (categories.size > 0) && Array.from(categories.keys()).map(category =>
                            {
                                return (
                                    <NitroCardTabsItemView key={ category } isActive={ (activeCategory.name === category) } onClick={ event => selectCategory(category) }>
                                        { LocalizeText(`avatareditor.category.${ category }`) }
                                    </NitroCardTabsItemView>
                                );
                            })}
                    </NitroCardTabsView>
                    <NitroCardContentView>
                        { activeCategory && <AvatarEditorModelView model={ activeCategory } editor={ avatarEditor } selectGender={ selectGender } /> }
                    </NitroCardContentView>
                </NitroCardView> }
        </AvatarEditorContextProvider>
    );
}
