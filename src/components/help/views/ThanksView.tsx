import { FC } from "react"
import { LocalizeText } from "../../../api"
import { Button, NitroCardContentView, NitroCardHeaderView, NitroCardView } from "../../../common"

export interface ThanksViewProps
{
    onClose: () => void;
}

export const ThanksView: FC<ThanksViewProps> = props =>
{
    const { onClose = null } = props

    return (
        <NitroCardView uniqueKey="help-thanks" className="illumina-help-thanks w-[370px]">
            <NitroCardHeaderView headerText={ LocalizeText("guide.bully.request.reporter.title") } onCloseClick={ onClose } />
            <NitroCardContentView className="mt-1.5 h-full">
                <div className="mb-[18px] flex justify-between">
                    <div className="w-[250px]">
                        <p className="mb-1.5 font-semibold text-[#373737] [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("guide.bully.request.reporter.valid.caption") }</p>
                        <p className="mb-2 text-sm" dangerouslySetInnerHTML={{ __html: LocalizeText("guide.bully.request.reporter.valid.body") }} />
                    </div>
                    <div className="h-[120px] w-[35px] shrink-0 bg-[url('/client-assets/images/help/bully-self.png?v=2451779')] bg-center bg-no-repeat" />
                </div>
                <div className="illumina-previewer flex items-center gap-4 px-5 py-4">
                    <i className="mt-1 block h-[21px] w-[23px] shrink-0 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[0px_-153px]" />
                    <p className="text-[13px] text-[#0D0D0D] [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("guide.bully.request.reporter.note") }</p>
                </div>
                <div className="mt-6 flex items-center justify-center">
                    <Button onClick={ onClose }>{ LocalizeText("alert.close.button") }</Button>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    )
}
