import { FC, useEffect, useState } from 'react';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredConditionBaseView } from './WiredConditionBaseView';

export const WiredConditionFurniHasFurniOnView: FC<{}> = props =>
{
    const [ requireAll, setRequireAll ] = useState(-1);
    const { trigger = null, setIntParams = null } = useWired();

    const save = () => setIntParams([ requireAll ]);

    useEffect(() =>
    {
        setRequireAll((trigger.intData.length > 0) ? trigger.intData[0] : 0);
    }, [ trigger ]);

    return (
        <WiredConditionBaseView hasSpecialInput={ true } requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_BY_ID } save={ save }>
            <div className="flex flex-col gap-1">
                <Text bold>{ LocalizeText('wiredfurni.params.requireall') }</Text>
                { [ 0, 1 ].map(value =>
                {
                    return (
                        <div key={ value } className="flex items-center gap-1">
                            <input checked={ (requireAll === value) } className="form-check-input" id={ `requireAll${ value }` } name="requireAll" type="radio" onChange={ event => setRequireAll(value) } />
                            <Text>{ LocalizeText('wiredfurni.params.requireall.' + value) }</Text>
                        </div>
                    );
                }) }
            </div>
        </WiredConditionBaseView>
    );
};
