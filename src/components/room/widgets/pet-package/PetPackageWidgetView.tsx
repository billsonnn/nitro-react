import { FC } from 'react';
import { GetConfigurationValue, LocalizeText } from '../../../../api';
import { Button, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../common';
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
                        <div className="flex pet-package-container-top p-3">
                            <div className={ `package-image-${ objectType } flex-shrink-0` }></div>
                            <div className="m-2">
                                <Text className="package-text-big" variant="white">{ objectType === 'gnome_box' ? LocalizeText('widgets.gnomepackage.name.title') : LocalizeText('furni.petpackage') }</Text>
                            </div>
                        </div>
                        <div className="flex pet-package-container-bottom p-2">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center bg-white rounded py-1 px-2 input-pet-package-container">
                                    <input className="min-h-[calc(1.5em+ .5rem+2px)] px-[.5rem] py-[.25rem]  rounded-[.2rem] form-control-sm input-pet-package" maxLength={ GetConfigurationValue('pet.package.name.max.length') } placeholder={ objectType === 'gnome_box' ? LocalizeText('widgets.gnomepackage.name.select') : LocalizeText('widgets.petpackage.name.title') } type="text" value={ petName } onChange={ event => onChangePetName(event.target.value) } />
                                    <div className="package-pencil-image flex-shrink-0 small fa-icon"></div>
                                </div>
                                { (errorResult.length > 0) &&
                                    <div className="invalid-feedback d-block m-0">{ errorResult }</div> }
                                <div className="flex items-center gap-5 justify-center mt-2">
                                    <Text pointer className="text-decoration" onClick={ () => onClose() }>{ LocalizeText('cancel') }</Text>
                                    <Button disabled={ petName.length < 3 } variant={ petName.length < 3 ? 'danger' : 'success' } onClick={ () => onConfirm() }>{ objectType === 'gnome_box' ? LocalizeText('widgets.gnomepackage.name.pick') : LocalizeText('furni.petpackage.confirm') }</Button>
                                </div>
                            </div>
                        </div>
                    </NitroCardContentView>
                </NitroCardView>
            }
        </>
    );
};
