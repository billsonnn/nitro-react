import { FC } from 'react';
import { LocalizeText } from '../../../../../api';
import { Button, Column, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../../common';
import { useRoom } from '../../../../../hooks';

interface EffectBoxConfirmViewProps
{
    objectId: number;
    onClose: () => void;
}

export const EffectBoxConfirmView: FC<EffectBoxConfirmViewProps> = props =>
{
    const { objectId = -1, onClose = null } = props;
    const { roomSession = null } = useRoom();

    const useProduct = () =>
    {
        roomSession.useMultistateItem(objectId);

        onClose();
    };

    return (
        <NitroCardView className="nitro-use-product-confirmation">
            <NitroCardHeaderView headerText={ LocalizeText('effectbox.header.title') } onCloseClick={ onClose } />
            <NitroCardContentView center>
                <div className="flex gap-2">
                    <Column justifyContent="between">
                        <Text>{ LocalizeText('effectbox.header.description') }</Text>
                        <div className="flex items-center justify-between">
                            <Button variant="danger" onClick={ onClose }>{ LocalizeText('generic.cancel') }</Button>
                            <Button variant="success" onClick={ useProduct }>{ LocalizeText('generic.ok') }</Button>
                        </div>
                    </Column>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
};
