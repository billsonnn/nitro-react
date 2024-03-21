import { FC } from 'react';
import { Button } from 'react-bootstrap';
import { GetConfigurationValue, LocalizeText } from '../../../../api';
import { Base, Column, Flex, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../common';
import { usePetPackageWidget } from '../../../../hooks';

export const PetPackageWidgetView: FC<{}> = props =>
{
    const { isVisible = false, errorResult = null, petName = null, objectType = null, onChangePetName = null, onConfirm = null, onClose = null } = usePetPackageWidget();

    return (
        <>
            { isVisible &&
                <NitroCardView className="nitro-pet-package no-resize" theme="primary-slim">
                    <NitroCardHeaderView center headerText={ objectType === 'gnome_box' ? LocalizeText('widgets.gnomepackage.name.title') : LocalizeText('furni.petpackage.open') } onCloseClick={ () => onClose() } />
                    <NitroCardContentView>
                        <Flex className="pet-package-container-top p-3">
                            <div className={ `package-image-${ objectType } flex-shrink-0` }></div>
                            <div className="m-2">
                                <Text variant="white" className="package-text-big">{ objectType === 'gnome_box' ? LocalizeText('widgets.gnomepackage.name.title') : LocalizeText('furni.petpackage') }</Text>
                            </div>
                        </Flex>
                        <Flex className="pet-package-container-bottom p-2">
                            <Column gap={ 1 }>
                                <Flex alignItems="center" className="bg-white rounded py-1 px-2 input-pet-package-container">
                                    <input type="text" className="form-control form-control-sm input-pet-package" maxLength={ GetConfigurationValue('pet.package.name.max.length') } placeholder={ objectType === 'gnome_box' ? LocalizeText('widgets.gnomepackage.name.select') : LocalizeText('widgets.petpackage.name.title') } value={ petName } onChange={ event => onChangePetName(event.target.value) } />
                                    <div className="package-pencil-image flex-shrink-0 small fa-icon"></div>
                                </Flex>
                                { (errorResult.length > 0) &&
                                        <Base className="invalid-feedback d-block m-0">{ errorResult }</Base> }
                                <Flex className="mt-2" gap={ 5 } display="flex" justifyContent="center" alignItems="center">
                                    <Text pointer className="text-decoration" onClick={ () => onClose() }>{ LocalizeText('cancel') }</Text>
                                    <Button variant={ petName.length < 3 ? 'danger' : 'success' } disabled={ petName.length < 3 } onClick={ () => onConfirm() }>{ objectType === 'gnome_box' ? LocalizeText('widgets.gnomepackage.name.pick') : LocalizeText('furni.petpackage.confirm') }</Button>
                                </Flex>
                            </Column>
                        </Flex>
                    </NitroCardContentView>
                </NitroCardView>
            }
        </>
    );
}
