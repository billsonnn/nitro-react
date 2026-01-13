import { FC } from "react"
import { GetSessionDataManager, LocalizeText } from "../../../../api"
import { Button } from "../../../../common"
import { NameChangeLayoutViewProps } from "./NameChangeView.types"

export const NameChangeInitView:FC<NameChangeLayoutViewProps> = props =>
{
    const { onAction = null } = props

    return (
        <div className="flex h-full flex-col">
            <p className="flex-1 text-sm">{ LocalizeText("tutorial.name_change.info.main") }</p>
            <div className="text-center text-xs font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("tutorial.name_change.current", [ "name" ], [ GetSessionDataManager().userName ]) }</div>
            <div className="mt-4 flex gap-[9px]">
                <Button className="!h-[66px] w-full" onClick={ () => onAction("start") }>{ LocalizeText("tutorial.name_change.change") }</Button>
                <Button className="!h-[66px] w-full" onClick={ () => onAction("confirmation", GetSessionDataManager().userName) }>{ LocalizeText("tutorial.name_change.keep") }</Button>
            </div>
        </div>
    )
}
