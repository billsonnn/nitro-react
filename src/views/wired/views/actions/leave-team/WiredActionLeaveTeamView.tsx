import { FC } from 'react';
import { WiredFurniType } from '../../../WiredView.types';
import { WiredActionBaseView } from '../base/WiredActionBaseView';

export const WiredActionLeaveTeamView: FC<{}> = props =>
{
    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType._Str_5431 } save={ null }></WiredActionBaseView>
    );
}
