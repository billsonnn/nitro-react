export class AvatarInfoName
{
    constructor(
        public readonly roomIndex: number,
        public readonly category: number,
        public readonly id: number,
        public readonly name: string,
        public readonly userType: number,
        public readonly isFriend: boolean = false)
    {}
}
