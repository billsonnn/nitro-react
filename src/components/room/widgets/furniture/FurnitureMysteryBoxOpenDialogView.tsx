import { MysteryBoxWaitingCanceledMessageComposer } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { GetSessionDataManager, LocalizeText, SendMessageComposer } from '../../../../api';
import { Button, NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../common';

interface FurnitureMysteryBoxOpenDialogViewProps
{
    objectId: number;
    ownerId: number;
    onClose: () => void;
}

export const FurnitureMysteryBoxOpenDialogView: FC<FurnitureMysteryBoxOpenDialogViewProps> = props =>
{
    const { onClose = null, objectId = -1, ownerId = -1 } = props;

    const close = () =>
    {
        SendMessageComposer(new MysteryBoxWaitingCanceledMessageComposer(ownerId));
        onClose();
    }

    const isOwner = GetSessionDataManager().userId === ownerId;

    return (
        <NitroCardView className="nitro-mysterybox-dialog" theme="primary-slim">
            <NitroCardHeaderView headerText={ LocalizeText(`mysterybox.dialog.${ isOwner ? 'owner' : 'other' }.title`) } onCloseClick={ close } />
            <NitroCardContentView>
                <h5> { LocalizeText(`mysterybox.dialog.${ isOwner ? 'owner' : 'other' }.subtitle`) } </h5>
                <p> { LocalizeText(`mysterybox.dialog.${ isOwner ? 'owner' : 'other' }.description`) } </p>
                <p> { LocalizeText(`mysterybox.dialog.${ isOwner ? 'owner' : 'other' }.waiting`) }</p>
                <Button variant="danger" onClick={ close }> { LocalizeText(`mysterybox.dialog.${ isOwner ? 'owner' : 'other' }.cancel`) } </Button>
            </NitroCardContentView>
        </NitroCardView>
    );
}
