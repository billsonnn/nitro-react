import { AvatarEditorFigureCategory, AvatarFigurePartType, FigureDataContainer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { IAvatarEditorCategory } from '../../api';
import { Column, Flex, Grid } from '../../common';
import { useAvatarEditor } from '../../hooks';
import { AvatarEditorIcon } from './AvatarEditorIcon';
import { AvatarEditorFigureSetView } from './figure-set';
import { AvatarEditorPaletteSetView } from './palette-set';

export const AvatarEditorModelView: FC<{
    name: string,
    categories: IAvatarEditorCategory[]
}> = props =>
{
    const { name = '', categories = [] } = props;
    const [ didChange, setDidChange ] = useState<boolean>(false);
    const [ activeSetType, setActiveSetType ] = useState<string>('');
    const { maxPaletteCount = 1, gender = null, setGender = null, selectedColorParts = null, getFirstSelectableColor = null, selectEditorColor = null } = useAvatarEditor();

    const activeCategory = useMemo(() =>
    {
        return categories.find(category => category.setType === activeSetType) ?? null;
    }, [ categories, activeSetType ]);

    const selectSet = useCallback((setType: string) =>
    {
        const selectedPalettes = selectedColorParts[setType];

        if(!selectedPalettes || !selectedPalettes.length) selectEditorColor(setType, 0, getFirstSelectableColor(setType));

        setActiveSetType(setType);
    }, [ getFirstSelectableColor, selectEditorColor, selectedColorParts ]);

    useEffect(() =>
    {
        if(!categories || !categories.length || !didChange) return;

        selectSet(categories[0]?.setType);
        setDidChange(false);
    }, [ categories, didChange, selectSet ]);

    useEffect(() =>
    {
        setDidChange(true);
    }, [ categories ]);

    if(!activeCategory) return null;

    return (
        <Grid>
            <Column size={ 2 }>
                { (name === AvatarEditorFigureCategory.GENERIC) &&
                    <>
                        <Flex center pointer className="category-item" onClick={ event => setGender(AvatarFigurePartType.MALE) }>
                            <AvatarEditorIcon icon="male" selected={ gender === FigureDataContainer.MALE } />
                        </Flex>
                        <Flex center pointer className="category-item" onClick={ event => setGender(AvatarFigurePartType.FEMALE) }>
                            <AvatarEditorIcon icon="female" selected={ gender === FigureDataContainer.FEMALE } />
                        </Flex>
                    </> }
                { (name !== AvatarEditorFigureCategory.GENERIC) && (categories.length > 0) && categories.map(category =>
                {
                    return (
                        <Flex center pointer key={ category.setType } className="category-item" onClick={ event => selectSet(category.setType) }>
                            <AvatarEditorIcon icon={ category.setType } selected={ (activeSetType === category.setType) } />
                        </Flex>
                    );
                }) }
            </Column>
            <Column size={ 5 } overflow="hidden">
                <AvatarEditorFigureSetView category={ activeCategory } />
            </Column>
            <Column size={ 5 } overflow="hidden">
                { (maxPaletteCount >= 1) &&
                    <AvatarEditorPaletteSetView category={ activeCategory } paletteIndex={ 0 } /> }
                { (maxPaletteCount === 2) &&
                    <AvatarEditorPaletteSetView category={ activeCategory } paletteIndex={ 1 } /> }
            </Column>
        </Grid>
    );
}
