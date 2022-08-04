import { FC, PropsWithChildren } from 'react';
import { WiredFurniType } from '../../../../api';
import { WiredBaseView } from '../WiredBaseView';

export interface WiredTriggerBaseViewProps
{
    hasSpecialInput: boolean;
    requiresFurni: number;
    save: () => void;
}

export const WiredTriggerBaseView: FC<PropsWithChildren<WiredTriggerBaseViewProps>> = props =>
{
    const { requiresFurni = WiredFurniType.STUFF_SELECTION_OPTION_NONE, save = null, hasSpecialInput = false, children = null } = props;
    
    const onSave = () => (save && save());

    return (
        <WiredBaseView wiredType="trigger" requiresFurni={ requiresFurni } hasSpecialInput={ hasSpecialInput } save={ onSave }>
            { children }
        </WiredBaseView>
    );
}
