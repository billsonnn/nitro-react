import { FC, useEffect, useState } from 'react';
import ReactSlider from 'react-slider';
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

export const WiredActionMoveFurniToView: FC<{}> = props =>
{
    const [ spacing, setSpacing ] = useState(-1);
    const [ movement, setMovement ] = useState(-1);
    const { trigger = null, setIntParams = null } = useWired();

    const save = () => setIntParams([ movement, spacing ]);

    useEffect(() =>
    {
        if(trigger.intData.length >= 2)
        {
            setSpacing(trigger.intData[1]);
            setMovement(trigger.intData[0]);
        }
        else
        {
            setSpacing(-1);
            setMovement(-1);
        }
    }, [ trigger ]);

    return (
        <WiredActionBaseView hasSpecialInput={ true } requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_BY_ID_OR_BY_TYPE } save={ save }>
            <div className="flex flex-col gap-1">
                <Text bold>{ LocalizeText('wiredfurni.params.emptytiles', [ 'tiles' ], [ spacing.toString() ]) }</Text>
                <ReactSlider
                    className={ 'nitro-slider' }
                    max={ 5 }
                    min={ 1 }
                    value={ spacing }
                    onChange={ event => setSpacing(event) } />
            </div>
            <div className="flex flex-col gap-1">
                <Text bold>{ LocalizeText('wiredfurni.params.startdir') }</Text>
                <div className="flex gap-1">
                    { directionOptions.map(value =>
                    {
                        return (
                            <div key={ value.value } className="flex items-center gap-1">
                                <input checked={ (movement === value.value) } className="form-check-input" id={ `movement${ value.value }` } name="movement" type="radio" onChange={ event => setMovement(value.value) } />
                                <Text><i className={ `icon icon-${ value.icon }` } /></Text>
                            </div>
                        );
                    }) }
                </div>
            </div>
        </WiredActionBaseView>
    );
};
