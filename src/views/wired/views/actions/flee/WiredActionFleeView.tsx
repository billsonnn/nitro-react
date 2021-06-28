import { FC } from 'react';
import { WiredFurniType } from '../../../WiredView.types';
import { WiredActionBaseView } from '../base/WiredActionBaseView';

export const WiredActionFleeView: FC<{}> = props =>
{
    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType._Str_5430 } save={ null }></WiredActionBaseView>
    );
}
