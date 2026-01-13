import { FC } from "react"
import { ColumnProps } from ".."

interface NitroBigCardHeaderViewProps extends ColumnProps
{
    headerText?: string;
}

export const NitroBigCardHeaderView: FC<NitroBigCardHeaderViewProps> = props =>
{
    const { headerText = null, children, ...rest } = props

    return (
        <div className="mb-3.5 ml-3" { ...rest }>
            {headerText &&
                <span className="text-[8px]xl font-semibold !leading-6 text-white [text-shadow:_0_1px_0_#33312B]">{ headerText }</span> }
            { children }
        </div>
    )
}
