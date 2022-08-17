import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PetRespectComposer, PetType } from '@nitrots/nitro-renderer';
import { FC, useEffect } from 'react';
import { AvatarInfoPet, CreateLinkEvent, GetConfiguration, GetSessionDataManager, LocalizeText, SendMessageComposer } from '../../../../../api';
import { Base, Button, Column, Flex, LayoutPetImageView, Text, UserProfileIconView } from '../../../../../common';
import { usePets, useRoom } from '../../../../../hooks';

interface InfoStandWidgetPetViewProps
{
    avatarInfo: AvatarInfoPet;
    onClose: () => void;
}

export const InfoStandWidgetPetView: FC<InfoStandWidgetPetViewProps> = props =>
{
    const { avatarInfo = null, onClose = null } = props;
    const { roomSession = null } = useRoom();
    const { petRespect, changePetRespect } = usePets();

    if(!avatarInfo) return null;

        useEffect(() =>
    {
        changePetRespect(avatarInfo.respectsPetLeft);

    }, [ avatarInfo ]);

    const processButtonAction = (action: string) =>
    {
        let hideMenu = true;

        if (!action || action == '') return;

        switch (action)
        {
            case 'respect':
                let newRespectsLeftChange = 0;

                changePetRespect(prevValue =>
                {
                    newRespectsLeftChange = (prevValue - 1);

                    return newRespectsLeftChange;
                });

                GetSessionDataManager().givePetRespect(avatarInfo.id);
                if(newRespectsLeftChange > 0) hideMenu = false;
                break;
            case 'buyfood':
                CreateLinkEvent('catalog/open/' + GetConfiguration('catalog.links')['pets.buy_saddle']);
                break;
            case 'train':
                // not coded
                break;
            case 'treat':
                SendMessageComposer(new PetRespectComposer(avatarInfo.id));
                break;
            case 'compost':
                roomSession?.compostPlant(avatarInfo.id);
                break;
            case 'pick_up':
                roomSession?.pickupPet(avatarInfo.id);
                break;
        }

        if(hideMenu) onClose();
    }

    useEffect(() =>
    {
        changePetRespect(avatarInfo.respectsPetLeft);

    }, [ avatarInfo ]);

    return (
        <Column gap={ 1 } alignItems="end">
            <Column className="nitro-infostand rounded">
                <Column overflow="visible" className="container-fluid content-area" gap={ 1 }>
                    <Column gap={ 1 }>
                        <Flex alignItems="center" justifyContent="between" gap={ 1 }>
                            <Text variant="white" small wrap>{ avatarInfo.name }</Text>
                            <FontAwesomeIcon icon="times" className="cursor-pointer" onClick={ onClose } />
                        </Flex>
                        <Text variant="white" small wrap>{ LocalizeText(`pet.breed.${ avatarInfo.petType }.${ avatarInfo.petBreed }`) }</Text>
                        <hr className="m-0" />
                    </Column>
                    <Column gap={ 1 }>
                        <Flex gap={ 1 }>
                            <Column fullWidth overflow="hidden" className="body-image pet p-1">
                                <LayoutPetImageView figure={ avatarInfo.petFigure } posture={ avatarInfo.posture } direction={ 4 } />
                            </Column>
                            <Column grow gap={ 1 }>
                                <Text variant="white" center small wrap>{ LocalizeText('pet.level', [ 'level', 'maxlevel' ], [ avatarInfo.level.toString(), avatarInfo.maximumLevel.toString() ]) }</Text>
                                <Column alignItems="center" gap={ 1 }>
                                    <Text variant="white" small truncate>{ LocalizeText('infostand.pet.text.happiness') }</Text>
                                    <Base fullWidth overflow="hidden" position="relative" className="bg-light-dark rounded">
                                        <Flex fit center position="absolute">
                                            <Text variant="white" small>{ avatarInfo.happyness + '/' + avatarInfo.maximumHappyness }</Text>
                                        </Flex>
                                        <Base className="bg-info rounded pet-stats" style={ { width: (avatarInfo.happyness / avatarInfo.maximumHappyness) * 100 + '%' } } />
                                    </Base>
                                </Column>
                                <Column alignItems="center" gap={ 1 }>
                                    <Text variant="white" small truncate>{ LocalizeText('infostand.pet.text.experience') }</Text>
                                    <Base fullWidth overflow="hidden" position="relative" className="bg-light-dark rounded">
                                        <Flex fit center position="absolute">
                                            <Text variant="white" small>{ avatarInfo.experience + '/' + avatarInfo.levelExperienceGoal }</Text>
                                        </Flex>
                                        <Base className="bg-purple rounded pet-stats" style={ { width: (avatarInfo.experience / avatarInfo.levelExperienceGoal) * 100 + '%' } } />
                                    </Base>
                                </Column>
                                <Column alignItems="center" gap={ 1 }>
                                    <Text variant="white" small truncate>{ LocalizeText('infostand.pet.text.energy') }</Text>
                                    <Base fullWidth overflow="hidden" position="relative" className="bg-light-dark rounded">
                                        <Flex fit center position="absolute">
                                            <Text variant="white" small>{ avatarInfo.energy + '/' + avatarInfo.maximumEnergy }</Text>
                                        </Flex>
                                        <Base className="bg-success rounded pet-stats" style={ { width: (avatarInfo.energy / avatarInfo.maximumEnergy) * 100 + '%' } } />
                                    </Base>
                                </Column>
                            </Column>
                        </Flex>
                        <hr className="m-0" />
                    </Column>
                    <Column gap={ 1 }>
                        { avatarInfo.petType !== PetType.MONSTERPLANT &&
                            <Text variant="white" small wrap>{ LocalizeText('infostand.text.petrespect', [ 'count' ], [ avatarInfo.respect.toString() ]) }</Text>
                        }
                        <Text variant="white" small wrap>{ LocalizeText('pet.age', [ 'age' ], [ avatarInfo.age.toString() ]) }</Text>
                        <hr className="m-0" />
                    </Column>
                    <Column gap={ 1 }>
                        <Flex alignItems="center" gap={ 1 }>
                            <UserProfileIconView userId={ avatarInfo.ownerId } />
                            <Text variant="white" small wrap>
                                { LocalizeText('infostand.text.petowner', [ 'name' ], [ avatarInfo.ownerName ]) }
                            </Text>
                        </Flex>
                    </Column>
                </Column>
            </Column>
            <Flex gap={ 1 } justifyContent="end">
                { avatarInfo.petType !== PetType.MONSTERPLANT &&
                    <Button variant="dark" onClick={ event => processButtonAction('buyfood') }>
                        { LocalizeText('infostand.button.buyfood') }
                    </Button>
                }
                { avatarInfo.isOwner && avatarInfo.petType !== PetType.MONSTERPLANT &&
                    <Button variant="dark" onClick={ event => processButtonAction('train') }>
                        { LocalizeText('infostand.button.train') }
                    </Button>
                }
                { !avatarInfo.dead && ((avatarInfo.energy / avatarInfo.maximumEnergy) < 0.98) && avatarInfo.petType === PetType.MONSTERPLANT &&
                    <Button variant="dark" onClick={ event => processButtonAction('treat') }>
                        { LocalizeText('infostand.button.pettreat') }
                    </Button>
                }
                { roomSession?.isRoomOwner && avatarInfo.petType === PetType.MONSTERPLANT &&
                    <Button variant="dark" onClick={ event => processButtonAction('compost') }>
                        { LocalizeText('infostand.button.compost') }
                    </Button>
                }
                { avatarInfo.isOwner &&
                    <Button variant="dark" onClick={ event => processButtonAction('pick_up') }>
                        { LocalizeText('inventory.pets.pickup') }
                    </Button>
                }
                { (petRespect > 0) && avatarInfo.petType !== PetType.MONSTERPLANT &&
                    <Button variant="dark" onClick={ event => processButtonAction('respect') }>
                        { LocalizeText('infostand.button.petrespect', [ 'count' ], [ petRespect.toString() ]) }
                    </Button>
                }
            </Flex>
        </Column>
    );
}
