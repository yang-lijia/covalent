import {  getRepository } from 'typeorm';
import {Chatgroup} from '../../entity/Chatgroup';
import { ContextMessageUpdate } from 'telegraf';

import { CommandManager, CommandProcessor } from '../command';
import Tools from "../tools";

const Markup = require('telegraf/markup');

/**
 * A class to handle the general help command.
 */
export default class RegisterTalent {

    private commandManager:CommandManager;
    private commandProcessor:CommandProcessor;

    /**
     * Class constructor to set some base variables
     * @param commandManager - The object to manage bots commands.
     * @param commandProcessor - The class to process the commands and parameters.
     */
    constructor(commandManager:CommandManager, commandProcessor:CommandProcessor) {

        this.commandManager = commandManager;
        this.commandProcessor = commandProcessor;

        // Add bot commands.
        this.init();
    }

    /**
     * Initialise the commands.
     */
    init() {
        this.commandManager.add(
            '/start',
            'Start using Covalent',
            'Start using Covalent',
            this.register);
    }

    /**
     * Display survey question for user
     * @param ctx - Telegram bot context.
     */
    register(ctx: ContextMessageUpdate) {
        //Todo: shouldn't be a command but rather a cronjob to display question
        ctx.getChat().then(async function(response){

            let isGroup = response.type === 'group';

            if(isGroup){
                let group = new Chatgroup();
                group.chatgroupId = response.id;
                group.name = response.title;
                try{ await getRepository(Chatgroup).save(group);}catch(Exception){ console.log(Exception); }

                Tools.replyHTML(ctx, 'Welcome on board! Who shall be the administrator for this group? ');

            }else{
                Tools.replyHTML(ctx, 'Oh no, find your buddies & have fun together. :) ');
            }
        })

    }
}/**
 * Created by yanglijia on 4/1/19.
 */
