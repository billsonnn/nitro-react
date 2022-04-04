export class WorkerBuilder extends Worker
{
    constructor(worker)
    {
        const code = worker.toString();
        const blob = new Blob([ `(${ code })()` ]);

        super(URL.createObjectURL(blob));
    }
}
