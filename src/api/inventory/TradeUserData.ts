import { AdvancedMap } from '@nitrots/nitro-renderer';
import { GroupItem } from './GroupItem';

export class TradeUserData
{
    constructor(
        public userId: number = -1,
        public userName: string = '',
        public userItems: AdvancedMap<string, GroupItem> = null,
        public itemCount: number = 0,
        public creditsCount: number = 0,
        public accepts: boolean = false,
        public canTrade: boolean = false,
        public items: AdvancedMap<string, GroupItem> = new AdvancedMap()) {}
}
