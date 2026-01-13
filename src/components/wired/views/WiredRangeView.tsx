import { FC } from "react"
import ReactSlider from "react-slider"
import { Button } from "../../../common"

export interface WiredRangeViewProps
{
    title?: string;
    setState: (state: any) => void;
    state: any;
    sliderMin?: number;
    sliderMax?: number;
}

export const WiredRangeView: FC<WiredRangeViewProps> = props =>
{
    const { title = "", setState = () => {}, state = null, sliderMin = 1, sliderMax = 120 } = props
    
    return (
        <div className="mb-[17px]">
            <p className="font-volter_bold">{ title }</p>
            <div className="mt-[11px] flex items-center gap-1.5 px-3">
                <Button variant="wired" className="!h-5 !w-5 !px-0" onClick={() => setState(state - 1)}>
                    <i className="h-[9px] w-2.5 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-111px_-118px]" />
                </Button>
                <ReactSlider
                    className="h-[17px] w-[141px] bg-[url('/client-assets/images/wireds/range-spritesheet.png?v=2451779')]"
                    min={ sliderMin }
                    max={ sliderMax }
                    value={ state }
                    onChange={ event => setState(event) }
                    renderThumb={ (props, state) => <div { ...props }>
                        <i className="mt-px block h-[15px] w-[11px] bg-[url('/client-assets/images/wireds/range-spritesheet.png?v=2451779')] bg-[-142px_0px]" />
                    </div> }
                />
                <Button variant="wired" className="!h-5 !w-5 !px-0" onClick={() => setState(state + 1)}>
                    <i className="h-[9px] w-2.5 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-112px_-128px]" />
                </Button>
            </div>
        </div>
    )
}
