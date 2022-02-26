import { FC } from 'react';
import { LocalizeText } from '../../../../../api';
import { Button, Column, Flex, Text } from '../../../../../common';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../../layout';
import { useRoomContext } from '../../../context/RoomContext';

interface EffectBoxConfirmViewProps
{
    objectId: number;
    close: () => void;
}

export const EffectBoxConfirmView: FC<EffectBoxConfirmViewProps> = props =>
{
    const { objectId = -1, close = null } = props;
    const { roomSession = null } = useRoomContext();

    const useProduct = () =>
    {
        roomSession.useMultistateItem(objectId);

        close();
    }
    
    return (
        <NitroCardView className="nitro-use-product-confirmation">
            <NitroCardHeaderView headerText={ LocalizeText('effectbox.header.title') } onCloseClick={ close } />
            <NitroCardContentView center>
                <Flex gap={ 2 }>
                    <Column justifyContent="between">
                        <Text>{ LocalizeText('effectbox.header.description') }</Text>
                        <Flex alignItems="center" justifyContent="between">
                            <Button variant="danger" onClick={ close }>{ LocalizeText('generic.cancel') }</Button>
                            <Button variant="success" onClick={ useProduct }>{ LocalizeText('generic.ok') }</Button>
                        </Flex>
                    </Column>
                </Flex>
            </NitroCardContentView>
        </NitroCardView>
    );
}
