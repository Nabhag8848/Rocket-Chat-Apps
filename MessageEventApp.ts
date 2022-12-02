import { IAppAccessors, IConfigurationExtend, IEnvironmentRead, IHttp, ILogger, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IMessage, IPostMessageSent, IPreMessageSentPrevent } from '@rocket.chat/apps-engine/definition/messages';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { IRoomRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IAuthData } from '@rocket.chat/apps-engine/definition/oauth2/IOAuth2';
import { createOAuth2Client } from '@rocket.chat/apps-engine/definition/oauth2/OAuth2'
import { JobCommand } from './Commands/Job';

export class MessageEventsApp extends App implements IPreMessageSentPrevent, IPostMessageSent{

    public appLogger: ILogger;

    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
        this.appLogger = this.getLogger();
    }

    public async executePreMessageSentPrevent(message: IMessage, read: IRead, http: IHttp, persistence: IPersistence): Promise<boolean> {
        return false;
    }

    public async executePostMessageSent(message: IMessage, read: IRead, http: IHttp, persistence: IPersistence, modify: IModify): Promise<void> {
        if(message.room.slugifiedName == 'general'){
            return;
        }

        const general = await read.getRoomReader().getByName('general');
        const messageBuilder = modify.getCreator().startMessage({
            text: `@${message.sender.username} said "${message.text}" in #${message.room.displayName}`,
        } as IMessage)

        if (!general) {
            return;
        }

        messageBuilder.setRoom(general);
        await modify.getCreator().finish(messageBuilder);
    }

    // private config = {
    //     alias: 'test',
    //     accessTokenUri: 'https://oauth2.googleapis.com/token',
    //     authUri: 'https://accounts.google.com/o/oauth2/v2/auth',
    //     refreshTokenUri: 'https://oauth2.googleapis.com/token',
    //     revokeTokenUri: 'https://oauth2.googleapis.com/revoke',
    //     callback: this.autorizationCallback.bind(this),
    // };

    protected async extendConfiguration(configuration: IConfigurationExtend, environmentRead: IEnvironmentRead): Promise<void> {
        // try{
        //     await createOAuth2Client(this, this.config).setup(configuration);
        //     await configuration.slashCommands.provideSlashCommand(new AuthCommandCommand(this));
        // }catch(error){
        //     this.getLogger().error('[extendConfiguration] error', error);   
        // }

        configuration.scheduler.registerProcessors([{
            id: 'first',
            processor: async (jobData) => {
                console.log(`[${ Date() }] this is a task`, jobData)
            }
        }])

        const Job:JobCommand = new JobCommand();
        await configuration.slashCommands.provideSlashCommand(Job);
    }
    
    
}