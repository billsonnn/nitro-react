import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { Column } from '../../../../common/Column';
import { Flex } from '../../../../common/Flex';
import { Text } from '../../../../common/Text';
import { BatchUpdates } from '../../../../hooks';
import { WiredFurniType } from '../../common/WiredFurniType';
import { useWiredContext } from '../../context/WiredContext';
import { WiredActionBaseView } from './WiredActionBaseView';

export const WiredActionSetFurniStateToView: FC<{}> = props =>
{
    const [ stateFlag, setStateFlag ] = useState(-1);
    const [ directionFlag, setDirectionFlag ] = useState(-1);
    const [ positionFlag, setPositionFlag ] = useState(-1);
    const { trigger = null, setIntParams = null } = useWiredContext();

    const save = useCallback(() =>
    {
        setIntParams([ stateFlag, directionFlag, positionFlag ]);
    }, [ directionFlag, positionFlag, stateFlag, setIntParams ]);

    useEffect(() =>
    {
        BatchUpdates(() =>
        {
            setStateFlag(trigger.getBoolean(0) ? 1 : 0);
            setDirectionFlag(trigger.getBoolean(1) ? 1 : 0);
            setPositionFlag(trigger.getBoolean(2) ? 1 : 0);
        });
    }, [ trigger ]);

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_BY_ID } save={ save }>
            <Column gap={ 1 }>
                <Text bold>{ LocalizeText('wiredfurni.params.conditions') }</Text>
                <Flex alignItems="center" gap={ 1 }>
                    <input className="form-check-input" type="checkbox" id="stateFlag" onChange={ event => setStateFlag(event.target.checked ? 1 : 0) } />
                    <Text>{ LocalizeText('wiredfurni.params.condition.state') }</Text>
                </Flex>
                <Flex alignItems="center" gap={ 1 }>
                    <input className="form-check-input" type="checkbox" id="directionFlag" onChange={ event => setDirectionFlag(event.target.checked ? 1 : 0) } />
                    <Text>{ LocalizeText('wiredfurni.params.condition.direction') }</Text>
                </Flex>
                <Flex alignItems="center" gap={ 1 }>
                    <input className="form-check-input" type="checkbox" id="positionFlag" onChange={ event => setPositionFlag(event.target.checked ? 1 : 0) } />
                    <Text>{ LocalizeText('wiredfurni.params.condition.position') }</Text>
                </Flex>
            </Column>
        </WiredActionBaseView>
    );
}
