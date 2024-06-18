import { OpenMysteryTrophyMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useState } from 'react';
import { LocalizeText, SendMessageComposer } from '../../../../api';
import { Button, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../common';

interface FurnitureMysteryTrophyOpenDialogViewProps
{
    objectId: number;
    onClose: () => void;
}

export const FurnitureMysteryTrophyOpenDialogView: FC<FurnitureMysteryTrophyOpenDialogViewProps> = props =>
{
    const { objectId = -1, onClose = null } = props;
    const [ description, setDescription ] = useState<string>('');

    const onConfirm = () =>
    {
        SendMessageComposer(new OpenMysteryTrophyMessageComposer(objectId, description));
        onClose();
    };

    if(objectId === -1) return null;

    return (
        <NitroCardView className="nitro-mysterytrophy-dialog no-resize" theme="primary-slim">
            <NitroCardHeaderView center headerText={ LocalizeText('mysterytrophy.header.title') } onCloseClick={ onClose } />
            <NitroCardContentView>
                <div className="flex mysterytrophy-dialog-top p-3">
                    <div className="mysterytrophy-image flex-shrink-0"></div>
                    <div className="m-2">
                        <Text className="mysterytrophy-text-big" variant="white">{ LocalizeText('mysterytrophy.header.description') }</Text>
                    </div>
                </div>
                <div className="flex mysterytrophy-dialog-bottom p-2">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center bg-white rounded py-1 px-2 input-mysterytrophy-dialog">
                            <textarea className="min-h-[calc(1.5em+ .5rem+2px)] px-[.5rem] py-[.25rem]  rounded-[.2rem] form-control-sm input-mysterytrophy" value={ description } onChange={ event => setDescription(event.target.value) } />
                            <div className="mysterytrophy-pencil-image flex-shrink-0 small fa-icon"></div>
                        </div>
                        <div className="flex items-center mt-2 gap-5 justify-center">
                            <Text pointer className="text-decoration" onClick={ () => onClose() }>{ LocalizeText('cancel') }</Text>
                            <Button variant="success" onClick={ () => onConfirm() }>{ LocalizeText('generic.ok') }</Button>
                        </div>
                    </div>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
};
