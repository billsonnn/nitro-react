import { WiredActionDefinition } from "@nitrots/nitro-renderer"
import { FC, PropsWithChildren, useEffect } from "react"
import { GetWiredTimeLocale, LocalizeText, WiredFurniType } from "../../../../api"
import { useWired } from "../../../../hooks"
import { WiredBaseView } from "../WiredBaseView"
import { WiredRangeView } from "../WiredRangeView"

export interface WiredActionBaseViewProps
{
    hasSpecialInput: boolean;
    requiresFurni: number;
    save: () => void;
}

export const WiredActionBaseView: FC<PropsWithChildren<WiredActionBaseViewProps>> = props =>
{
    const { requiresFurni = WiredFurniType.STUFF_SELECTION_OPTION_NONE, save = null, hasSpecialInput = false, children = null } = props
    const { trigger = null, actionDelay = 0, setActionDelay = null } = useWired()

    useEffect(() =>
    {
        setActionDelay((trigger as WiredActionDefinition).delayInPulses)
    }, [ trigger, setActionDelay ])

    return (
        <WiredBaseView wiredType="action" requiresFurni={ requiresFurni } save={ save } hasSpecialInput={ hasSpecialInput }>
            { children }
            { !!children && <div className="my-[7px] h-px w-full bg-[#232323]" /> }
            <WiredRangeView
                title={ LocalizeText("wiredfurni.params.delay", [ "seconds" ], [ GetWiredTimeLocale(actionDelay) ]) }
                setState={ setActionDelay }
                state={ actionDelay }
                sliderMin={ 0 }
                sliderMax={ 20 }
            />
        </WiredBaseView>
    )
}
