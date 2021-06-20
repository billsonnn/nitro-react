import { FC } from 'react';
import { LocalizeText } from '../../../../../../utils/LocalizeText';
import { PetImageView } from '../../../../../pet-image/PetImageView';
import { InfoStandWidgetPetViewProps } from './InfoStandWidgetPetView.types';

export const InfoStandWidgetPetView: FC<InfoStandWidgetPetViewProps> = props =>
{
    const { petData = null, close = null } = props;

    if(!petData) return null;

    return (<>
        <div className="d-flex flex-column bg-dark nitro-card nitro-infostand rounded nitro-infostand-user">
            <div className="container-fluid content-area">
                <div className="d-flex justify-content-between align-items-center">
                    <div>{ petData.name }</div>
                    <i className="fas fa-times cursor-pointer" onClick={ close }></i>
                </div>
                <hr className="m-0 my-1"/>
                <div className="d-flex">
                    <div className="body-image w-100">
                        <PetImageView typeId={ petData.petType } paletteId={ petData.petBreed } direction={ 4 } />
                    </div>
                    <div className="w-100 d-flex flex-column justify-content-center align-items-center">
                        <div className="text-center mb-2">{ LocalizeText('pet.breed.' + petData.petType + '.' + petData.petBreed) }</div>
                        <div className="text-center">{ LocalizeText('pet.level', ['level', 'maxlevel'], [petData.level.toString(), petData.maximumLevel.toString()]) }</div>
                    </div>
                </div>
                <hr className="m-0 my-1"/>
                <div className="text-center mb-1">
                    <div>{ LocalizeText('infostand.pet.text.happiness') }</div>
                    <div className="bg-light-dark rounded p-1 position-relative">
                        <div className="w-100 position-absolute">{ petData.happyness + '/' + petData.maximumHappyness }</div>
                        <div className="bg-info rounded pet-stats" style={{ width: (petData.happyness/petData.maximumHappyness)*100 +'%' }}></div>
                    </div>
                </div>
                <div className="text-center">
                    <div>{ LocalizeText('infostand.pet.text.experience') }</div>
                    <div className="bg-light-dark rounded p-1 position-relative">
                        <div className="w-100 position-absolute">{ petData.experience + '/' + petData.levelExperienceGoal }</div>
                        <div className="bg-purple rounded pet-stats" style={{ width: (petData.experience/petData.levelExperienceGoal)*100 +'%' }}></div>
                    </div>
                </div>
                <div className="text-center">
                    <div>{ LocalizeText('infostand.pet.text.energy') }</div>
                    <div className="bg-light-dark rounded p-1 position-relative">
                        <div className="w-100 position-absolute">{ petData.energy + '/' + petData.maximumEnergy }</div>
                        <div className="bg-success rounded pet-stats" style={{ width: (petData.energy/petData.maximumEnergy)*100 +'%' }}></div>
                    </div>
                </div>
                <hr className="m-0 my-1"/>
                <div className="text-center">{ LocalizeText('infostand.text.petrespect', ['count'], [petData.respect.toString()]) }</div>
                <div className="text-center">{ LocalizeText('pet.age', ['age'], [petData.age.toString()]) }</div>
                <div className="text-center">{ LocalizeText('infostand.text.petowner', ['name'], [petData.ownerName]) }</div>
            </div>
        </div>
    </>);
}
