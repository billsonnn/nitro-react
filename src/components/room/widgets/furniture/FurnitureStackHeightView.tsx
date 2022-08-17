import { FurnitureStackHeightComposer } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import ReactSlider from 'react-slider';
import { LocalizeText, SendMessageComposer } from '../../../../api';
import { Button, Column, Flex, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../common';
import { useFurnitureStackHeightWidget } from '../../../../hooks';

export const FurnitureStackHeightView: FC<{}> = props =>
{
    const { objectId = -1, height = 0, maxHeight = 40, onClose = null, setHeight = null } = useFurnitureStackHeightWidget();

    if(objectId === -1) return null;

    return (
        <NitroCardView className="nitro-widget-custom-stack-height" theme="primary-slim">
            <NitroCardHeaderView headerText={ LocalizeText('widget.custom.stack.height.title') } onCloseClick={ onClose } />
            <NitroCardContentView justifyContent="between">
                <Text>{ LocalizeText('widget.custom.stack.height.text') }</Text>
                <Flex gap={ 2 }>
                    <ReactSlider
                        className="nitro-slider"
                        min={ 0 }
                        max={ maxHeight }
                        step={ 0.01 }
                        value={ isNaN(parseFloat(height.toString())) ? 0 : parseFloat(height.toString()) }
                        onChange={ event => setHeight(parseFloat(event.toString())) }
                        renderThumb={ (props, state) => <div { ...props }>{ state.valueNow }</div> } />
                    <input className="show-number-arrows" style={ { width: '50px' } } type="number" min={ 0 } max={ maxHeight } value={ isNaN(parseFloat(height.toString())) ? '' : height } onChange={ event => setHeight(parseFloat(event.target.value)) } />
                </Flex>
                <Column gap={ 1 }>
                    <Button onClick={ event => SendMessageComposer(new FurnitureStackHeightComposer(objectId, -100)) }>
                        { LocalizeText('furniture.above.stack') }
                    </Button>
                    <Button onClick={ event => SendMessageComposer(new FurnitureStackHeightComposer(objectId, 0)) }>
                        { LocalizeText('furniture.floor.level') }
                    </Button>
                </Column>
            </NitroCardContentView>
        </NitroCardView>
    );
}
