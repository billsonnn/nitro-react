import { FC } from 'react';
import { ColorUtils, LocalizeText } from '../../../../api';
import { Button, Column, NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../common';
import { useFurnitureBackgroundColorWidget } from '../../../../hooks';

export const FurnitureBackgroundColorView: FC<{}> = props =>
{
    const { objectId = -1, color = 0, setColor = null, applyToner = null, toggleToner = null, onClose = null } = useFurnitureBackgroundColorWidget();

    if(objectId === -1) return null;

    return (
        <NitroCardView theme="primary-slim" className="nitro-room-widget-toner">
            <NitroCardHeaderView headerText={ LocalizeText('widget.backgroundcolor.title') } onCloseClick={ onClose } />
            <NitroCardContentView overflow="hidden" justifyContent="between">
                <Column overflow="auto" gap={ 1 }>
                    <input type="color" className="form-control" value={ ColorUtils.makeColorNumberHex(color) } onChange={ event => setColor(ColorUtils.convertFromHex(event.target.value)) } />
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
