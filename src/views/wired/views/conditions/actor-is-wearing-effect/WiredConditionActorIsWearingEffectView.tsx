import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../../utils/LocalizeText';
import { useWiredContext } from '../../../context/WiredContext';
import { WiredFurniType } from '../../../WiredView.types';
import { WiredConditionBaseView } from '../base/WiredConditionBaseView';

export const WiredConditionActorIsWearingEffectView: FC<{}> = props =>
{
    const [ effect, setEffect ] = useState(-1);
    const { trigger = null, setIntParams = null } = useWiredContext();

    useEffect(() =>
    {
        setEffect((trigger.intData.length > 0) ? trigger.intData[0] : 0);
    }, [ trigger ]);

    const save = useCallback(() =>
    {
        setIntParams([ effect ]);
    }, [ effect, setIntParams ]);
    
    return (
        <WiredConditionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ save }>
            <div className="form-group">
                <label className="fw-bold">{ LocalizeText('wiredfurni.params.effectid') }</label>
                <input type="number" className="form-control form-control-sm" value={ effect } onChange={ event => setEffect(parseInt(event.target.value)) } />
            </div>
        </WiredConditionBaseView>
    );
}
