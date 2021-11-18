import { FC, useCallback, useEffect, useState } from 'react';
import { NitroLayoutFlex, NitroLayoutGrid, NitroLayoutGridColumn } from '../../../../layout';
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
        <NitroLayoutGrid>
            <NitroLayoutGridColumn size={ 2 }>
                { model.canSetGender &&
                    <>
                        <NitroLayoutFlex className="justify-content-center align-items-center category-item cursor-pointer" onClick={ event => setGender(FigureData.MALE) }>
                            <div className={ `nitro-avatar-editor-spritesheet male-icon ${ (gender === FigureData.MALE) ? ' selected' : ''}` } />
                        </NitroLayoutFlex>
                        <NitroLayoutFlex className="justify-content-center align-items-center category-item cursor-pointer" onClick={ event => setGender(FigureData.FEMALE) }>
                            <div className={ `nitro-avatar-editor-spritesheet female-icon ${ (gender === FigureData.FEMALE) ? ' selected' : ''}` } />
                        </NitroLayoutFlex>
                    </> }
                { !model.canSetGender && model.categories &&  (model.categories.size > 0) && Array.from(model.categories.keys()).map(name =>
                    {
                        const category = model.categories.get(name);

                        return (
                            <NitroLayoutFlex key={ name } className="justify-content-center align-items-center category-item cursor-pointer" onClick={ event => selectCategory(name) }>
                                <div className={ `nitro-avatar-editor-spritesheet ${ category.name }-icon ${ (activeCategory === category) ? ' selected' : ''}` } />
                            </NitroLayoutFlex>
                        );
                    })}
            </NitroLayoutGridColumn>
            <NitroLayoutGridColumn size={ 5 }>
                <AvatarEditorFigureSetView model={ model } category={ activeCategory } setMaxPaletteCount={ setMaxPaletteCount } />
            </NitroLayoutGridColumn>
            <NitroLayoutGridColumn size={ 5 }>
                { (maxPaletteCount >= 1) &&
                    <AvatarEditorPaletteSetView model={ model } category={ activeCategory } paletteSet={ activeCategory.getPalette(0) } paletteIndex={ 0 } /> }
                { (maxPaletteCount === 2) &&
                    <AvatarEditorPaletteSetView model={ model } category={ activeCategory } paletteSet={ activeCategory.getPalette(1) } paletteIndex={ 1 } className="mt-1" /> }
            </NitroLayoutGridColumn>
        </NitroLayoutGrid>
    );
}
