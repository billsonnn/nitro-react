import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../../utils/LocalizeText';
import { useWiredContext } from '../../../context/WiredContext';
import { WiredFurniType } from '../../../WiredView.types';
import { WiredConditionBaseView } from '../base/WiredConditionBaseView';

export const WiredConditionFurniHasNotFurniOnView: FC<{}> = props =>
{
    const [ requireAll, setRequireAll ] = useState(-1);
    const { trigger = null, setIntParams = null } = useWiredContext();

    useEffect(() =>
    {
        setRequireAll((trigger.intData.length > 0) ? trigger.intData[0] : 0);
    }, [ trigger ]);

    const save = useCallback(() =>
    {
        setIntParams([requireAll]);
    }, [ requireAll, setIntParams ]);
    
    return (
        <WiredConditionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_BY_ID } save={ save }>
            <div className="fw-bold">{ LocalizeText('wiredfurni.params.not_requireall') }</div>
            { [0, 1].map(option =>
                {
                    return (
                        <div key={ option } className="form-check">
                            <input className="form-check-input" type="radio" name="requireAll" id={'requireAll' + option} checked={ requireAll === option } onChange={() => setRequireAll(option)} />
                            <label className="form-check-label" htmlFor={'requireAll' + option}>
                                { LocalizeText('wiredfurni.params.not_requireall.' + option) }
                            </label>
                        </div>
                    )
                }) }
        </WiredConditionBaseView>
    );
}
