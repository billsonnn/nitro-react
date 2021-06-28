import Slider from 'rc-slider/lib/Slider';
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

export const WiredActionMoveFurniToView: FC<{}> = props =>
{
    const [ spacing, setSpacing ] = useState(-1);
    const [ movement, setMovement ] = useState(-1);
    const { trigger = null, setIntParams = null } = useWiredContext();

    useEffect(() =>
    {
        if(trigger.intData.length >= 2)
        {
            setSpacing(trigger.intData[1]);
            setMovement(trigger.intData[0]);
        }
    }, [ trigger ]);

    const save = useCallback(() =>
    {
        setIntParams([movement, spacing]);
    }, [ movement, spacing, setIntParams ]);

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_BY_ID_OR_BY_TYPE } save={ save }>
            <div className="fw-bold">{ LocalizeText('wiredfurni.params.emptytiles', [ 'tiles' ], [ spacing.toString() ]) }</div>
            <Slider 
                defaultValue={ spacing }
                dots={ true }
                min={ 1 }
                max={ 5 }
                step={ 1 }
                onChange={ event => setSpacing(event) }
                />
            <hr className="my-1 mb-2 bg-dark" />
            <div className="fw-bold">{ LocalizeText('wiredfurni.params.startdir') }</div>
            <div className="row row-cold-4">
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
        </WiredActionBaseView>
    );
}
