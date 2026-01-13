import { FC, useEffect, useState } from "react"
import { AvatarEditorGridPartItem, GetConfiguration } from "../../../../api"
import { LayoutGridItem, LayoutGridItemProps } from "../../../../common"

export interface AvatarEditorFigureSetItemViewProps extends LayoutGridItemProps
{
    partItem: AvatarEditorGridPartItem;
}

export const AvatarEditorFigureSetItemView: FC<AvatarEditorFigureSetItemViewProps> = props =>
{
    const { partItem = null, children = null, ...rest } = props
    const [ updateId, setUpdateId ] = useState(-1)

    const hcDisabled = GetConfiguration<boolean>("hc.disabled", false)

    useEffect(() =>
    {
        const rerender = () => setUpdateId(prevValue => (prevValue + 1))

        partItem.notify = rerender

        return () => partItem.notify = null
    }, [ partItem ])

    return (
        <LayoutGridItem className="!size-[52px]" itemImage={ (partItem.isClear ? undefined : partItem.imageUrl) } itemAbsolute={ true } itemActive={ partItem.isSelected } { ...rest }>
            { !hcDisabled && partItem.isHC && <i className="absolute bottom-1 right-1 h-[9px] w-2.5 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-298px_-69px]" /> }
            { partItem.isClear && <div className="size-[27px] bg-[url('/client-assets/images/avatar-editor/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/avatar-editor/spritesheet-dark.png?v=2451779')] bg-[-329px_-43px]" /> }
            { children }
        </LayoutGridItem>
    )
}
