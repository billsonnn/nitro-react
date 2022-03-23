import { FC, useCallback } from 'react';
import { WiredFurniType } from '../../common/WiredFurniType';
import { WiredBaseView } from '../WiredBaseView';

export interface WiredConditionBaseViewProps
{
    hasSpecialInput: boolean;
    requiresFurni: number;
    save: () => void;
}

export const WiredConditionBaseView: FC<WiredConditionBaseViewProps> = props =>
{
    const { requiresFurni = WiredFurniType.STUFF_SELECTION_OPTION_NONE, save = null, hasSpecialInput = false, children = null } = props;
    
    const onSave = useCallback(() =>
    {
        if(save) save();
    }, [ save ]);

    return (
        <WiredBaseView wiredType="condition" requiresFurni={ requiresFurni } hasSpecialInput={ hasSpecialInput } save={ onSave }>
            { children }
        </WiredBaseView>
    );
}
