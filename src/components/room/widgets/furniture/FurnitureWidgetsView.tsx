import { FC } from "react"
import { FurnitureBackgroundColorView } from "./FurnitureBackgroundColorView"
import { FurnitureBadgeDisplayView } from "./FurnitureBadgeDisplayView"
import { FurnitureCraftingView } from "./FurnitureCraftingView"
import { FurnitureDimmerView } from "./FurnitureDimmerView"
import { FurnitureExchangeCreditView } from "./FurnitureExchangeCreditView"
import { FurnitureExternalImageView } from "./FurnitureExternalImageView"
import { FurnitureFootballGateView } from "./FurnitureFootballGateView"
import { FurnitureFriendFurniView } from "./FurnitureFriendFurniView"
import { FurnitureGiftOpeningView } from "./FurnitureGiftOpeningView"
import { FurnitureHighScoreView } from "./FurnitureHighScoreView"
import { FurnitureMannequinView } from "./FurnitureMannequinView"
import { FurnitureStackHeightView } from "./FurnitureStackHeightView"
import { FurnitureStickieView } from "./FurnitureStickieView"
import { FurnitureTrophyView } from "./FurnitureTrophyView"
import { FurnitureContextMenuView } from "./context-menu/FurnitureContextMenuView"
import { FurniturePlaylistEditorWidgetView } from "./playlist-editor/FurniturePlaylistEditorWidgetView"

export const FurnitureWidgetsView: FC<{}> = props =>
{
    return (
        <>
            <FurnitureCraftingView />
            <div className="absolute left-0 top-0">
                <FurnitureBackgroundColorView />
                <FurnitureBadgeDisplayView />
                <FurnitureDimmerView />
                <FurnitureExchangeCreditView />
                <FurnitureExternalImageView />
                <FurnitureFriendFurniView />
                <FurnitureGiftOpeningView />
                <FurnitureHighScoreView />
                <FurnitureMannequinView />
                <FurniturePlaylistEditorWidgetView />
                <FurnitureStackHeightView />
                <FurnitureStickieView />
                <FurnitureTrophyView />
                <FurnitureFootballGateView />
                <FurnitureContextMenuView />
            </div>
        </>
    )
}
