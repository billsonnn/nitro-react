import { FC, useCallback, useEffect, useState } from 'react';
import { CategoryData } from '../../common/CategoryData';
import { AvatarEditorFigureSetView } from '../figure-set/AvatarEditorFigureSetView';
import { AvatarEditorModelViewProps } from './AvatarEditorModelView.types';

export const AvatarEditorModelView: FC<AvatarEditorModelViewProps> = props =>
{
    const { model = null, editor = null } = props;
    const [ activeCategory, setActiveCategory ] = useState<CategoryData>(null);

    const selectGender = useCallback((gender: string) =>
    {
        editor.gender = gender;
    }, [ editor ]);

    const selectCategory = useCallback((name: string) =>
    {
        const category = model.categories.get(name);

        if(!category) return;

        category.init();

        setActiveCategory(category);

        for(const part of category.parts)
        {
            if(!part || !part.isSelected) continue;

            model.maxPaletteCount = part.colorLayerCount;

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

    if(!activeCategory) return null;

    return (
        <div className="row h-100">
            <div className="col-2 d-flex flex-column h-100"></div>
            <div className="col-3 d-flex flex-column h-100">
                <AvatarEditorFigureSetView model={ model } category={ activeCategory } />
            </div>
            <div className="col-3 d-flex flex-column h-100"></div>
            <div className="col-4 d-flex flex-column h-100"></div>
        </div>
    );
}
