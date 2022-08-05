import { IAvatarInfo } from './IAvatarInfo';

export class AvatarInfoPet implements IAvatarInfo
{
    public static PET_INFO: string = 'IPI_PET_INFO';

    public level: number = 0;
    public maximumLevel: number = 0;
    public experience: number = 0;
    public levelExperienceGoal: number = 0;
    public energy: number = 0;
    public maximumEnergy: number = 0;
    public happyness: number = 0;
    public maximumHappyness: number = 0;
    public respectsPetLeft: number = 0;
    public respect: number = 0;
    public age: number = 0;
    public name: string = '';
    public id: number = -1;
    public image: HTMLImageElement = null;
    public petType: number = 0;
    public petBreed: number = 0;
    public petFigure: string = '';
    public posture: string = 'std';
    public isOwner: boolean = false;
    public ownerId: number = -1;
    public ownerName: string = '';
    public canRemovePet: boolean = false;
    public roomIndex: number = 0;
    public unknownRarityLevel: number = 0;
    public saddle: boolean = false;
    public rider: boolean = false;
    public breedable: boolean = false;
    public skillTresholds: number[] = [];
    public publiclyRideable: number = 0;
    public fullyGrown: boolean = false;
    public dead: boolean = false;
    public rarityLevel: number = 0;
    public maximumTimeToLive: number = 0;
    public remainingTimeToLive: number = 0;
    public remainingGrowTime: number = 0;
    public publiclyBreedable: boolean = false;

    constructor(public readonly type: string)
    {}
}
