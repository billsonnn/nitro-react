import { AvatarEditorFigureCategory } from '@nitrots/nitro-renderer';
import { FC, useEffect, useMemo, useState } from 'react';
import { FigureData, IAvatarEditorCategory } from '../../../api';
import { Column, Flex, Grid } from '../../../common';
import { useAvatarEditor } from '../../../hooks';
import { AvatarEditorIcon } from './AvatarEditorIcon';
import { AvatarEditorFigureSetView } from './figure-set';
import { AvatarEditorPaletteSetView } from './palette-set';

export const AvatarEditorModelView: FC<{
    name: string,
    categories: IAvatarEditorCategory[]
}> = props =>
{
    const { name = '', categories = [] } = props;
    const [ activeSetType, setActiveSetType ] = useState<string>('');
    const { maxPaletteCount = 1 } = useAvatarEditor();

    const activeCategory = useMemo(() =>
    {
        return categories.find(category => category.setType === activeSetType) ?? null;
    }, [ categories, activeSetType ]);

    const setGender = (gender: string) =>
    {
        //
    }

    useEffect(() =>
    {
        if(!activeCategory) return;

        // we need to run this when we change which parts r selected
        /*  for(const partItem of activeCategory.partItems)
        {
            if(!partItem || !part.isSelected) continue;

            setMaxPaletteCount(part.maxColorIndex || 1);

            break;
        } */
    }, [ activeCategory ])

    useEffect(() =>
    {
        if(!categories || !categories.length) return;

        setActiveSetType(categories[0]?.setType)
    }, [ categories ]);

    if(!activeCategory) return null;

    return (
        <Grid>
            <Column size={ 2 }>
                { (name === AvatarEditorFigureCategory.GENERIC) &&
                    <>
                        <Flex center pointer className="category-item" onClick={ event => setGender(FigureData.MALE) }>
                            <AvatarEditorIcon icon="male" selected={ false } />
                        </Flex>
                        <Flex center pointer className="category-item" onClick={ event => setGender(FigureData.FEMALE) }>
                            <AvatarEditorIcon icon="female" selected={ false } />
                        </Flex>
                    </> }
                { (name !== AvatarEditorFigureCategory.GENERIC) && (categories.length > 0) && categories.map(category =>
                {
                    return (
                        <Flex center pointer key={ category.setType } className="category-item" onClick={ event => setActiveSetType(category.setType) }>
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
