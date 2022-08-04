import { FC } from 'react';
import { LocalizeText } from '../../../../../api';
import { Button, Column, Flex, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../../common';
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
    }
    
    return (
        <NitroCardView className="nitro-use-product-confirmation">
            <NitroCardHeaderView headerText={ LocalizeText('effectbox.header.title') } onCloseClick={ onClose } />
            <NitroCardContentView center>
                <Flex gap={ 2 }>
                    <Column justifyContent="between">
                        <Text>{ LocalizeText('effectbox.header.description') }</Text>
                        <Flex alignItems="center" justifyContent="between">
                            <Button variant="danger" onClick={ onClose }>{ LocalizeText('generic.cancel') }</Button>
                            <Button variant="success" onClick={ useProduct }>{ LocalizeText('generic.ok') }</Button>
                        </Flex>
                    </Column>
                </Flex>
            </NitroCardContentView>
        </NitroCardView>
    );
}
