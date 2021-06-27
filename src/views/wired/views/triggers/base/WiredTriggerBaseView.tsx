import { FC, useCallback, useState } from 'react';
import { IWiredLayout } from '../../../utils/IWiredLayout';

export const WiredTriggerBaseView: FC<{}> = props =>
{
    const [ triggerLayouts, setTriggerLayouts ] = useState<IWiredLayout[]>([]);

    const RegisterActionLayout = useCallback((layout: IWiredLayout) =>
    {
        setTriggerLayouts(layouts => [...layouts, layout]);
    }, [ setTriggerLayouts ]);

    return null;
};
