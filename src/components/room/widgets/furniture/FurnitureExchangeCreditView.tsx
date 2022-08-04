import { FC } from 'react';
import { LocalizeText } from '../../../../api';
import { Base, Button, Column, Flex, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../common';
import { useFurnitureExchangeWidget } from '../../../../hooks';

export const FurnitureExchangeCreditView: FC<{}> = props =>
{
    const { objectId = -1, value = 0, onClose = null, redeem = null } = useFurnitureExchangeWidget();

    if(objectId === -1) return null;

    return (
        <NitroCardView className="nitro-widget-exchange-credit" theme="primary-slim">
            <NitroCardHeaderView headerText={ LocalizeText('catalog.redeem.dialog.title') } onCloseClick={ onClose } />
            <NitroCardContentView center>
                <Flex overflow="hidden" gap={ 2 }>
                    <Column center>
                        <Base className="exchange-image" />
                    </Column>
                    <Column grow justifyContent="between" overflow="hidden">
                        <Column gap={ 1 } overflow="auto">
                            <Text fontWeight="bold">{ LocalizeText('creditfurni.description', [ 'credits' ], [ value.toString() ]) }</Text>
                            <Text>{ LocalizeText('creditfurni.prompt') }</Text>
                        </Column>
                        <Button variant="success" onClick={ redeem }>
                            { LocalizeText('catalog.redeem.dialog.button.exchange') }
                        </Button>
                    </Column>
                </Flex>
            </NitroCardContentView>
        </NitroCardView>
    );
}
