import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PetRespectComposer, PetType } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { AvatarInfoPet, ConvertSeconds, CreateLinkEvent, GetConfiguration, GetSessionDataManager, LocalizeText, SendMessageComposer } from '../../../../../api';
import { Base, Button, Column, Flex, LayoutCounterTimeView, LayoutPetImageView, LayoutRarityLevelView, Text, UserProfileIconView } from '../../../../../common';
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
    const [ remainingGrowTime, setRemainingGrowTime ] = useState(0);
    const [ remainingTimeToLive, setRemainingTimeToLive ] = useState(0);

    if(!avatarInfo) return null;

    useEffect(() =>
    {
        changePetRespect(avatarInfo.respectsPetLeft);
        setRemainingGrowTime(avatarInfo.remainingGrowTime);
        setRemainingTimeToLive(avatarInfo.remainingTimeToLive);

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
        setRemainingGrowTime(avatarInfo.remainingGrowTime);
        setRemainingTimeToLive(avatarInfo.remainingTimeToLive);

    }, [ avatarInfo ]);

    useEffect(() =>
    {
        if (avatarInfo.petType === PetType.MONSTERPLANT && !avatarInfo.dead)
        {
            const interval = setInterval(() =>
            {
                let newRemaingGrowTime = 0;
                let newRemaingLiveTime = 0;

                setRemainingGrowTime(prevValue =>
                {
                    newRemaingGrowTime = (prevValue - 1);

                    return newRemaingGrowTime;
                });

                setRemainingTimeToLive(prevValue =>
                {
                    newRemaingLiveTime = (prevValue - 1);

                    return newRemaingLiveTime;
                });

            }, 1000);

            return () => clearInterval(interval);
        }

    }, [ avatarInfo ]);

    const InfoStandNormalPet = () =>
    {
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
                    <Button variant="dark" onClick={ event => processButtonAction('buyfood') }>
                        { LocalizeText('infostand.button.buyfood') }
                    </Button>
                    { avatarInfo.isOwner &&
                        <Button variant="dark" onClick={ event => processButtonAction('train') }>
                            { LocalizeText('infostand.button.train') }
                        </Button>
                    }
                    { avatarInfo.isOwner &&
                        <Button variant="dark" onClick={ event => processButtonAction('pick_up') }>
                            { LocalizeText('inventory.pets.pickup') }
                        </Button>
                    }
                    { (petRespect > 0) &&
                        <Button variant="dark" onClick={ event => processButtonAction('respect') }>
                            { LocalizeText('infostand.button.petrespect', [ 'count' ], [ petRespect.toString() ]) }
                        </Button>
                    }
                </Flex>
            </Column>
        );
    }

    const InfoStandMonsterplantPet = () =>
    {
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
                                <Column fullWidth overflow="hidden" className="body-image-plant pet p-1">
                                    <LayoutPetImageView figure={ avatarInfo.petFigure } posture={ avatarInfo.posture } direction={ 4 } />
                                </Column>
                                { !avatarInfo.dead &&
                                    <Column grow gap={ 1 }>
                                        <Text variant="white" center small wrap>{ LocalizeText('pet.level', [ 'level', 'maxlevel' ], [ avatarInfo.level.toString(), avatarInfo.maximumLevel.toString() ]) }</Text>
                                    </Column>
                                }
                            </Flex>
                            <hr className="m-0" />
                        </Column>
                        <br /><br />
                        <Column gap={ 1 }>
                            <Column alignItems="center" gap={ 1 }>
                                <Text variant="white" small truncate>{ LocalizeText('infostand.pet.text.wellbeing') }</Text>
                                <Base fullWidth overflow="hidden" position="relative" className="bg-light-dark rounded">
                                    <Flex fit center position="absolute">
                                        <Text variant="white" small>{ avatarInfo.dead ? '00:00:00' : ConvertSeconds((remainingTimeToLive == 0 ? avatarInfo.remainingTimeToLive : remainingTimeToLive)).split(':')[1] + ':' + ConvertSeconds((remainingTimeToLive == null || remainingTimeToLive == undefined ? 0 : remainingTimeToLive)).split(':')[2] + ':' + ConvertSeconds((remainingTimeToLive == null || remainingTimeToLive == undefined ? 0 : remainingTimeToLive)).split(':')[3] }</Text>
                                    </Flex>
                                    <Base className="bg-success rounded pet-stats" style={ { width: avatarInfo.dead ? '0' : Math.round((avatarInfo.maximumTimeToLive * 100) / (remainingTimeToLive)).toString() } } />
                                </Base>
                            </Column>
                            <br /><br />
                            <br /><br />
                            { remainingGrowTime != 0 && remainingGrowTime > 0 &&
                                <Column alignItems="center" gap={ 1 }>
                                    <Text variant="white" small truncate>{ LocalizeText('infostand.pet.text.growth') }</Text> <br />
                                    <LayoutCounterTimeView className="top-2 end-2" day={ ConvertSeconds(remainingGrowTime).split(':')[0] } hour={ ConvertSeconds(remainingGrowTime).split(':')[1] } minutes={ ConvertSeconds(remainingGrowTime).split(':')[2] } seconds={ ConvertSeconds(remainingGrowTime).split(':')[3] } />
                                </Column>
                            }
                            <br /><br />
                            <br /><br />
                            <Column alignItems="center" gap={ 1 }>
                                <Text variant="white" small truncate>{ LocalizeText('Nivel de rareza:') }</Text>
                                <LayoutRarityLevelView className="top-2 end-2" level={ avatarInfo.rarityLevel } />
                            </Column>
                            <br /><br />
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
                    { !avatarInfo.dead && ((avatarInfo.energy / avatarInfo.maximumEnergy) < 0.98) &&
                        <Button variant="dark" onClick={ event => processButtonAction('treat') }>
                            { LocalizeText('infostand.button.pettreat') }
                        </Button>
                    }
                    { roomSession?.isRoomOwner &&
                        <Button variant="dark" onClick={ event => processButtonAction('compost') }>
                            { LocalizeText('infostand.button.compost') }
                        </Button>
                    }
                    { avatarInfo.isOwner &&
                        <Button variant="dark" onClick={ event => processButtonAction('pick_up') }>
                            { LocalizeText('inventory.pets.pickup') }
                        </Button>
                    }
                </Flex>
            </Column>
        );
    }

    return (
        <>
            { avatarInfo.petType !== PetType.MONSTERPLANT &&
                <InfoStandNormalPet />
            }
            { avatarInfo.petType === PetType.MONSTERPLANT &&
                <InfoStandMonsterplantPet />
            }
        </>
    );
}
