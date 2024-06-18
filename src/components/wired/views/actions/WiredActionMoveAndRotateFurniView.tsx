import { FC, useEffect, useState } from 'react';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredActionBaseView } from './WiredActionBaseView';

const directionOptions: { value: number, icon: string }[] = [
    {
        value: 0,
        icon: 'ne'
    },
    {
        value: 2,
        icon: 'se'
    },
    {
        value: 4,
        icon: 'sw'
    },
    {
        value: 6,
        icon: 'nw'
    }
];

const rotationOptions: number[] = [ 0, 1, 2, 3, 4, 5, 6 ];

export const WiredActionMoveAndRotateFurniView: FC<{}> = props =>
{
    const [ movement, setMovement ] = useState(-1);
    const [ rotation, setRotation ] = useState(-1);
    const { trigger = null, setIntParams = null } = useWired();

    const save = () => setIntParams([ movement, rotation ]);

    useEffect(() =>
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
    }, [ trigger ]);

    return (
        <WiredActionBaseView hasSpecialInput={ true } requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_BY_ID_BY_TYPE_OR_FROM_CONTEXT } save={ save }>
            <div className="flex flex-col gap-1">
                <Text bold>{ LocalizeText('wiredfurni.params.startdir') }</Text>
                <div className="flex gap-1">
                    { directionOptions.map(option =>
                    {
                        return (
                            <div key={ option.value } className="flex items-center gap-1">
                                <input checked={ (movement === option.value) } className="form-check-input" id={ `movement${ option.value }` } name="movement" type="radio" onChange={ event => setMovement(option.value) } />
                                <Text>
                                    <i className={ `icon icon-${ option.icon }` } />
                                </Text>
                            </div>
                        );
                    }) }
                </div>
            </div>
            <div className="flex flex-col gap-1">
                <Text bold>{ LocalizeText('wiredfurni.params.turn') }</Text>
                { rotationOptions.map(option =>
                {
                    return (
                        <div key={ option } className="flex items-center gap-1">
                            <input checked={ (rotation === option) } className="form-check-input" id={ `rotation${ option }` } name="rotation" type="radio" onChange={ event => setRotation(option) } />
                            <Text>{ LocalizeText(`wiredfurni.params.turn.${ option }`) }</Text>
                        </div>
                    );
                }) }
            </div>
        </WiredActionBaseView>
    );
};
