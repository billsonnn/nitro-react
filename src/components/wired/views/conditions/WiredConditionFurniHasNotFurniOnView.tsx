import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { WiredFurniType } from '../../common/WiredFurniType';
import { useWiredContext } from '../../context/WiredContext';
import { WiredConditionBaseView } from './WiredConditionBaseView';

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
        setIntParams([ requireAll ]);
    }, [ requireAll, setIntParams ]);
    
    return (
        <WiredConditionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_BY_ID } save={ save }>
            <div className="form-group">
                <label className="fw-bold">{ LocalizeText('wiredfurni.params.not_requireall') }</label>
                { [0, 1].map(value =>
                    {
                        return (
                            <div key={ value } className="form-check">
                                <input className="form-check-input" type="radio" name="requireAll" id={ `requireAll${ value }` } checked={ (requireAll === value) } onChange={ event => setRequireAll(value) } />
                                <label className="form-check-label" htmlFor={ `requireAll${ value }` }>
                                    { LocalizeText(`wiredfurni.params.not_requireall.${ value }`) }
                                </label>
                            </div>
                        )
                    }) }
            </div>
        </WiredConditionBaseView>
    );
}
