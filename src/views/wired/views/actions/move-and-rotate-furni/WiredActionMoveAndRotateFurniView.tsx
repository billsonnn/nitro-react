import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../../utils/LocalizeText';
import { useWiredContext } from '../../../context/WiredContext';
import { WiredFurniType } from '../../../WiredView.types';
import { WiredActionBaseView } from '../base/WiredActionBaseView';

const directionOptions: {value: number, icon: string}[] = [
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

const rotationOptions: number[] = [0, 1, 2, 3, 4, 5, 6];

export const WiredActionMoveAndRotateFurniView: FC<{}> = props =>
{
    const [ movement, setMovement ] = useState(-1);
    const [ rotation, setRotation ] = useState(-1);
    const { trigger = null, setIntParams = null } = useWiredContext();

    useEffect(() =>
    {
        if(trigger.intData.length >= 2)
        {
            setMovement(trigger.intData[0]);
            setRotation(trigger.intData[1]);
        }
    }, [ trigger ]);

    const save = useCallback(() =>
    {
        setIntParams([movement, rotation]);
    }, [ movement, rotation, setIntParams ]);

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_BY_ID_BY_TYPE_OR_FROM_CONTEXT } save={ save }>
            <div className="fw-bold">{ LocalizeText('wiredfurni.params.startdir') }</div>
            <div className="row row-cols-4">
                { directionOptions.map(option =>
                    {
                        return (
                            <div key={ option.value } className="col">
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="movement" id={'movement' + option.value} checked={ movement === option.value } onChange={() => setMovement(option.value)} />
                                    <label className="form-check-label" htmlFor={'movement' + option.value}>
                                        <i className={'icon icon-' + option.icon} />
                                    </label>
                                </div>
                            </div>
                        )
                    }) }
            </div>
            <hr className="my-1 mb-2 bg-dark" />
            <div className="fw-bold">{ LocalizeText('wiredfurni.params.turn') }</div>
                { rotationOptions.map(option =>
                    {
                        return (
                            <div key={ option } className="form-check">
                                <input className="form-check-input" type="radio" name="rotation" id={'rotation' + option} checked={ rotation === option } onChange={() => setRotation(option)} />
                                <label className="form-check-label" htmlFor={'rotation' + option}>
                                    { LocalizeText('wiredfurni.params.turn.' + option) }
                                </label>
                            </div>
                        )
                    }) }
        </WiredActionBaseView>
    );
}
