const { Message } = require('discord.js');

module.exports = {
    name: 'messageCreate',

    async execute(message) {
        //whenever a message is sent in the guild/server, run it through here
        if (message.author.bot) return; //if the msg was sent by a bot, dw bout it
        let msg = message.content; //capture message content
        const regex = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/ig;

        let urls = msg.match(regex);

        if (!urls) return;

        urls.forEach(m => {
            let clean = sanitize(m);
            msg = msg.replace(m, clean); //replace dirty url with clean url
        })
        
        if(msg === message.content) return;
        
        let webhook = await message.channel.fetchWebhooks();
        let number = randomNumber(1, 2);
        webhook = webhook.find(x => x.name === "SURL" + number);

        if (!webhook) {
            webhook = await message.channel.createWebhook({
                name: "SURL" + number,
                avatar: message.author.displayAvatarURL({ dynamic: true })
            });
        }

        await webhook.edit({
            name: message.member.nickname ? message.member.nickname : message.author.displayName,
            avatar: message.author.displayAvatarURL({ dynamic: true })
        })
        
        //const channel = message.client.channels.cache.get(message.channelId); //grab channel to send replacement msg in 
        webhook.send(msg);
        message.delete();

        await webhook.edit({
            name: `SURL` + number,
            avatar: message.client.user.displayAvatarURL({ dynamic: true })
        });

        //functions

        function sanitize(dirtyLink) {
            
            sanilink = "";
            let cleanLink = "";
            let cleanLinkArr = [];
                
            let video = "https://www.youtube.com/watch?v=";
            let shoppin = "https://www.amazon.com/dp/";
            
            switch(true) {
                case dirtyLink.startsWith('https://youtu.be/'):
                    cleanLink = dirtyLink.slice(17,28);
                    sanilink = video + cleanLink;
                    break;
                case dirtyLink.startsWith('https://m.youtube.com/'):
                    cleanLink = dirtyLink.slice(30,41);
                    sanilink = video + cleanLink;
                    break;
                case dirtyLink.startsWith('https://www.youtube.com/'):
                    cleanLink = dirtyLink.slice(32,43);
                    sanilink = video + cleanLink;
                    break;
                case dirtyLink.startsWith('https://www.amazon.com/') && dirtyLink.includes("/dp/"): 
                    cleanLinkArr = dirtyLink.split("/");
                    //set smth false, look for dp; if dp found, switch smth to true; if smth is true, leave loop
                    let dpFound = false;
                    cleanLinkArr.forEach(m => {
                        if(dpFound == true){
                            let splitter = m.split("?");
                            cleanLink = splitter[0];
                            dpFound = false;
                        }
                        if(m === "dp") dpFound = true;
                    })
                    //cleanLink = cleanLinkArr[cleanLinkArr.length - 1]; //second to last value of the array
                    sanilink = shoppin + cleanLink;
                    break;
                default:
                    cleanLinkArr = dirtyLink.split("?");
                    sanilink = cleanLinkArr[0];
                    break;
            }

            return sanilink;
        }

        function randomNumber(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
          } 
    }
}