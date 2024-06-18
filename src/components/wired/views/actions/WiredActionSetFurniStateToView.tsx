import { FC, useEffect, useState } from 'react';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredActionBaseView } from './WiredActionBaseView';

export const WiredActionSetFurniStateToView: FC<{}> = props =>
{
    const [ stateFlag, setStateFlag ] = useState(0);
    const [ directionFlag, setDirectionFlag ] = useState(0);
    const [ positionFlag, setPositionFlag ] = useState(0);
    const { trigger = null, setIntParams = null } = useWired();

    const save = () => setIntParams([ stateFlag, directionFlag, positionFlag ]);

    useEffect(() =>
    {
        setStateFlag(trigger.getBoolean(0) ? 1 : 0);
        setDirectionFlag(trigger.getBoolean(1) ? 1 : 0);
        setPositionFlag(trigger.getBoolean(2) ? 1 : 0);
    }, [ trigger ]);

    return (
        <WiredActionBaseView hasSpecialInput={ true } requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_BY_ID } save={ save }>
            <div className="flex flex-col gap-1">
                <Text bold>{ LocalizeText('wiredfurni.params.conditions') }</Text>
                <div className="flex items-center gap-1">
                    <input checked={ !!stateFlag } className="form-check-input" id="stateFlag" type="checkbox" onChange={ event => setStateFlag(event.target.checked ? 1 : 0) } />
                    <Text>{ LocalizeText('wiredfurni.params.condition.state') }</Text>
                </div>
                <div className="flex items-center gap-1">
                    <input checked={ !!directionFlag } className="form-check-input" id="directionFlag" type="checkbox" onChange={ event => setDirectionFlag(event.target.checked ? 1 : 0) } />
                    <Text>{ LocalizeText('wiredfurni.params.condition.direction') }</Text>
                </div>
                <div className="flex items-center gap-1">
                    <input checked={ !!positionFlag } className="form-check-input" id="positionFlag" type="checkbox" onChange={ event => setPositionFlag(event.target.checked ? 1 : 0) } />
                    <Text>{ LocalizeText('wiredfurni.params.condition.position') }</Text>
                </div>
            </div>
        </WiredActionBaseView>
    );
};
