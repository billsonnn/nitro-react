import { FurnitureEngravingLockView } from './engraving-lock/FurnitureEngravingLockView';
import { FurnitureExchangeCreditView } from './exchange-credit/FurnitureExchangeCreditView';
import { FurnitureWidgetsViewProps } from './FurnitureWidgetsView.types';
import { FurnitureHighScoreView } from './high-score/FurnitureHighScoreView';
import { FurnitureManipulationMenuView } from './manipulation-menu/FurnitureManipulationMenuView';
import { FurnitureMannequinView } from './mannequin/FurnitureMannequinView';
import { FurniturePresentView } from './present/FurniturePresentView';
import { FurnitureStickieView } from './stickie/FurnitureStickieView';
import { FurnitureTrophyView } from './trophy/FurnitureTrophyView';

export function FurnitureWidgetsView(props: FurnitureWidgetsViewProps): JSX.Element
{
    const { events } = props;

    return (
        <div className="position-absolute nitro-room-widgets t-0 l-0">
            <FurnitureEngravingLockView events={ events } />
            <FurnitureExchangeCreditView events={ events } />
            <FurnitureHighScoreView events={ events } />
            <FurnitureManipulationMenuView events={ events } />
            <FurnitureMannequinView events={ events } />
            <FurniturePresentView events={ events } />
            <FurnitureStickieView events={ events } />
            <FurnitureTrophyView events={ events } />
        </div>
    );
}
