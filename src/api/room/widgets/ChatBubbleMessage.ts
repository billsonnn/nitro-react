export class ChatBubbleMessage
{
    public static BUBBLE_COUNTER: number = 0;

    public id: number = -1;
    public width: number = 0;
    public height: number = 0;
    public elementRef: HTMLDivElement = null;
    public skipMovement: boolean = false;

    private _top: number = 0;
    private _left: number = 0;
    
    constructor(
        public senderId: number = -1,
        public senderCategory: number = -1,
        public roomId: number = -1,
        public text: string = '',
        public formattedText: string = '',
        public username: string = '',
        public location: { x: number, y: number } = null,
        public type: number = 0,
        public styleId: number = 0,
        public imageUrl: string = null,
        public color: string = null
    ) 
    {
        this.id = ++ChatBubbleMessage.BUBBLE_COUNTER;
    }

    public get top(): number
    {
        return this._top;
    }

    public set top(value: number)
    {
        this._top = value;

        if(this.elementRef) this.elementRef.style.top = (this._top + 'px');
    }

    public get left(): number
    {
        return this._left;
    }

    public set left(value: number)
    {
        this._left = value;

        if(this.elementRef) this.elementRef.style.left = (this._left + 'px');
    }
}
