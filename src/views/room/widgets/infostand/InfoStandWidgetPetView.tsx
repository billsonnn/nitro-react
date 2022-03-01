import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';
import { LocalizeText, RoomWidgetUpdateInfostandPetEvent } from '../../../../api';
import { Base, Column, Flex, Text } from '../../../../common';
import { UserProfileIconView } from '../../../../layout';
import { PetImageView } from '../../../shared/pet-image/PetImageView';

interface InfoStandWidgetPetViewProps
{
    petData: RoomWidgetUpdateInfostandPetEvent;
    close: () => void;
}

export const InfoStandWidgetPetView: FC<InfoStandWidgetPetViewProps> = props =>
{
    const { petData = null, close = null } = props;

    if(!petData) return null;

    return (
        <Column className="nitro-infostand rounded">
            <Column overflow="visible" className="container-fluid content-area" gap={ 1 }>
                <Column gap={ 1 }>
                    <Flex alignItems="center" justifyContent="between" gap={ 1 }>
                        <Text variant="white" small wrap>{ petData.name }</Text>
                        <FontAwesomeIcon icon="times" className="cursor-pointer" onClick={ close } />
                    </Flex>
                    <Text variant="white" small wrap>{ LocalizeText(`pet.breed.${ petData.petType }.${ petData.petBreed }`) }</Text>
                    <hr className="m-0" />
                </Column>
                <Column gap={ 1 }>
                    <Flex gap={ 1 }>
                        <Column fullWidth overflow="hidden" className="body-image pet p-1">
                            <PetImageView figure={ petData.petFigure } posture={ petData.posture } direction={ 4 } />
                        </Column>
                        <Column grow gap={ 1 }>
                            <Text variant="white" center small wrap>{ LocalizeText('pet.level', [ 'level', 'maxlevel' ], [ petData.level.toString(), petData.maximumLevel.toString() ]) }</Text>
                            <Column alignItems="center" gap={ 1 }>
                                <Text variant="white" small truncate>{ LocalizeText('infostand.pet.text.happiness') }</Text>
                                <Base fullWidth overflow="hidden" position="relative" className="bg-light-dark rounded">
                                    <Flex fit center position="absolute">
                                        <Text variant="white" small>{ petData.happyness + '/' + petData.maximumHappyness }</Text>
                                    </Flex>
                                    <Base className="bg-info rounded pet-stats" style={{ width: (petData.happyness / petData.maximumHappyness) * 100 + '%' }} />
                                </Base>
                            </Column>
                            <Column alignItems="center" gap={ 1 }>
                                <Text variant="white" small truncate>{ LocalizeText('infostand.pet.text.experience') }</Text>
                                <Base fullWidth overflow="hidden" position="relative" className="bg-light-dark rounded">
                                    <Flex fit center position="absolute">
                                        <Text variant="white" small>{ petData.experience + '/' + petData.levelExperienceGoal }</Text>
                                    </Flex>
                                    <Base className="bg-purple rounded pet-stats" style={{ width: (petData.experience / petData.levelExperienceGoal) * 100 + '%' }} />
                                </Base>
                            </Column>
                            <Column alignItems="center" gap={ 1 }>
                                <Text variant="white" small truncate>{ LocalizeText('infostand.pet.text.energy') }</Text>
                                <Base fullWidth overflow="hidden" position="relative" className="bg-light-dark rounded">
                                    <Flex fit center position="absolute">
                                        <Text variant="white" small>{ petData.energy + '/' + petData.maximumEnergy }</Text>
                                    </Flex>
                                    <Base className="bg-success rounded pet-stats" style={{ width: (petData.energy / petData.maximumEnergy) * 100 + '%' }} />
                                </Base>
                            </Column>
                        </Column>
                    </Flex>
                    <hr className="m-0" />
                </Column>
                <Column gap={ 1 }>
                    <Text variant="white" small wrap>{ LocalizeText('infostand.text.petrespect', [ 'count' ], [ petData.respect.toString() ]) }</Text>
                    <Text variant="white" small wrap>{ LocalizeText('pet.age', [ 'age' ], [ petData.age.toString() ]) }</Text>
                    <hr className="m-0" />
                </Column>
                <Column gap={ 1 }>
                    <Flex alignItems="center" gap={ 1 }>
                        <UserProfileIconView userId={ petData.ownerId } />
                        <Text variant="white" small wrap>
                            { LocalizeText('infostand.text.petowner', [ 'name' ], [ petData.ownerName ]) }
                        </Text>
                    </Flex>
                </Column>
            </Column>
        </Column>
    );
}
