import { AvatarEditorFigureCategory, AvatarFigurePartType, FigureDataContainer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { IAvatarEditorCategory } from '../../api';
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
        <div className="grid grid-cols-12 gap-2 overflow-hidden">
            <div className="flex flex-col col-span-2">
                { (name === AvatarEditorFigureCategory.GENERIC) &&
                        <>
                            <div className="category-item items-center justify-center cursor-pointer flex" onClick={ event => setGender(AvatarFigurePartType.MALE) }>
                                <AvatarEditorIcon icon="male" selected={ gender === FigureDataContainer.MALE } />
                            </div>
                            <div className="category-item items-center justify-center cursor-pointer flex" onClick={ event => setGender(AvatarFigurePartType.FEMALE) }>
                                <AvatarEditorIcon icon="female" selected={ gender === FigureDataContainer.FEMALE } />
                            </div>
                        </> }
                { (name !== AvatarEditorFigureCategory.GENERIC) && (categories.length > 0) && categories.map(category =>
                {
                    return (
                        <div key={ category.setType } className="category-item items-center justify-center cursor-pointer flex" onClick={ event => selectSet(category.setType) }>
                            <AvatarEditorIcon icon={ category.setType } selected={ (activeSetType === category.setType) } />
                        </div>
                    );
                }) }
            </div>
            <div className="flex flex-col overflow-hidden col-span-5">
                <AvatarEditorFigureSetView category={ activeCategory } columnCount={ 3 } />
            </div>
            <div className="flex flex-col overflow-hidden col-span-5">
                { (maxPaletteCount >= 1) &&
                        <AvatarEditorPaletteSetView category={ activeCategory } columnCount={ 5 } paletteIndex={ 0 } /> }
                { (maxPaletteCount === 2) &&
                        <AvatarEditorPaletteSetView category={ activeCategory } columnCount={ 5 } paletteIndex={ 1 } /> }
            </div>
        </div>
    );
};
