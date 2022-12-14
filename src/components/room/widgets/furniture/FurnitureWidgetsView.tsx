import { FC } from 'react';
import { Base } from '../../../../common';
import { FurnitureContextMenuView } from './context-menu/FurnitureContextMenuView';
import { FurnitureBackgroundColorView } from './FurnitureBackgroundColorView';
import { FurnitureBadgeDisplayView } from './FurnitureBadgeDisplayView';
import { FurnitureCraftingView } from './FurnitureCraftingView';
import { FurnitureDimmerView } from './FurnitureDimmerView';
import { FurnitureExchangeCreditView } from './FurnitureExchangeCreditView';
import { FurnitureExternalImageView } from './FurnitureExternalImageView';
import { FurnitureFriendFurniView } from './FurnitureFriendFurniView';
import { FurnitureGiftOpeningView } from './FurnitureGiftOpeningView';
import { FurnitureHighScoreView } from './FurnitureHighScoreView';
import { FurnitureInternalLinkView } from './FurnitureInternalLinkView';
import { FurnitureMannequinView } from './FurnitureMannequinView';
import { FurnitureRoomLinkView } from './FurnitureRoomLinkView';
import { FurnitureSpamWallPostItView } from './FurnitureSpamWallPostItView';
import { FurnitureStackHeightView } from './FurnitureStackHeightView';
import { FurnitureStickieView } from './FurnitureStickieView';
import { FurnitureTrophyView } from './FurnitureTrophyView';
import { FurnitureYoutubeDisplayView } from './FurnitureYoutubeDisplayView';
import { FurniturePlaylistEditorWidgetView } from './playlist-editor/FurniturePlaylistEditorWidgetView';

export const FurnitureWidgetsView: FC<{}> = props =>
{
    return (
        <Base fit position="absolute" className="nitro-room-widgets top-0 start-0">
            <FurnitureBackgroundColorView />
            <FurnitureBadgeDisplayView />
            <FurnitureCraftingView />
            <FurnitureDimmerView />
            <FurnitureExchangeCreditView />
            <FurnitureExternalImageView />
            <FurnitureFriendFurniView />
            <FurnitureGiftOpeningView />
            <FurnitureHighScoreView />
            <FurnitureInternalLinkView />
            <FurnitureMannequinView />
            <FurniturePlaylistEditorWidgetView />
            <FurnitureRoomLinkView />
            <FurnitureSpamWallPostItView />
            <FurnitureStackHeightView />
            <FurnitureStickieView />
            <FurnitureTrophyView />
            <FurnitureContextMenuView />
            <FurnitureYoutubeDisplayView />
        </Base>
    );
}
