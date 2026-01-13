import { FC, useCallback, useEffect, useRef } from "react"
import { AvatarEditorGridColorItem, CategoryData, IAvatarEditorCategoryModel } from "../../../../api"
import { AvatarEditorPaletteSetItem } from "./AvatarEditorPaletteSetItemView"

export interface AvatarEditorPaletteSetViewProps
{
    model: IAvatarEditorCategoryModel;
    category: CategoryData;
    paletteSet: AvatarEditorGridColorItem[];
    paletteIndex: number;
}

export const AvatarEditorPaletteSetView: FC<AvatarEditorPaletteSetViewProps> = props =>
{
    const { model = null, category = null, paletteSet = [], paletteIndex = -1 } = props
    const elementRef = useRef<HTMLDivElement>(null)

    const selectColor = useCallback((colorItem: AvatarEditorGridColorItem) => {
        const index = paletteSet.indexOf(colorItem)
        if (index === -1) return
        model.selectColor(category.name, index, paletteIndex)
    }, [ model, category, paletteSet, paletteIndex ])

    useEffect(() => {
        if (!model || !category || !elementRef || !elementRef.current) return
        elementRef.current.scrollTop = 0
    }, [ model, category ])

    return (
        <div className="illumina-scrollbar flex h-[92px] flex-wrap content-start gap-x-0.5 gap-y-1.5 py-0.5 !pr-px">
            { (paletteSet.length > 0) && paletteSet.map((item, index) => <AvatarEditorPaletteSetItem key={ index } colorItem={ item } onClick={ event => selectColor(item) } />) }
        </div>
    )
}
