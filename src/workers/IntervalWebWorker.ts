export default () =>
{
    let interval: ReturnType<typeof setInterval> = null;


    self.onmessage = (message: MessageEvent) =>
    {
        if(!message) return;

        const data: { [index: string]: any } = message.data;

        switch(data.action)
        {
            case 'START':
                interval = setInterval(() => postMessage(null), data.content);
                break;
            case 'STOP':
                if(interval)
                {
                    clearInterval(interval);
                    interval = null;
                }
                break;
        }
    };
};
