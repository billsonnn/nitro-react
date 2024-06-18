import { FC } from 'react';
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
import { FurnitureContextMenuView } from './context-menu/FurnitureContextMenuView';
import { FurniturePlaylistEditorWidgetView } from './playlist-editor/FurniturePlaylistEditorWidgetView';

export const FurnitureWidgetsView: FC<{}> = props =>
{
    return (
        <>
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
        </>
    );
};
