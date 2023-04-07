import { FC } from 'react';
import { CreateLinkEvent, FigureData, LocalizeText } from '../../../../api';
import { Button, Column, Flex, NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../common';
import { useFurnitureFootballGateWidget } from '../../../../hooks';

export const FurnitureFootballGateView: FC<{}> = props =>
{
    const { objectId, setObjectId, onClose } = useFurnitureFootballGateWidget();

    const onGender = (gender: string) =>
    {
        CreateLinkEvent(`avatar-editor/show/${ gender }/${ objectId }`);
        setObjectId(-1);
    }
      
    if(objectId === -1) return null;

    return (
        <NitroCardView className="nitro-football-gate no-resize" theme="primary-slim">
            <NitroCardHeaderView headerText={ LocalizeText('widget.furni.clothingchange.gender.title') } onCloseClick={ onClose } />
            <NitroCardContentView className="football-gate-content">
                <Flex fullWidth center>
                    <Column>{ LocalizeText('widget.furni.clothingchange.gender.info') }</Column>
                </Flex>
                <Flex className="mt-4 px-2" justifyContent="between">
                    <Button className="size-buttons" onClick={ (e) => onGender(FigureData.MALE) }>
                        { LocalizeText('widget.furni.clothingchange.gender.male') }
                    </Button>
                    <Button className="size-buttons" onClick={ (e) => onGender(FigureData.FEMALE) }>
                        { LocalizeText('widget.furni.clothingchange.gender.female') }
                    </Button>
                </Flex>
            </NitroCardContentView>
        </NitroCardView>
    );
}
