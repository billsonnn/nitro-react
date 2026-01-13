import { FC, useEffect, useState } from "react"
import { AvatarEditorGridColorItem, GetConfiguration } from "../../../../api"
import { LayoutGridItemProps } from "../../../../common"

export interface AvatarEditorPaletteSetItemProps extends LayoutGridItemProps
{
    colorItem: AvatarEditorGridColorItem;
}

export const AvatarEditorPaletteSetItem: FC<AvatarEditorPaletteSetItemProps> = props =>
{
    const { colorItem = null, children = null, ...rest } = props
    const [ updateId, setUpdateId ] = useState(-1)

    const hcDisabled = GetConfiguration<boolean>("hc.disabled", false)

    useEffect(() =>
    {
        const rerender = () => setUpdateId(prevValue => (prevValue + 1))

        colorItem.notify = rerender

        return () => colorItem.notify = null
    }, [ colorItem ])

    return (
        <div className={`relative h-[17px] w-[13px] cursor-pointer ${colorItem.isSelected ? "-translate-y-0.5" : null}`} { ...rest }>
            <div className={`absolute left-0 top-0 size-full bg-[url('/client-assets/images/avatar-editor/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/avatar-editor/spritesheet-dark.png?v=2451779')] ${colorItem.isSelected ? "bg-[-329px_-24px]" : "bg-[-343px_-24px]"}`} />
            <div className="size-full" style={{ backgroundColor: colorItem.color }} />
            { (!hcDisabled && colorItem.isHC) && <i className="absolute bottom-0 right-0 h-[9px] w-2.5 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-298px_-69px]" /> }
        </div>
    )
}
