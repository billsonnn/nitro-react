import { Dispatch, FC, SetStateAction, useCallback, useEffect, useState } from 'react';
import { CategoryData, FigureData, IAvatarEditorCategoryModel } from '../../../api';
import { Column, Flex, Grid } from '../../../common';
import { AvatarEditorIcon } from './AvatarEditorIcon';
import { AvatarEditorFigureSetView } from './figure-set/AvatarEditorFigureSetView';
import { AvatarEditorPaletteSetView } from './palette-set/AvatarEditorPaletteSetView';

const CATEGORY_FOOTBALL_GATE = [ 'ch', 'cp', 'lg', 'sh' ];
export interface AvatarEditorModelViewProps
{
    model: IAvatarEditorCategoryModel;
    gender: string;
    isFromFootballGate: boolean;
    setGender: Dispatch<SetStateAction<string>>;
}

export const AvatarEditorModelView: FC<AvatarEditorModelViewProps> = props =>
{
    const { model = null, gender = null, isFromFootballGate = false, setGender = null } = props;
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
        <Grid>
            <Column size={ 2 }>
                { model.canSetGender &&
                    <>
                        <Flex center pointer className="category-item" onClick={ event => setGender(FigureData.MALE) }>
                            <AvatarEditorIcon icon="male" selected={ (gender === FigureData.MALE) } />
                        </Flex>
                        <Flex center pointer className="category-item" onClick={ event => setGender(FigureData.FEMALE) }>
                            <AvatarEditorIcon icon="female" selected={ (gender === FigureData.FEMALE) } />
                        </Flex>
                    </> }
                { !model.canSetGender && model.categories && (model.categories.size > 0) && Array.from(model.categories.keys()).map(name =>
                {
                    const category = model.categories.get(name);

                    return (
                        (!isFromFootballGate || (isFromFootballGate && CATEGORY_FOOTBALL_GATE.includes(category.name))) &&
                        <Flex key={ category.name } center pointer className="category-item" onClick={ event => selectCategory(name) }>
                            <AvatarEditorIcon icon={ category.name } selected={ (activeCategory === category) } />
                        </Flex>
                    )
                }) }
            </Column>
            <Column size={ 5 } overflow="hidden">
                <AvatarEditorFigureSetView model={ model } category={ activeCategory } isFromFootballGate={ isFromFootballGate } setMaxPaletteCount={ setMaxPaletteCount } />
            </Column>
            <Column size={ 5 } overflow="hidden">
                { (maxPaletteCount >= 1) &&
                    <AvatarEditorPaletteSetView model={ model } category={ activeCategory } paletteSet={ activeCategory.getPalette(0) } paletteIndex={ 0 } /> }
                { (maxPaletteCount === 2) &&
                    <AvatarEditorPaletteSetView model={ model } category={ activeCategory } paletteSet={ activeCategory.getPalette(1) } paletteIndex={ 1 } /> }
            </Column>
        </Grid>
    );
}
