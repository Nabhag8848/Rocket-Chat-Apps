import {
    IHttp,
    IMessageBuilder,
    IModify,
    IModifyCreator,
    IPersistence,
    IRead
  } from '@rocket.chat/apps-engine/definition/accessors'
  import {
    ISlashCommand,
    SlashCommandContext
  } from '@rocket.chat/apps-engine/definition/slashcommands'

export class JobCommand implements ISlashCommand {
    public command = "job";
    public i18nDescription = "Schedule the Job";
    public providesPreview = false;
    public i18nParamsExample = "";
​
    public async executor(
        context: SlashCommandContext,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persis: IPersistence
    ): Promise<void> {

        // SCHEDULING A RECURRING TASK

         const task = {
             id: 'first',
             interval: '10 seconds',
             data: { test: true },
         };

         await modify.getScheduler().scheduleRecurring(task);

        //SCHEDULING ONETIME TASK
        const task1 = {
        id: 'first',
        when: '8 seconds',
        };
        
        await modify.getScheduler().scheduleOnce(task1);

        //  Cancelling a Job with Id
        // const jobId = 'first';
        // await modify.getScheduler().cancelJob(jobId);

        // await modify.getScheduler().cancelAllJobs();

    }
}