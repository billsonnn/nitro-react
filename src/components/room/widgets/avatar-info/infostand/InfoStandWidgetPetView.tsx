import { CreateLinkEvent, PetRespectComposer, PetType } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { AvatarInfoPet, ConvertSeconds, GetConfigurationValue, LocalizeText, SendMessageComposer } from '../../../../../api';
import { Button, Column, Flex, LayoutCounterTimeView, LayoutPetImageView, LayoutRarityLevelView, Text, UserProfileIconView } from '../../../../../common';
import { useRoom, useSessionInfo } from '../../../../../hooks';

interface InfoStandWidgetPetViewProps
{
    avatarInfo: AvatarInfoPet;
    onClose: () => void;
}

export const InfoStandWidgetPetView: FC<InfoStandWidgetPetViewProps> = props =>
{
    const { avatarInfo = null, onClose = null } = props;
    const [ remainingGrowTime, setRemainingGrowTime ] = useState(0);
    const [ remainingTimeToLive, setRemainingTimeToLive ] = useState(0);
    const { roomSession = null } = useRoom();
    const { petRespectRemaining = 0, respectPet = null } = useSessionInfo();

    useEffect(() =>
    {
        setRemainingGrowTime(avatarInfo.remainingGrowTime);
        setRemainingTimeToLive(avatarInfo.remainingTimeToLive);
    }, [ avatarInfo ]);

    useEffect(() =>
    {
        if((avatarInfo.petType !== PetType.MONSTERPLANT) || avatarInfo.dead) return;

        const interval = setInterval(() =>
        {
            setRemainingGrowTime(prevValue => (prevValue - 1));
            setRemainingTimeToLive(prevValue => (prevValue - 1));
        }, 1000);

        return () => clearInterval(interval);
    }, [ avatarInfo ]);

    if(!avatarInfo) return null;

    const processButtonAction = (action: string) =>
    {
        let hideMenu = true;

        if(!action || action == '') return;

        switch(action)
        {
            case 'respect':
                respectPet(avatarInfo.id);

                if((petRespectRemaining - 1) >= 1) hideMenu = false;
                break;
            case 'buyfood':
                CreateLinkEvent('catalog/open/' + GetConfigurationValue('catalog.links')['pets.buy_food']);
                break;
            case 'train':
                roomSession?.requestPetCommands(avatarInfo.id);
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
    };

    return (
        <Column alignItems="end" gap={ 1 }>
            <Column className="nitro-infostand rounded">
                <Column className="container-fluid content-area" gap={ 1 } overflow="visible">
                    <div className="flex flex-col gap-1">
                        <Flex alignItems="center" gap={ 1 } justifyContent="between">
                            <Text small wrap variant="white">{ avatarInfo.name }</Text>
                            <FaTimes className="cursor-pointer fa-icon" onClick={ onClose } />
                        </Flex>
                        <Text small wrap variant="white">{ LocalizeText(`pet.breed.${ avatarInfo.petType }.${ avatarInfo.petBreed }`) }</Text>
                        <hr className="m-0" />
                    </div>
                    { (avatarInfo.petType === PetType.MONSTERPLANT) &&
                        <>
                            <Column center gap={ 1 }>
                                <LayoutPetImageView direction={ 4 } figure={ avatarInfo.petFigure } posture={ avatarInfo.posture } />
                                <hr className="m-0" />
                            </Column>
                            <div className="flex flex-col gap-2">
                                { !avatarInfo.dead &&
                                    <Column alignItems="center" gap={ 1 }>
                                        <Text center small wrap variant="white">{ LocalizeText('pet.level', [ 'level', 'maxlevel' ], [ avatarInfo.level.toString(), avatarInfo.maximumLevel.toString() ]) }</Text>
                                    </Column> }
                                <Column alignItems="center" gap={ 1 }>
                                    <Text small truncate variant="white">{ LocalizeText('infostand.pet.text.wellbeing') }</Text>
                                    <div className="bg-light-dark rounded relative overflow-hidden w-full">
                                        <div className="flex justify-center items-center size-full absolute">
                                            <Text small variant="white">{ avatarInfo.dead ? '00:00:00' : ConvertSeconds((remainingTimeToLive == 0 ? avatarInfo.remainingTimeToLive : remainingTimeToLive)).split(':')[1] + ':' + ConvertSeconds((remainingTimeToLive == null || remainingTimeToLive == undefined ? 0 : remainingTimeToLive)).split(':')[2] + ':' + ConvertSeconds((remainingTimeToLive == null || remainingTimeToLive == undefined ? 0 : remainingTimeToLive)).split(':')[3] }</Text>
                                        </div>
                                        <div className="bg-success rounded pet-stats" style={ { width: avatarInfo.dead ? '0' : Math.round((avatarInfo.maximumTimeToLive * 100) / (remainingTimeToLive)).toString() } } />
                                    </div>
                                </Column>
                                { remainingGrowTime != 0 && remainingGrowTime > 0 &&
                                    <Column alignItems="center" gap={ 1 }>
                                        <Text small truncate variant="white">{ LocalizeText('infostand.pet.text.growth') }</Text>
                                        <LayoutCounterTimeView className="top-2 end-2" day={ ConvertSeconds(remainingGrowTime).split(':')[0] } hour={ ConvertSeconds(remainingGrowTime).split(':')[1] } minutes={ ConvertSeconds(remainingGrowTime).split(':')[2] } seconds={ ConvertSeconds(remainingGrowTime).split(':')[3] } />
                                    </Column> }
                                <Column alignItems="center" gap={ 1 }>
                                    <Text small truncate variant="white">{ LocalizeText('infostand.pet.text.raritylevel', [ 'level' ], [ LocalizeText(`infostand.pet.raritylevel.${ avatarInfo.rarityLevel }`) ]) }</Text>
                                    <LayoutRarityLevelView className="top-2 end-2" level={ avatarInfo.rarityLevel } />
                                </Column>
                                <hr className="m-0" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Text small wrap variant="white">{ LocalizeText('pet.age', [ 'age' ], [ avatarInfo.age.toString() ]) }</Text>
                                <hr className="m-0" />
                            </div>
                        </> }
                    { (avatarInfo.petType !== PetType.MONSTERPLANT) &&
                        <>
                            <div className="flex flex-col gap-1">
                                <div className="flex gap-1">
                                    <Column fullWidth className="body-image pet p-1" overflow="hidden">
                                        <LayoutPetImageView direction={ 4 } figure={ avatarInfo.petFigure } posture={ avatarInfo.posture } />
                                    </Column>
                                    <Column grow gap={ 1 }>
                                        <Text center small wrap variant="white">{ LocalizeText('pet.level', [ 'level', 'maxlevel' ], [ avatarInfo.level.toString(), avatarInfo.maximumLevel.toString() ]) }</Text>
                                        <Column alignItems="center" gap={ 1 }>
                                            <Text small truncate variant="white">{ LocalizeText('infostand.pet.text.happiness') }</Text>
                                            <div className="bg-light-dark rounded relative overflow-hidden w-full">
                                                <div className="flex justify-center items-center size-full absolute">
                                                    <Text small variant="white">{ avatarInfo.happyness + '/' + avatarInfo.maximumHappyness }</Text>
                                                </div>
                                                <div className="bg-info rounded pet-stats" style={ { width: (avatarInfo.happyness / avatarInfo.maximumHappyness) * 100 + '%' } } />
                                            </div>
                                        </Column>
                                        <Column alignItems="center" gap={ 1 }>
                                            <Text small truncate variant="white">{ LocalizeText('infostand.pet.text.experience') }</Text>
                                            <div className="bg-light-dark rounded relative overflow-hidden w-full">
                                                <div className="flex justify-center items-center size-full absolute">
                                                    <Text small variant="white">{ avatarInfo.experience + '/' + avatarInfo.levelExperienceGoal }</Text>
                                                </div>
                                                <div className="bg-purple rounded pet-stats" style={ { width: (avatarInfo.experience / avatarInfo.levelExperienceGoal) * 100 + '%' } } />
                                            </div>
                                        </Column>
                                        <Column alignItems="center" gap={ 1 }>
                                            <Text small truncate variant="white">{ LocalizeText('infostand.pet.text.energy') }</Text>
                                            <div className="bg-light-dark rounded relative overflow-hidden w-full">
                                                <div className="flex justify-center items-center size-full absolute">
                                                    <Text small variant="white">{ avatarInfo.energy + '/' + avatarInfo.maximumEnergy }</Text>
                                                </div>
                                                <div className="bg-success rounded pet-stats" style={ { width: (avatarInfo.energy / avatarInfo.maximumEnergy) * 100 + '%' } } />
                                            </div>
                                        </Column>
                                    </Column>
                                </div>
                                <hr className="m-0" />
                            </div>
                            <div className="flex flex-col gap-1">
                                { (avatarInfo.petType !== PetType.MONSTERPLANT) &&
                                    <Text small wrap variant="white">{ LocalizeText('infostand.text.petrespect', [ 'count' ], [ avatarInfo.respect.toString() ]) }</Text> }
                                <Text small wrap variant="white">{ LocalizeText('pet.age', [ 'age' ], [ avatarInfo.age.toString() ]) }</Text>
                                <hr className="m-0" />
                            </div>
                        </> }
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                            <UserProfileIconView userId={ avatarInfo.ownerId } />
                            <Text small wrap variant="white">
                                { LocalizeText('infostand.text.petowner', [ 'name' ], [ avatarInfo.ownerName ]) }
                            </Text>
                        </div>
                    </div>
                </Column>
            </Column>
            <Flex gap={ 1 } justifyContent="end">
                { (avatarInfo.petType !== PetType.MONSTERPLANT) &&
                    <Button variant="dark" onClick={ event => processButtonAction('buyfood') }>
                        { LocalizeText('infostand.button.buyfood') }
                    </Button> }
                { avatarInfo.isOwner && (avatarInfo.petType !== PetType.MONSTERPLANT) &&
                    <Button variant="dark" onClick={ event => processButtonAction('train') }>
                        { LocalizeText('infostand.button.train') }
                    </Button> }
                { !avatarInfo.dead && ((avatarInfo.energy / avatarInfo.maximumEnergy) < 0.98) && (avatarInfo.petType === PetType.MONSTERPLANT) &&
                    <Button variant="dark" onClick={ event => processButtonAction('treat') }>
                        { LocalizeText('infostand.button.pettreat') }
                    </Button> }
                { roomSession?.isRoomOwner && (avatarInfo.petType === PetType.MONSTERPLANT) &&
                    <Button variant="dark" onClick={ event => processButtonAction('compost') }>
                        { LocalizeText('infostand.button.compost') }
                    </Button> }
                { avatarInfo.isOwner &&
                    <Button variant="dark" onClick={ event => processButtonAction('pick_up') }>
                        { LocalizeText('inventory.pets.pickup') }
                    </Button> }
                { (petRespectRemaining > 0) && (avatarInfo.petType !== PetType.MONSTERPLANT) &&
                    <Button variant="dark" onClick={ event => processButtonAction('respect') }>
                        { LocalizeText('infostand.button.petrespect', [ 'count' ], [ petRespectRemaining.toString() ]) }
                    </Button> }
            </Flex>
        </Column>
    );
};
