import { AvatarDirectionAngle, AvatarEditorFigureCategory, FigureSetIdsMessageEvent, GetWardrobeMessageComposer, IAvatarFigureContainer, UserFigureComposer, UserWardrobePageEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { GetAvatarRenderManager, GetClubMemberLevel, GetSessionDataManager, LocalizeText } from '../../api';
import { AvatarEditorEvent } from '../../events/avatar-editor';
import { CreateMessageHook, SendMessageHook } from '../../hooks';
import { useUiEvent } from '../../hooks/events/ui/ui-event';
import { NitroCardContentView, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardView } from '../../layout';
import { AvatarEditorViewProps } from './AvatarEditorView.types';
import { AvatarEditorUtilities } from './common/AvatarEditorUtilities';
import { BodyModel } from './common/BodyModel';
import { FigureData } from './common/FigureData';
import { generateRandomFigure } from './common/FigureGenerator';
import { HeadModel } from './common/HeadModel';
import { IAvatarEditorCategoryModel } from './common/IAvatarEditorCategoryModel';
import { LegModel } from './common/LegModel';
import { TorsoModel } from './common/TorsoModel';
import { AvatarEditorFigurePreviewView } from './views/figure-preview/AvatarEditorFigurePreviewView';
import { AvatarEditorModelView } from './views/model/AvatarEditorModelView';
import { AvatarEditorWardrobeView } from './views/wardrobe/AvatarEditorWardrobeView';

const DEFAULT_MALE_FIGURE: string = 'hr-100.hd-180-7.ch-215-66.lg-270-79.sh-305-62.ha-1002-70.wa-2007';
const DEFAULT_FEMALE_FIGURE: string = 'hr-515-33.hd-600-1.ch-635-70.lg-716-66-62.sh-735-68';
const MAX_SAVED_FIGURES: number = 10;

export const AvatarEditorView: FC<AvatarEditorViewProps> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ figures, setFigures ] = useState<Map<string, FigureData>>(null);
    const [ figureData, setFigureData ] = useState<FigureData>(null);
    const [ categories, setCategories ] = useState<Map<string, IAvatarEditorCategoryModel>>(null);
    const [ activeCategory, setActiveCategory ] = useState<IAvatarEditorCategoryModel>(null);
    const [ figureSetIds, setFigureSetIds ] = useState<number[]>([]);
    const [ boundFurnitureNames, setBoundFurnitureNames ] = useState<string[]>([]);
    const [ savedFigures, setSavedFigures ] = useState<[ IAvatarFigureContainer, string ][]>(new Array(MAX_SAVED_FIGURES));
    const [ isWardrobeVisible, setIsWardrobeVisible ] = useState(false);
    const [ lastFigure, setLastFigure ] = useState<string>(null);
    const [ lastGender, setLastGender ] = useState<string>(null);
    const [ needsReset, setNeedsReset ] = useState(false);
    const [ isInitalized, setIsInitalized ] = useState(false);

    const onAvatarEditorEvent = useCallback((event: AvatarEditorEvent) =>
    {
        switch(event.type)
        {
            case AvatarEditorEvent.SHOW_EDITOR:
                setIsVisible(true);
                setNeedsReset(true);
                return;
            case AvatarEditorEvent.HIDE_EDITOR:
                setIsVisible(false);
                return;   
            case AvatarEditorEvent.TOGGLE_EDITOR:
                setIsVisible(prevValue =>
                    {
                        const flag = !prevValue;

                        if(flag) setNeedsReset(true);
                        
                        return flag;
                    });
                return;
        }
    }, []);

    useUiEvent(AvatarEditorEvent.SHOW_EDITOR, onAvatarEditorEvent);
    useUiEvent(AvatarEditorEvent.HIDE_EDITOR, onAvatarEditorEvent);
    useUiEvent(AvatarEditorEvent.TOGGLE_EDITOR, onAvatarEditorEvent);

    const onFigureSetIdsMessageEvent = useCallback((event: FigureSetIdsMessageEvent) =>
    {
        const parser = event.getParser();

        setFigureSetIds(parser.figureSetIds);
        setBoundFurnitureNames(parser.boundsFurnitureNames);
    }, []);

    CreateMessageHook(FigureSetIdsMessageEvent, onFigureSetIdsMessageEvent);

    const onUserWardrobePageEvent = useCallback((event: UserWardrobePageEvent) =>
    {
        const parser = event.getParser();
        const savedFigures: [ IAvatarFigureContainer, string ][] = [];

        let i = 0;

        while(i < MAX_SAVED_FIGURES)
        {
            savedFigures.push([ null, null ]);

            i++;
        }

        for(let [ index, [ look, gender ] ] of parser.looks.entries())
        {
            const container = GetAvatarRenderManager().createFigureContainer(look);

            savedFigures[(index - 1)] = [ container, gender ];
        }

        setSavedFigures(savedFigures)
    }, []);

    CreateMessageHook(UserWardrobePageEvent, onUserWardrobePageEvent);

    const selectCategory = useCallback((name: string) =>
    {
        if(!categories) return;
        
        setActiveCategory(categories.get(name));
    }, [ categories ]);

    const resetCategories = useCallback(() =>
    {
        const categories = new Map();

        categories.set(AvatarEditorFigureCategory.GENERIC, new BodyModel());
        categories.set(AvatarEditorFigureCategory.HEAD, new HeadModel());
        categories.set(AvatarEditorFigureCategory.TORSO, new TorsoModel());
        categories.set(AvatarEditorFigureCategory.LEGS, new LegModel());

        setCategories(categories);
    }, []);

    const setupFigures = useCallback(() =>
    {
        const figures: Map<string, FigureData> = new Map();

        const maleFigure = new FigureData();
        const femaleFigure = new FigureData();

        maleFigure.loadAvatarData(DEFAULT_MALE_FIGURE, FigureData.MALE);
        femaleFigure.loadAvatarData(DEFAULT_FEMALE_FIGURE, FigureData.FEMALE);

        figures.set(FigureData.MALE, maleFigure);
        figures.set(FigureData.FEMALE, femaleFigure);

        setFigures(figures);
        setFigureData(figures.get(FigureData.MALE));
    }, []);

    const loadAvatarInEditor = useCallback((figure: string, gender: string, reset: boolean = true) =>
    {
        gender = AvatarEditorUtilities.getGender(gender);

        let newFigureData = figureData;

        if(gender !== newFigureData.gender) newFigureData = figures.get(gender);

        if(figure !== newFigureData.getFigureString()) newFigureData.loadAvatarData(figure, gender);

        if(newFigureData !== figureData) setFigureData(newFigureData);

        if(reset)
        {
            setLastFigure(figureData.getFigureString());
            setLastGender(figureData.gender);
        }
    }, [ figures, figureData ]);

    const clearFigure = useCallback(() =>
    {
        loadAvatarInEditor(figureData.getFigureStringWithFace(0, false), figureData.gender, false);
        resetCategories();
    }, [ figureData, loadAvatarInEditor, resetCategories ]);

    const resetFigure = useCallback(() =>
    {
        loadAvatarInEditor(lastFigure, lastGender);
        resetCategories();
    }, [ lastFigure, lastGender, loadAvatarInEditor, resetCategories ]);

    const randomizeFigure = useCallback(() =>
    {
        const figure = generateRandomFigure(figureData, figureData.gender, GetClubMemberLevel(), figureSetIds, [ FigureData.FACE ]);

        loadAvatarInEditor(figure, figureData.gender, false);
        resetCategories();
    }, [ figureData, figureSetIds, loadAvatarInEditor, resetCategories ]);

    const rotateFigure = useCallback((direction: number) =>
    {
        if(direction < AvatarDirectionAngle.MIN_DIRECTION)
        {
            direction = (AvatarDirectionAngle.MAX_DIRECTION + (direction + 1));
        }

        if(direction > AvatarDirectionAngle.MAX_DIRECTION)
        {
            direction = (direction - (AvatarDirectionAngle.MAX_DIRECTION + 1));
        }

        figureData.direction = direction;
    }, [ figureData ]);

    const saveFigure = useCallback(() =>
    {
        SendMessageHook(new UserFigureComposer(figureData.gender, figureData.getFigureString()));
        setIsVisible(false);
    }, [ figureData ]);

    const setGender = useCallback((gender: string) =>
    {
        gender = AvatarEditorUtilities.getGender(gender);

        setFigureData(figures.get(gender));
    }, [ figures ]);

    useEffect(() =>
    {
        if(!isWardrobeVisible) return;

        setActiveCategory(null);
        SendMessageHook(new GetWardrobeMessageComposer());
    }, [ isWardrobeVisible ]);

    useEffect(() =>
    {
        if(!activeCategory) return;

        setIsWardrobeVisible(false);
    }, [ activeCategory ]);

    useEffect(() =>
    {
        if(!categories) return;

        selectCategory(AvatarEditorFigureCategory.GENERIC);
    }, [ categories, selectCategory ]);

    useEffect(() =>
    {
        if(!figureData) return;

        AvatarEditorUtilities.CURRENT_FIGURE = figureData;

        resetCategories();

        return () => AvatarEditorUtilities.CURRENT_FIGURE = null;
    }, [ figureData, resetCategories ]);

    useEffect(() =>
    {
        AvatarEditorUtilities.FIGURE_SET_IDS = figureSetIds;
        AvatarEditorUtilities.BOUND_FURNITURE_NAMES = boundFurnitureNames;

        resetCategories();

        return () =>
        {
            AvatarEditorUtilities.FIGURE_SET_IDS = null;
            AvatarEditorUtilities.BOUND_FURNITURE_NAMES = null;
        }
    }, [ figureSetIds, boundFurnitureNames, resetCategories ]);

    useEffect(() =>
    {
        if(!isVisible) return;

        if(!figures)
        {
            setupFigures();

            setIsInitalized(true);

            return;
        }
    }, [ isVisible, figures, setupFigures ]);

    useEffect(() =>
    {
        if(!isVisible || !isInitalized || !needsReset) return;

        loadAvatarInEditor(GetSessionDataManager().figure, GetSessionDataManager().gender);
        setNeedsReset(false);
    }, [ isVisible, isInitalized, needsReset, loadAvatarInEditor ]);

    if(!isVisible || !figureData) return null;

    return (
        <NitroCardView uniqueKey="avatar-editor" className="nitro-avatar-editor">
            <NitroCardHeaderView headerText={ LocalizeText('avatareditor.title') } onCloseClick={ event => setIsVisible(false) } />
            <NitroCardTabsView>
                { categories && (categories.size > 0) && Array.from(categories.keys()).map(category =>
                    {
                        const isActive = (activeCategory && (activeCategory.name === category));

                        return (
                            <NitroCardTabsItemView key={ category } isActive={ isActive } onClick={ event => selectCategory(category) }>
                                { LocalizeText(`avatareditor.category.${ category }`) }
                            </NitroCardTabsItemView>
                        );
                    })}
                <NitroCardTabsItemView isActive={ isWardrobeVisible } onClick={ event => setIsWardrobeVisible(true) }>
                    { LocalizeText('avatareditor.category.wardrobe') }
                </NitroCardTabsItemView>
            </NitroCardTabsView>
            <NitroCardContentView>
                <div className="row h-100">
                    <div className="col-9 d-flex flex-column h-100">
                        { (activeCategory && !isWardrobeVisible) && <AvatarEditorModelView model={ activeCategory } gender={ figureData.gender } setGender={ setGender } /> }
                        { isWardrobeVisible && <AvatarEditorWardrobeView figureData={ figureData } savedFigures={ savedFigures } setSavedFigures={ setSavedFigures } loadAvatarInEditor={ loadAvatarInEditor } /> }
                    </div>
                    <div className="col-3 d-flex flex-column h-100">
                        <div className="figure-preview-container">
                            <AvatarEditorFigurePreviewView figureData={ figureData } />
                            <div className="avatar-spotlight" />
                            <div className="avatar-shadow" />
                            <div className="arrow-container">
                                <i className="icon arrow-left-icon" onClick={ event => rotateFigure(figureData.direction + 1) }  />
                                <i className="icon arrow-right-icon" onClick={ event => rotateFigure(figureData.direction - 1) } />
                            </div>
                        </div>
                        <div className="d-flex flex-column mt-1">
                            <div className="btn-group mb-1">
                                <button type="button" className="btn btn-sm btn-secondary" onClick={ resetFigure }>
                                    <i className="fas fa-undo" />
                                </button>
                                <button type="button" className="btn btn-sm btn-secondary" onClick={ clearFigure }>
                                    <i className="fas fa-trash" />
                                </button>
                                <button type="button" className="btn btn-sm btn-secondary" onClick={ randomizeFigure }>
                                    <i className="fas fa-dice" />
                                </button>
                            </div>
                            <button type="button" className="btn btn-success btn-sm w-100" onClick={ saveFigure }>{ LocalizeText('avatareditor.save') }</button>
                        </div>
                    </div>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
}
