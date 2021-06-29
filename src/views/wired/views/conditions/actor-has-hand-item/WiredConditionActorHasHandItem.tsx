import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../../utils/LocalizeText';
import { useWiredContext } from '../../../context/WiredContext';
import { WiredFurniType } from '../../../WiredView.types';
import { WiredConditionBaseView } from '../base/WiredConditionBaseView';

export const WiredConditionActorHasHandItemView: FC<{}> = props =>
{
    const allowedHanditemIds: number[] = [2, 5, 7, 8, 9, 10, 27];

    const [ handItemId, setHandItemId ] = useState(-1);
    const { trigger = null, setIntParams = null } = useWiredContext();

    useEffect(() =>
    {
        setHandItemId((trigger.intData.length > 0) ? trigger.intData[0] : 0);
    }, [ trigger ]);

    const save = useCallback(() =>
    {
        setIntParams([handItemId]);
    }, [ handItemId, setIntParams ]);

    return (
        <WiredConditionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ save }>
            <div className="fw-bold">{ LocalizeText('wiredfurni.params.handitem') }</div>
            <select className="form-select" value={ handItemId } onChange={ (e) => setHandItemId(Number(e.target.value)) }>
                {allowedHanditemIds && allowedHanditemIds.map(value =>
                    {
                        return <option value={ value }>{ LocalizeText('handitem' + value) }</option>
                    })}
            </select>
        </WiredConditionBaseView>
    );
}
