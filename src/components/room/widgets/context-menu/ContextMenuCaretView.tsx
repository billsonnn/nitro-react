import { FC } from "react"
import { FlexProps } from "../../../../common"

interface CaretViewProps extends FlexProps
{
    collapsed?: boolean;
}
export const ContextMenuCaretView: FC<CaretViewProps> = props =>
{
    const { collapsed = true, ...rest } = props

    return <div className="flex w-full items-center justify-center" { ...rest }>
        <div className="caret-down" />
        {/* { !collapsed && "collapsed-no" }
        { collapsed && "collapsed-true" } */}
    </div>
}
