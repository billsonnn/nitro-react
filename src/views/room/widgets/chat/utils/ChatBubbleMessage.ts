import { INitroPoint } from 'nitro-renderer';

export class ChatBubbleMessage
{
    public static BUBBLE_COUNTER: number = -1;

    public id: number = -1;
    public width: number = 0;
    public height: number = 0;
    public lastTop: number = 0;
    public lastLeft: number = 0;
    public elementRef: HTMLDivElement = null;
    public visible: boolean = false;
    
    constructor(
        public text: string = '',
        public username: string = '',
        public location: INitroPoint = null,
        public type: number = 0,
        public styleId: number = 0,
        public imageUrl: string = null,
        public color: string = null
    ) {
        this.id = ++ChatBubbleMessage.BUBBLE_COUNTER;
    }
}
