import { FC, MouseEvent } from "react"
import { ColumnProps } from ".."
import { LayoutSubView } from "../layout/LayoutSubView"
import { LayoutTimesView } from "../layout/LayoutTimesView"

interface NitroCardHeaderViewProps extends ColumnProps
{
    headerText: string;
    isClose?: boolean;
    noCloseButton?: boolean;
    onCloseClick: (event: MouseEvent) => void;
}

export const NitroCardHeaderView: FC<NitroCardHeaderViewProps> = props =>
{
    const { headerText = null, isClose = true, noCloseButton = null, onCloseClick = null, ...rest } = props

    return (
        <div className="drag-handler relative h-[33px] max-h-[33px] min-h-[33px] px-2.5" { ...rest }>
            <div className="flex size-full items-center justify-between">
                <span className="text-xs font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ headerText }</span>
                {!noCloseButton
                    ? <>
                        { isClose
                            ? <LayoutTimesView onClick={ onCloseClick } />
                            : <LayoutSubView onClick={ onCloseClick } /> }
                    </>
                    : null}
            </div>
        </div>
    )
}
