import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { Column } from '../../../../common/Column';
import { Flex } from '../../../../common/Flex';
import { Text } from '../../../../common/Text';
import { BatchUpdates } from '../../../../hooks';
import { WiredFurniType } from '../../common/WiredFurniType';
import { useWiredContext } from '../../context/WiredContext';
import { WiredActionBaseView } from './WiredActionBaseView';

const directionOptions: { value: number, icon: string }[] = [
    {
        value: 4,
        icon: 'ne'
    },
    {
        value: 5,
        icon: 'se'
    },
    {
        value: 6,
        icon: 'sw'
    },
    {
        value: 7,
        icon: 'nw'
    },
    {
        value: 2,
        icon: 'mv-2'
    },
    {
        value: 3,
        icon: 'mv-3'
    },
    {
        value: 1,
        icon: 'mv-1'
    }
];

const rotationOptions: number[] = [0, 1, 2, 3];

export const WiredActionMoveFurniView: FC<{}> = props =>
{
    const [ movement, setMovement ] = useState(-1);
    const [ rotation, setRotation ] = useState(-1);
    const { trigger = null, setIntParams = null } = useWiredContext();

    const save = useCallback(() =>
    {
        setIntParams([ movement, rotation ]);
    }, [ movement, rotation, setIntParams ]);

    useEffect(() =>
    {
        BatchUpdates(() =>
        {
            if(trigger.intData.length >= 2)
            {
                setMovement(trigger.intData[0]);
                setRotation(trigger.intData[1]);
            }
            else
            {
                setMovement(-1);
                setRotation(-1);
            }
        });
    }, [ trigger ]);

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_BY_ID_BY_TYPE_OR_FROM_CONTEXT } save={ save }>
            <Column gap={ 1 }>
                <Text bold>{ LocalizeText('wiredfurni.params.movefurni') }</Text>
                <Flex alignItems="center" gap={ 1 }>
                    <input className="form-check-input" type="radio" name="selectedTeam" id="movement0" checked={ (movement === 0) } onChange={ event => setMovement(0) } />
                    <Text>{ LocalizeText('wiredfurni.params.movefurni.0') }</Text>
                </Flex>
                <Flex gap={ 1 }>
                    { directionOptions.map(option =>
                        {
                            return (
                                <Flex alignItems="center" key={ option.value } gap={ 1 }>
                                    <input className="form-check-input" type="radio" name="movement" id={ `movement${ option.value }` } checked={ (movement === option.value) } onChange={ event => setMovement(option.value) } />
                                    <i className={ `icon icon-${ option.icon }` } />
                                </Flex>
                            )
                        }) }
                    <div className="col" />
                </Flex>
            </Column>
            <Column gap={ 1 }>
                <Text bold>{ LocalizeText('wiredfurni.params.rotatefurni') }</Text>
                { rotationOptions.map(option =>
                        {
                            return (
                                <Flex alignItems="center" key={ option } gap={ 1 }>
                                    <input className="form-check-input" type="radio" name="rotation" id={ `rotation${ option }` } checked={ (rotation === option) } onChange={ event => setRotation(option) } />
                                    <Text>
                                        { [1, 2].includes(option) && <i className={ `icon icon-rot-${ option }` } /> }
                                        { LocalizeText(`wiredfurni.params.rotatefurni.${ option }`) }
                                    </Text>
                                </Flex>
                            )
                        }) }
            </Column>
        </WiredActionBaseView>
    );
}
