import { FC, useCallback, useEffect, useState } from 'react';
import { CategoryData } from '../../common/CategoryData';
import { FigureData } from '../../common/FigureData';
import { AvatarEditorFigureSetView } from '../figure-set/AvatarEditorFigureSetView';
import { AvatarEditorPaletteSetView } from '../palette-set/AvatarEditorPaletteSetView';
import { AvatarEditorModelViewProps } from './AvatarEditorModelView.types';

export const AvatarEditorModelView: FC<AvatarEditorModelViewProps> = props =>
{
    const { model = null, gender = null, setGender = null } = props;
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
            <div className="col-2 d-flex flex-column align-items-center h-100">
                { model.canSetGender &&
                    <>
                        <div className="d-flex justify-content-center align-items-center category-item cursor-pointer"  onClick={ event => setGender(FigureData.MALE) }>
                            <i className={ `icon male-icon ${ (gender === FigureData.MALE) ? ' selected' : ''}` } />
                        </div>
                        <div className="d-flex justify-content-center align-items-center category-item cursor-pointer"  onClick={ event => setGender(FigureData.FEMALE) }>
                            <i className={ `icon female-icon ${ (gender === FigureData.FEMALE) ? ' selected' : ''}` } />
                        </div>
                    </> }
                { !model.canSetGender && model.categories &&  (model.categories.size > 0) && Array.from(model.categories.keys()).map(name =>
                    {
                        const category = model.categories.get(name);

                        return (
                            <div key={ name } className="d-flex justify-content-center align-items-center category-item cursor-pointer" onClick={ event => selectCategory(name) }>
                                <i className={ `icon ${ category.name }-icon ${ (activeCategory === category) ? ' selected' : ''}` } />
                            </div>
                        );
                    })}
            </div>
            <div className="col-5 d-flex flex-column h-100">
                <AvatarEditorFigureSetView model={ model } category={ activeCategory } setMaxPaletteCount={ setMaxPaletteCount } />
            </div>
            <div className="col-5 d-flex flex-column h-100">
                { (maxPaletteCount >= 1) &&
                    <AvatarEditorPaletteSetView model={ model } category={ activeCategory } paletteSet={ activeCategory.getPalette(0) } paletteIndex={ 0 } /> }
                { (maxPaletteCount === 2) &&
                    <AvatarEditorPaletteSetView model={ model } category={ activeCategory } paletteSet={ activeCategory.getPalette(1) } paletteIndex={ 1 } className="mt-1" /> }
            </div>
        </div>
    );
}
