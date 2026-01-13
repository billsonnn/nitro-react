import { FC } from "react"
import { GridProps } from "../../../common"

export interface InventoryCategoryEmptyViewProps extends GridProps
{
    title: string;
    desc: string;
}

export const InventoryCategoryEmptyView: FC<InventoryCategoryEmptyViewProps> = props =>
{
    const { title = "", desc = "", children = null, ...rest } = props
    
    return (
        <div className="flex size-full items-center justify-center gap-6 px-6">
            <div>
                <div className="h-[181px] w-[129px] bg-[url('/client-assets/images/inventory/empty.png?v=2451779')]" />
            </div>
            <div className="flex flex-col">
                <p className="pb-1.5 text-[18px] font-semibold text-[#E43F3E] [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ title }</p>
                <p className="text-sm [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ desc }</p>
            </div>
            { children }
        </div>
    )
}
