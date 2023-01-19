import { OpenMysteryTrophyMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useState } from 'react';
import { LocalizeText, SendMessageComposer } from '../../../../api';
import { Button, Column, Flex, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../common';

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
    }
    
    if(objectId === -1) return null;

    return (
        <NitroCardView className="nitro-mysterytrophy-dialog no-resize" theme="primary-slim">
            <NitroCardHeaderView center headerText={ LocalizeText('mysterytrophy.header.title') } onCloseClick={ onClose } />
            <NitroCardContentView>
                <Flex className="mysterytrophy-dialog-top p-3">
                    <div className="mysterytrophy-image flex-shrink-0"></div>
                    <div className="m-2">
                        <Text variant="white" className="mysterytrophy-text-big">{ LocalizeText('mysterytrophy.header.description') }</Text>
                    </div>
                </Flex>
                <Flex className="mysterytrophy-dialog-bottom p-2">
                    <Column gap={ 1 }>
                        <Flex alignItems="center" className="bg-white rounded py-1 px-2 input-mysterytrophy-dialog">
                            <textarea className="form-control form-control-sm input-mysterytrophy" value={ description } onChange={ event => setDescription(event.target.value) } />
                            <div className="mysterytrophy-pencil-image flex-shrink-0 small fa-icon"></div>
                        </Flex>
                        <Flex className="mt-2" gap={ 5 } display="flex" justifyContent="center" alignItems="center">
                            <Text pointer className="text-decoration" onClick={ () => onClose() }>{ LocalizeText('cancel') }</Text>
                            <Button variant="success" onClick={ () => onConfirm() }>{ LocalizeText('generic.ok') }</Button>
                        </Flex>
                    </Column>
                </Flex>
            </NitroCardContentView>
        </NitroCardView>
    );
}
