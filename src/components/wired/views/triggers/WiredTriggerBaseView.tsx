import { FC, useCallback } from 'react';
import { WiredFurniType } from '../../common/WiredFurniType';
import { WiredBaseView } from '../WiredBaseView';

export interface WiredTriggerBaseViewProps
{
    requiresFurni: number;
    save: () => void;
}

export const WiredTriggerBaseView: FC<WiredTriggerBaseViewProps> = props =>
{
    const { requiresFurni = WiredFurniType.STUFF_SELECTION_OPTION_NONE, save = null, children = null } = props;
    
    const onSave = useCallback(() =>
    {
        if(save) save();
    }, [ save ]);

    return (
        <WiredBaseView wiredType="trigger" requiresFurni={ requiresFurni } save={ onSave }>
            { children }
        </WiredBaseView>
    );
}
