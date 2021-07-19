import { UserFigureComposer } from 'nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { SendMessageHook } from '../../../../hooks';
import { LocalizeText } from '../../../../utils/LocalizeText';
import { CategoryData } from '../../common/CategoryData';
import { FigureData } from '../../common/FigureData';
import { AvatarEditorFigurePreviewView } from '../figure-preview/AvatarEditorFigurePreviewView';
import { AvatarEditorFigureSetView } from '../figure-set/AvatarEditorFigureSetView';
import { AvatarEditorPaletteSetView } from '../palette-set/AvatarEditorPaletteSetView';
import { AvatarEditorModelViewProps } from './AvatarEditorModelView.types';

export const AvatarEditorModelView: FC<AvatarEditorModelViewProps> = props =>
{
    const { model = null, editor = null, selectGender = null } = props;
    const [ activeCategory, setActiveCategory ] = useState<CategoryData>(null);
    const [ maxPaletteCount, setMaxPaletteCount ] = useState(1);

    const selectCategory = useCallback((name: string) =>
    {
        const category = model.categories.get(name);

        if(!category) return;

        category.init();

        setActiveCategory(category);

        for(const part of category.parts)
        {
            if(!part || !part.isSelected) continue;

            setMaxPaletteCount(part.maxColorIndex || 1);

            break;
        }
    }, [ model ]);

    const saveFigure = useCallback(() =>
    {
        const figureData = editor.figureData;

        SendMessageHook(new UserFigureComposer(figureData.gender, figureData.getFigureString()));
    }, [ editor ]);

    useEffect(() =>
    {
        model.init();

        for(const name of model.categories.keys())
        {
            selectCategory(name);

            break;
        }
    }, [ model, selectCategory ]);

    if(!model || !activeCategory) return null;

    return (
        <div className="row h-100">
            <div className="col-1 d-flex flex-column align-items-center h-100 pe-0">
                { model.canSetGender &&
                    <>
                        <i className={ `icon male-icon ${ (editor.gender === FigureData.MALE) ? ' selected' : ''}` }  onClick={ event => selectGender(FigureData.MALE) } />
                        <i className={ `icon female-icon ${ (editor.gender === FigureData.FEMALE) ? ' selected' : ''}` } onClick={ event => selectGender(FigureData.FEMALE) } />
                    </> }
                { !model.canSetGender && model.categories &&  (model.categories.size > 0) && Array.from(model.categories.keys()).map(name =>
                    {
                        const category = model.categories.get(name);

                        return (
                            <i className={ `icon ${ category.name }-icon mb-2 ${ (activeCategory === category) ? ' selected' : ''}` } onClick={ event => selectCategory(name) } />
                        );
                    })}
            </div>
            <div className="col-4 d-flex flex-column h-100">
                <AvatarEditorFigureSetView model={ model } category={ activeCategory } setMaxPaletteCount={ setMaxPaletteCount } />
            </div>
            <div className="col-3 d-flex flex-column h-100">
                <div className="figure-preview-container mb-2">
                    <AvatarEditorFigurePreviewView editor={ editor } />
                    <div className="arrow-container">
                        <i className="icon arrow-left-icon" />
                        <i className="icon arrow-right-icon" />
                    </div>
                </div>
                <div className="d-flex flex-column">
                    <div className="btn-group mb-1">
                        <button type="button" className="btn btn-sm btn-secondary">
                            <i className="fas fa-undo" />
                        </button>
                        <button type="button" className="btn btn-sm btn-secondary">
                            <i className="fas fa-trash" />
                        </button>
                    </div>
                    <button type="button" className="btn btn-success btn-sm w-100" onClick={ saveFigure }>{ LocalizeText('avatareditor.save') }</button>
                </div>
            </div>
            <div className="col-4 d-flex flex-column h-100">
                { (maxPaletteCount >= 1) &&
                    <AvatarEditorPaletteSetView model={ model } category={ activeCategory } paletteSet={ activeCategory.getPalette(0) } paletteIndex={ 0 } /> }
                { (maxPaletteCount === 2) &&
                    <AvatarEditorPaletteSetView model={ model } category={ activeCategory } paletteSet={ activeCategory.getPalette(1) } paletteIndex={ 1 } /> }
            </div>
        </div>
    );
}
