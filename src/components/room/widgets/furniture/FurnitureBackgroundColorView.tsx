import { FC } from 'react';
import { ColorUtils, LocalizeText } from '../../../../api';
import { Button, NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../common';
import { useFurnitureBackgroundColorWidget } from '../../../../hooks';

export const FurnitureBackgroundColorView: FC<{}> = props =>
{
    const { objectId = -1, color = 0, setColor = null, applyToner = null, toggleToner = null, onClose = null } = useFurnitureBackgroundColorWidget();

    if(objectId === -1) return null;

    return (
        <NitroCardView className="nitro-room-widget-toner" theme="primary-slim">
            <NitroCardHeaderView headerText={ LocalizeText('widget.backgroundcolor.title') } onCloseClick={ onClose } />
            <NitroCardContentView justifyContent="between" overflow="hidden">
                <div className="flex flex-col gap-1 overflow-auto">
                    <input className="min-h-[calc(1.5em+ .5rem+2px)] px-[.5rem] py-[.25rem]  rounded-[.2rem]" type="color" value={ ColorUtils.makeColorNumberHex(color) } onChange={ event => setColor(ColorUtils.convertFromHex(event.target.value)) } />
                </div>
                <div className="flex flex-col gap-1">
                    <Button fullWidth variant="primary" onClick={ toggleToner }>
                        { LocalizeText('widget.backgroundcolor.button.on') }
                    </Button>
                    <Button fullWidth variant="primary" onClick={ applyToner }>
                        { LocalizeText('widget.backgroundcolor.button.apply') }
                    </Button>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
};
