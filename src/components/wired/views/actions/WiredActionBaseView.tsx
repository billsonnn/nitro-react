import { WiredActionDefinition } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import ReactSlider from 'react-slider';
import { GetWiredTimeLocale, LocalizeText, WiredFurniType } from '../../../../api';
import { Column, Text } from '../../../../common';
import { useWiredContext } from '../../WiredContext';
import { WiredBaseView } from '../WiredBaseView';

export interface WiredActionBaseViewProps
{
    hasSpecialInput: boolean;
    requiresFurni: number;
    save: () => void;
}

export const WiredActionBaseView: FC<WiredActionBaseViewProps> = props =>
{
    const { requiresFurni = WiredFurniType.STUFF_SELECTION_OPTION_NONE, save = null, hasSpecialInput = false, children = null } = props;
    const [ delay, setDelay ] = useState(-1);
    const { trigger = null, setActionDelay = null } = useWiredContext();

    useEffect(() =>
    {
        setDelay((trigger as WiredActionDefinition).delayInPulses);
    }, [ trigger ]);

    const onSave = useCallback(() =>
    {
        if(save) save();

        setActionDelay(delay);
    }, [ delay, save, setActionDelay ]);

    return (
        <WiredBaseView wiredType="action" requiresFurni={ requiresFurni } save={ onSave } hasSpecialInput={ hasSpecialInput }>
            { children }
            { !!children && <hr className="m-0 bg-dark" /> }
            <Column>
                <Text bold>{ LocalizeText('wiredfurni.params.delay', [ 'seconds' ], [ GetWiredTimeLocale(delay) ]) }</Text>
                <ReactSlider
                    className={ 'nitro-slider' }
                    min={ 0 }
                    max={ 20 }
                    value={ delay }
                    onChange={ event => setDelay(event) } />
            </Column>
        </WiredBaseView>
    );
}
