import { GroupInformationParser } from '@nitrots/nitro-renderer';

export interface GroupInformationViewProps
{
    groupInformation: GroupInformationParser;
    onJoin?: () => void;
    onClose?: () => void;
}
