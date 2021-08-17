import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../../api';
import { useWiredContext } from '../../../context/WiredContext';
import { WiredFurniType } from '../../../WiredView.types';
import { WiredConditionBaseView } from '../base/WiredConditionBaseView';

const allowedHanditemIds: number[] = [ 2, 5, 7, 8, 9, 10, 27 ];

export const WiredConditionActorHasHandItemView: FC<{}> = props =>
{
    const [ handItemId, setHandItemId ] = useState(-1);
    const { trigger = null, setIntParams = null } = useWiredContext();

    useEffect(() =>
    {
        setHandItemId((trigger.intData.length > 0) ? trigger.intData[0] : 0);
    }, [ trigger ]);

    const save = useCallback(() =>
    {
        setIntParams([ handItemId ]);
    }, [ handItemId, setIntParams ]);

    return (
        <WiredConditionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ save }>
            <div className="form-group">
                <label className="fw-bold">{ LocalizeText('wiredfurni.params.handitem') }</label>
                <select className="form-select form-select-sm" value={ handItemId } onChange={ event => setHandItemId(parseInt(event.target.value)) }>
                    { allowedHanditemIds.map(value =>
                        {
                            return <option key={ value } value={ value }>{ LocalizeText(`handitem${ value }`) }</option>
                        }) }
                </select>
            </div>
        </WiredConditionBaseView>
    );
}
