import { Dispatch, FC, SetStateAction, useCallback, useEffect, useRef } from 'react';
import { AvatarEditorGridPartItem, CategoryData, IAvatarEditorCategoryModel } from '../../../../api';
import { AutoGrid } from '../../../../common';
import { AvatarEditorFigureSetItemView } from './AvatarEditorFigureSetItemView';

const TSHIRT_FOOTBALL_GATE = [ 3111, 3110, 3109, 3030, 3114, 266, 265, 262, 3113, 3112, 691, 690, 667 ];
const NUMBER_BEHIND_FOOTBALL_GATE = [ 3128, 3127, 3126, 3125, 3124, 3123, 3122, 3121, 3120, 3119 ];
const PANTS_FOOTBALL_GATE = [ 3116, 281, 275, 715, 700, 696, 3006 ];
const SHOES_FOOTBALL_GATE = [ 3115, 3068, 906 ];
export interface AvatarEditorFigureSetViewProps
{
    model: IAvatarEditorCategoryModel;
    category: CategoryData;
    isFromFootballGate: boolean;
    setMaxPaletteCount: Dispatch<SetStateAction<number>>;
}

export const AvatarEditorFigureSetView: FC<AvatarEditorFigureSetViewProps> = props =>
{
    const { model = null, category = null, isFromFootballGate = false, setMaxPaletteCount = null } = props;
    const elementRef = useRef<HTMLDivElement>(null);

    const selectPart = useCallback((item: AvatarEditorGridPartItem) =>
    {
        const index = category.parts.indexOf(item);

        if(index === -1) return;

        model.selectPart(category.name, index);

        const partItem = category.getCurrentPart();

        setMaxPaletteCount(partItem.maxColorIndex || 1);
    }, [ model, category, setMaxPaletteCount ]);

    useEffect(() =>
    {
        if(!model || !category || !elementRef || !elementRef.current) return;

        elementRef.current.scrollTop = 0;
    }, [ model, category ]);

    return (
        <AutoGrid innerRef={ elementRef } columnCount={ 3 } columnMinHeight={ 50 }>
            { (category.parts.length > 0) && category.parts.map(item =>
                (!isFromFootballGate || (isFromFootballGate && TSHIRT_FOOTBALL_GATE.includes(item.id) || NUMBER_BEHIND_FOOTBALL_GATE.includes(item.id) || PANTS_FOOTBALL_GATE.includes(item.id) || SHOES_FOOTBALL_GATE.includes(item.id))) &&
                    <AvatarEditorFigureSetItemView key={ item.id } partItem={ item } onClick={ event => selectPart(item) } />)
            }
        </AutoGrid>
    );
}
