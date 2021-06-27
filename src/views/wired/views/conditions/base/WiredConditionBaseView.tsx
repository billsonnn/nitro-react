import { FC, useCallback, useState } from 'react';
import { IWiredLayout } from '../../../utils/IWiredLayout';

export const WiredConditionBaseView: FC<{}> = props =>
{
    const [ conditionLayouts, setConditionLayouts ] = useState<IWiredLayout[]>([]);

    const RegisterActionLayout = useCallback((layout: IWiredLayout) =>
    {
        setConditionLayouts(layouts => [...layouts, layout]);
    }, [ setConditionLayouts ]);

    return null;
};
