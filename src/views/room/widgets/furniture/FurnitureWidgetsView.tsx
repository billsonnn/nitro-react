import { FurnitureWidgetsViewProps } from './FurnitureWidgetsView.types';
import { FurnitureHighScoreView } from './high-score/FurnitureHighScoreView';
import { FurnitureMannequinView } from './mannequin/FurnitureMannequinView';
import { FurniturePresentView } from './present/FurniturePresentView';
import { FurnitureStickieView } from './stickie/FurnitureStickieView';

export function FurnitureWidgetsView(props: FurnitureWidgetsViewProps): JSX.Element
{
    const { events } = props;

    return (
        <div className="position-absolute nitro-room-widgets t-0 l-0">
            <FurnitureHighScoreView events={ events } />
            <FurnitureMannequinView events={ events } />
            <FurniturePresentView events={ events } />
            <FurnitureStickieView events={ events } />
        </div>
    );
}
