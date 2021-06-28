import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../../utils/LocalizeText';
import { useWiredContext } from '../../../context/WiredContext';
import { WiredFurniType } from '../../../WiredView.types';
import { WiredActionBaseView } from '../base/WiredActionBaseView';

export const WiredActionMoveFurniView: FC<{}> = props =>
{
    const options: {value: number, icon: string}[] = [
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
        <WiredActionBaseView requiresFurni={ WiredFurniType._Str_4873 } save={ save }>
            <div className="fw-bold">{ LocalizeText('wiredfurni.params.movefurni') }</div>
            <div className="form-check">
                <input className="form-check-input" type="radio" name="selectedTeam" id="movement0" checked={ movement === 0 } onChange={() => setMovement(0)} />
                <label className="form-check-label" htmlFor="movement0">
                    { LocalizeText('wiredfurni.params.movefurni.0') }
                </label>
            </div>
            <div className="row row-cold-4">
                { options.map(option =>
                    {
                        return (
                            <div className="col">
                                <div key={ option.value } className="form-check">
                                    <input className="form-check-input" type="radio" name="selectedTeam" id={'movement' + option.value} checked={ movement === option.value } onChange={() => setMovement(option.value)} />
                                    <label className="form-check-label" htmlFor={'movement' + option.value}>
                                        <i className={'icon icon-' + option.icon} />
                                    </label>
                                </div>
                            </div>
                        )
                    }) }
                <div className="col"></div>
            </div>
            
        </WiredActionBaseView>
    );
}
