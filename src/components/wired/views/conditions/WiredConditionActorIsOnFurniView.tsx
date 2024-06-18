import { FC } from 'react';
import { WiredFurniType } from '../../../../api';
import { WiredConditionBaseView } from './WiredConditionBaseView';

export const WiredConditionActorIsOnFurniView: FC<{}> = props =>
{
    return <WiredConditionBaseView hasSpecialInput={ false } requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_BY_ID } save={ null } />;
};
