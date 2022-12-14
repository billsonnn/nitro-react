import { FC } from 'react';
import ReactSlider from 'react-slider';
import { LocalizeText } from '../../../../api';
import { Button, Column, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../common';
import { useFurnitureBackgroundColorWidget } from '../../../../hooks';

export const FurnitureBackgroundColorView: FC<{}> = props =>
{
    const { objectId = -1, hue = 0, setHue = null, saturation = 0, setSaturation = null, lightness = 0, setLightness = null, applyToner = null, toggleToner = null, onClose = null } = useFurnitureBackgroundColorWidget();

    if(objectId === -1) return null;

    return (
        <NitroCardView theme="primary-slim" className="nitro-room-widget-toner">
            <NitroCardHeaderView headerText={ LocalizeText('widget.backgroundcolor.title') } onCloseClick={ onClose } />
            <NitroCardContentView overflow="hidden" justifyContent="between">
                <Column overflow="auto" gap={ 1 }>
                    <Column>
                        <Text bold>{ LocalizeText('widget.backgroundcolor.hue') }</Text>
                        <ReactSlider
                            className={ 'nitro-slider' }
                            min={ 0 }
                            max={ 255 }
                            value={ hue }
                            onChange={ event => setHue(event) }
                            thumbClassName={ 'thumb degree' }
                            renderThumb={ (props, state) => <div { ...props }>{ state.valueNow }</div> } />
                    </Column>
                    <Column>
                        <Text bold>{ LocalizeText('widget.backgroundcolor.saturation') }</Text>
                        <ReactSlider
                            className={ 'nitro-slider' }
                            min={ 0 }
                            max={ 255 }
                            value={ saturation }
                            onChange={ event => setSaturation(event) }
                            thumbClassName={ 'thumb degree' }
                            renderThumb={ (props, state) => <div { ...props }>{ state.valueNow }</div> } />
                    </Column>
                    <Column>
                        <Text bold>{ LocalizeText('widget.backgroundcolor.lightness') }</Text>
                        <ReactSlider
                            className={ 'nitro-slider' }
                            min={ 0 }
                            max={ 255 }
                            value={ lightness }
                            onChange={ event => setLightness(event) }
                            thumbClassName={ 'thumb degree' }
                            renderThumb={ (props, state) => <div { ...props }>{ state.valueNow }</div> } />
                    </Column>
                </Column>
                <Column gap={ 1 }>
                    <Button fullWidth variant="primary" onClick={ toggleToner }>
                        { LocalizeText('widget.backgroundcolor.button.on') }
                    </Button>
                    <Button fullWidth variant="primary" onClick={ applyToner }>
                        { LocalizeText('widget.backgroundcolor.button.apply') }
                    </Button>
                </Column>
            </NitroCardContentView>
        </NitroCardView>
    );
}
