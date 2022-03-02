export interface IGroupCustomize
{
    badgeBases: { id: number, images: string[] }[];
    badgeSymbols: { id: number, images: string[] }[];
    badgePartColors: { id: number, color: string }[];
    groupColorsA: { id: number, color: string }[];
    groupColorsB: { id: number, color: string }[];
}
