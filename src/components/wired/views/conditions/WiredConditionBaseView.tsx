import { FC, useCallback } from 'react';
import { WiredFurniType } from '../../common/WiredFurniType';
import { WiredBaseView } from '../WiredBaseView';

export interface WiredConditionBaseViewProps
{
    requiresFurni: number;
    save: () => void;
}

export const WiredConditionBaseView: FC<WiredConditionBaseViewProps> = props =>
{
    const { requiresFurni = WiredFurniType.STUFF_SELECTION_OPTION_NONE, save = null, children = null } = props;
    
    const onSave = useCallback(() =>
    {
        if(save) save();
    }, [ save ]);

    return (
        <WiredBaseView wiredType="condition" requiresFurni={ requiresFurni } save={ onSave }>
            { children }
        </WiredBaseView>
    );
}
