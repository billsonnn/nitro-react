import { NitroLayoutBaseProps } from '../../../../layout/base';

export interface ObjectLocationViewProps extends NitroLayoutBaseProps
{
    objectId: number;
    category: number;
    noFollow?: boolean;
}
