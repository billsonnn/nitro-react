import { FC, useEffect, useState } from "react"
import { LocalizeText } from "../../../../api"
import { DraggableWindowPosition, NitroCardContentView, NitroCardHeaderView, NitroCardView } from "../../../../common"
import { useDoorbellWidget } from "../../../../hooks"

export const DoorbellWidgetView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false)
    const { users = [], answer = null } = useDoorbellWidget()

    useEffect(() =>
    {
        setIsVisible(!!users.length)
    }, [ users ])

    if(!isVisible) return null

    return (
        <NitroCardView uniqueKey="doorbell" className="illumina-doorbell w-[249px]" windowPosition={ DraggableWindowPosition.TOP_LEFT }>
            <NitroCardHeaderView headerText={ LocalizeText("navigator.doorbell.title") } onCloseClick={ event => setIsVisible(false) } />
            <NitroCardContentView>
                <div className="mb-2">
                    <p className="px-1 pb-1 text-sm">{ LocalizeText("widgets.doorbell.info") }</p>
                </div>
                <div className="illumina-scrollbar flex h-[82px] max-h-[82px] flex-col [&>*:nth-child(2n+2)]:bg-[#EEEEEE] dark:[&>*:nth-child(2n+2)]:bg-[#33312B]">
                    { users && (users.length > 0) && users.map((userName, index) => (
                        <div key={ index } className="flex items-center justify-between bg-white px-[7px] py-1.5 dark:bg-black">
                            <p className="text-sm">{ userName }</p>
                            <div className="flex items-center gap-[9px]">
                                <button onClick={ () => answer(userName, true) }>
                                    <i className="block h-3.5 w-4 cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-180px_-83px]" />
                                </button>
                                <button onClick={ () => answer(userName, false) }>
                                    <i className="block size-[13px] cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-226px_-100px]" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </NitroCardContentView>
        </NitroCardView>
    )
}
