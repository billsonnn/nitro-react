import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../api';
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

    const save = useCallback(() =>
    {
        setIntParams([ movement, rotation ]);
    }, [ movement, rotation, setIntParams ]);

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_BY_ID_BY_TYPE_OR_FROM_CONTEXT } save={ save }>
            <div className="form-group mb-2">
                <label className="fw-bold">{ LocalizeText('wiredfurni.params.movefurni') }</label>
                <div className="form-check">
                    <input className="form-check-input" type="radio" name="selectedTeam" id="movement0" checked={ (movement === 0) } onChange={ event => setMovement(0) } />
                    <label className="form-check-label" htmlFor="movement0">
                        { LocalizeText('wiredfurni.params.movefurni.0') }
                    </label>
                </div>
                <div className="row row-col-4">
                    { directionOptions.map(option =>
                        {
                            return (
                                <div key={ option.value } className="col">
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name="movement" id={ `movement${ option.value }` } checked={ (movement === option.value) } onChange={ event => setMovement(option.value) } />
                                        <label className="form-check-label" htmlFor={ `movement${ option.value }` }>
                                            <i className={ `icon icon-${ option.icon }` } />
                                        </label>
                                    </div>
                                </div>
                            )
                        }) }
                    <div className="col" />
                </div>
            </div>
            <div className="form-group">
                <label className="fw-bold">{ LocalizeText('wiredfurni.params.rotatefurni') }</label>
                { rotationOptions.map(option =>
                        {
                            return (
                                <div key={ option } className="form-check">
                                    <input className="form-check-input" type="radio" name="rotation" id={ `rotation${ option }` } checked={ (rotation === option) } onChange={ event => setRotation(option) } />
                                    <label className="form-check-label" htmlFor={'rotation' + option}>
                                        { [1, 2].includes(option) && <i className={ `icon icon-rot-${ option }` } /> }
                                        { LocalizeText(`wiredfurni.params.rotatefurni.${ option }`) }
                                    </label>
                                </div>
                            )
                        }) }
            </div>
        </WiredActionBaseView>
    );
}
