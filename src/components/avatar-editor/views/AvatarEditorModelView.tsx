import { Dispatch, FC, SetStateAction, useCallback, useEffect, useState } from "react"
import { CategoryData, FigureData, IAvatarEditorCategoryModel } from "../../../api"
import { Button } from "../../../common"
import { AvatarEditorFigureSetView } from "./figure-set/AvatarEditorFigureSetView"
import { AvatarEditorPaletteSetView } from "./palette-set/AvatarEditorPaletteSetView"

const CATEGORY_FOOTBALL_GATE = [ "ch", "cp", "lg", "sh" ]

export interface AvatarEditorModelViewProps
{
    model: IAvatarEditorCategoryModel;
    gender: string;
    isFromFootballGate: boolean;
    setGender: Dispatch<SetStateAction<string>>;
}

export const AvatarEditorModelView: FC<AvatarEditorModelViewProps> = props =>
{
    const { model = null, gender = null, isFromFootballGate = false, setGender = null } = props
    const [ activeCategory, setActiveCategory ] = useState<CategoryData>(null)
    const [ maxPaletteCount, setMaxPaletteCount ] = useState(1)

    const selectCategory = useCallback((name: string) =>
    {
        const category = model.categories.get(name)

        if(!category) return

        category.init()

        setActiveCategory(category)

        for(const part of category.parts)
        {
            if(!part || !part.isSelected) continue

            setMaxPaletteCount(part.maxColorIndex || 1)

            break
        }
    }, [ model ])

    useEffect(() =>
    {
        model.init()

        for(const name of model.categories.keys())
        {
            selectCategory(name)

            break
        }
    }, [ model, selectCategory ])

    if(!model || !activeCategory) return null

    const ICON_STYLE = {
        ml: "bg-[0px_0px] size-4",
        fm: "bg-[-17px_0px] w-3 h-[18px]",
        hr: "bg-[-30px_0px] w-[27px] h-[18px]",
        ha: "bg-[-58px_0px] w-7 h-4",
        he: "bg-[-87px_0px] w-[21px] h-[18px]",
        ea: "bg-[-109px_0px] w-8 h-4",
        fa: "bg-[-142px_0px] w-[18px] h-[19px]",
        ch: "bg-[-161px_0px] w-[26px] h-[18px]",
        cp: "bg-[-188px_0px] w-[26px] h-[18px]",
        cc: "bg-[-215px_0px] w-6 h-[18px]",
        ca: "bg-[-240px_0px] w-[22px] h-[18px]",
        lg: "bg-[-263px_0px] w-[19px] h-[18px]",
        sh: "bg-[-283px_0px] w-9 h-2.5",
        wa: "bg-[-320px_0px] w-9 h-[18px]"
    }

    return (
        <div className="flex h-full flex-col">
            <div className="flex h-[46px] gap-[3px] pt-1">
                { model.canSetGender &&
                    <>
                        <Button className={`h-[30px] min-w-[34px] !px-2 py-1.5 ${(gender === FigureData.MALE) ? "active" : ""}`} onClick={ event => setGender(FigureData.MALE) }>
                            <i className={`bg-[url('/client-assets/images/avatar-editor/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/avatar-editor/spritesheet-dark.png?v=2451779')] ${ICON_STYLE["ml"]}`} />
                        </Button>
                        <Button className={`h-[30px] min-w-[34px] !px-2 py-1.5 ${(gender === FigureData.FEMALE) ? "active" : ""}`} onClick={ event => setGender(FigureData.FEMALE) }>
                            <i className={`bg-[url('/client-assets/images/avatar-editor/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/avatar-editor/spritesheet-dark.png?v=2451779')] ${ICON_STYLE["fm"]}`} />
                        </Button>
                    </> }
                { !model.canSetGender && model.categories && (model.categories.size > 0) && Array.from(model.categories.keys()).map(name => {
                    const category = model.categories.get(name)

                    return (
                        (!isFromFootballGate || (isFromFootballGate && CATEGORY_FOOTBALL_GATE.includes(category.name))) && <Button key={ name } className={`h-[30px] min-w-[34px] !px-2 py-1.5 ${(activeCategory === category) ? "active" : ""}`} onClick={ event => selectCategory(name) }>
                            <i className={`bg-[url('/client-assets/images/avatar-editor/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/avatar-editor/spritesheet-dark.png?v=2451779')] ${ICON_STYLE[category.name]}`} />
                        </Button>
                    )
                })}
            </div>
            <div className="flex h-full flex-col justify-between">
                <AvatarEditorFigureSetView model={ model } category={ activeCategory } isFromFootballGate={ isFromFootballGate } setMaxPaletteCount={ setMaxPaletteCount } />
                <div className="flex gap-5">
                    { (maxPaletteCount >= 1) &&
                        <AvatarEditorPaletteSetView model={ model } category={ activeCategory } paletteSet={ activeCategory.getPalette(0) } paletteIndex={ 0 } /> }
                    { (maxPaletteCount === 2) &&
                        <AvatarEditorPaletteSetView model={ model } category={ activeCategory } paletteSet={ activeCategory.getPalette(1) } paletteIndex={ 1 } /> }
                </div>
            </div>
        </div>
    )
}
