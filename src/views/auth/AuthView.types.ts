export interface AuthViewProps
{}

export class AuthField
{
    constructor(
        public name: string,
        public label: string,
        public type: string,
        public col: number,
        public value: string = ''
        )
    {}
}
