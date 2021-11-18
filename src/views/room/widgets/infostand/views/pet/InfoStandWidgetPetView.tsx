import { FC } from 'react';
import { LocalizeText } from '../../../../../../api';
import { UserProfileIconView } from '../../../../../../layout';
import { PetImageView } from '../../../../../shared/pet-image/PetImageView';
import { InfoStandBaseView } from '../base/InfoStandBaseView';
import { InfoStandWidgetPetViewProps } from './InfoStandWidgetPetView.types';

export const InfoStandWidgetPetView: FC<InfoStandWidgetPetViewProps> = props =>
{
    const { petData = null, close = null } = props;

    if(!petData) return null;

    return (
        <InfoStandBaseView headerText={ <>{ petData.name }<br />{ LocalizeText('pet.breed.' + petData.petType + '.' + petData.petBreed) }</> } onCloseClick={ close }>
            <div className="d-flex">
                <div className="body-image pet w-100">
                    <PetImageView figure={ petData.petFigure } posture={ petData.posture } direction={ 4 } />
                </div>
                <div className="w-100 d-flex flex-column align-items-center">
                    <div className="small text-center mb-1">{ LocalizeText('pet.level', ['level', 'maxlevel'], [petData.level.toString(), petData.maximumLevel.toString()]) }</div>
                    <div className="text-center mb-1 w-100">
                        <div className="small text-wrap mb-1">{ LocalizeText('infostand.pet.text.happiness') }</div>
                        <div className="bg-light-dark rounded position-relative overflow-hidden">
                            <div className="d-flex justify-content-center align-items-center w-100 h-100 position-absolute small top-0">{ petData.happyness + '/' + petData.maximumHappyness }</div>
                            <div className="bg-info rounded pet-stats" style={{ width: (petData.happyness / petData.maximumHappyness) * 100 + '%' }} />
                        </div>
                    </div>
                    <div className="text-center mb-1 w-100">
                        <div className="small text-wrap mb-1">{ LocalizeText('infostand.pet.text.experience') }</div>
                        <div className="bg-light-dark rounded position-relative overflow-hidden">
                            <div className="d-flex justify-content-center align-items-center w-100 h-100 position-absolute small top-0">{ petData.experience + '/' + petData.levelExperienceGoal }</div>
                            <div className="small bg-purple rounded pet-stats" style={{ width: ((petData.experience / petData.levelExperienceGoal) * 100 + '%') }} />
                        </div>
                    </div>
                    <div className="text-center w-100">
                        <div className="small text-wrap mb-1">{ LocalizeText('infostand.pet.text.energy') }</div>
                        <div className="bg-light-dark rounded position-relative overflow-hidden">
                            <div className="d-flex justify-content-center align-items-center w-100 h-100 position-absolute small top-0">{ petData.energy + '/' + petData.maximumEnergy }</div>
                            <div className="small bg-success rounded pet-stats" style={{ width: (petData.energy/petData.maximumEnergy)*100 +'%' }}></div>
                        </div>
                    </div>
                </div>
            </div>
            <hr className="m-0 my-1" />
            <div className="small text-wrap">{ LocalizeText('infostand.text.petrespect', ['count'], [petData.respect.toString()]) }</div>
            <div className="small text-wrap">{ LocalizeText('pet.age', ['age'], [petData.age.toString()]) }</div>
            <hr className="m-0 my-1" />
            <div className="d-flex align-items-center">
                <UserProfileIconView userId={ petData.ownerId } />
                <div className="small text-wrap">{ LocalizeText('infostand.text.petowner', ['name'], [petData.ownerName]) }</div>
            </div>
        </InfoStandBaseView>
    );
}
