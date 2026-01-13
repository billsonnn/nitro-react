import { NavigatorSearchComposer } from "@nitrots/nitro-renderer"
import { FC, useEffect, useRef, useState } from "react"
import { LocalizeText, SendMessageComposer } from "../../../api"
import { Button, GridProps } from "../../../common"
import { useNavigator } from "../../../hooks"
import { RoomsContainerResultItemView } from "./RoomsContainerResultItemView"

interface RoomsContainerViewProps extends GridProps {
    userProfileUsername: string;
    onClose: () => void;
}

export const RoomsContainerView: FC<RoomsContainerViewProps> = (props) => {
    const { userProfileUsername = null, onClose } = props

    const { searchResult = null } = useNavigator()
    const elementRef = useRef<HTMLDivElement>()
    const [ currentIndex, setCurrentIndex ] = useState(0)

    const handleNextClick = () => {
        setCurrentIndex((prevIndex) => {
            if (prevIndex === searchResult.results[0].rooms.length - 1) {
                return 0
            } else {
                return prevIndex + 1
            }
        })
    }

    useEffect(() => {
        const searchValue = `owner:${userProfileUsername}`
        const contextCode = "hotel_view"

        SendMessageComposer(new NavigatorSearchComposer(contextCode, searchValue))
    }, [ userProfileUsername ])

    if (searchResult && searchResult.results[0].rooms.length > 1) {
        return (
            <div className="flex items-center gap-3">
                <div ref={elementRef} className="w-full">
                    <RoomsContainerResultItemView onClose={onClose} roomData={searchResult.results[0].rooms[currentIndex]} />
                </div>
                <Button className="!w-[26px] shrink-0 !px-0" onClick={handleNextClick}>
                    <i className="block h-[9px] w-2.5 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-56px_-128px]" />
                </Button>
            </div>
        )
    } else if (searchResult && searchResult.results[0].rooms.length === 1) {
        return (
            <div className="w-full">
                <RoomsContainerResultItemView onClose={onClose} roomData={searchResult.results[0].rooms[currentIndex]} />
            </div>
        )
    }

    return (
        <p className="!dark:text-[#cccccc] text-xs font-semibold !leading-3 text-[#1B1B1B]  [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">
            {LocalizeText("navigator.noroomsfound")}
        </p>
    )
}