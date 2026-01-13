import { FrontPageItem } from "@nitrots/nitro-renderer"
import { CSSProperties, FC, ReactNode, useMemo } from "react"
import { GetConfiguration } from "../../../../../../api"
import { BaseProps } from "../../../../../../common"

export interface CatalogLayoutFrontPageItemViewProps extends BaseProps<HTMLDivElement>
{
    item: FrontPageItem;
    classNames?: string[];
    className?: string;
    children?: ReactNode;
}

export const CatalogLayoutFrontPageItemView: FC<CatalogLayoutFrontPageItemViewProps> = props =>
{
    const { item = null, classNames = [], className = "", children = null, ...rest } = props

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ "relative cursor-pointer" ]

        if(classNames.length) newClassNames.push(...classNames)

        return newClassNames
    }, [ classNames ])

    const getClassName = useMemo(() =>
    {
        let newClassName = getClassNames.join(" ")

        if(className.length) newClassName += (" " + className)

        return newClassName.trim()
    }, [ getClassNames, className ])
    
    const imageUrl = (GetConfiguration<string>("image.library.url") + item.itemPromoImage)

    const getStyle = useMemo(() =>
    {
        const newStyle: CSSProperties = { }

        if(imageUrl) newStyle.background = `url(${ imageUrl }) center no-repeat`

        return newStyle
    }, [ imageUrl ])

    if(!item) return null

    return (
        <div className={ getClassName } style={ getStyle } { ...rest }>
            <div className="illumina-catalogue-feature-text absolute bottom-0 left-0 mx-[5px] mb-1 w-[-webkit-fill-available] px-2 pb-[9px] pt-[5px]">
                <p className="font-semibold text-white">{ item.itemName }</p>
            </div>
            { children }
        </div>
    )
}
