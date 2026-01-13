import { FC } from "react"
import { LocalizeText } from "../../../api"
import { useWired } from "../../../hooks"

export const WiredFurniSelectorView: FC<{}> = props =>
{
    const { trigger = null, furniIds = [] } = useWired()
    
    return (
        <div>
            <p className="mb-1.5 font-volter_bold">{ LocalizeText("wiredfurni.pickfurnis.caption", [ "count", "limit" ], [ furniIds.length.toString(), trigger.maximumItemSelectionCount.toString() ]) }</p>
            <p>{ LocalizeText("wiredfurni.pickfurnis.desc") }</p>
        </div>
    )
}
