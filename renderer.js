// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const Vue = require('./node_modules/vue/dist/vue')
const remote = require('electron').remote
const fs = require("fs")
const ConfigIniParser = require("config-ini-parser").ConfigIniParser;
const dialog = require('electron').remote.dialog
const opn = require('opn');
var delimiter = "\r\n"; //or "\n" for *nux

var gameSettingsFile = null;
var parser;
let vueApp = new Vue({
  el: '#app',
  data: {
    subtitle: 'Fortnite Stretched Resolution tool',
    w: 0,
    origW: 0,
    h: 0,
    origH: 0,
    origFrl: 60,
    frl: 60,
    credit: "Programmed by BlockFade",
    active: true,
    success: true,
    message: "Enjoy!"
  },
  mounted: function() {
    gameSettingsFile = fs.readFileSync(process.env.LOCALAPPDATA + '/FortniteGame/Saved/Config/WindowsClient/GameUserSettings.ini', 'utf-8').toString();
    this.parse();
  },
  methods: {
    launch: function()
    {
      opn('com.epicgames.launcher://apps/Fortnite?action=launch');
      this.close();
    },
    error: function()
    {
      this.success = false;
    },
    apply: function () {
    this.frl = Math.round(this.frl);
      parser.set("/Script/FortniteGame.FortGameUserSettings", "ResolutionSizeX", this.w);
      parser.set("/Script/FortniteGame.FortGameUserSettings", "ResolutionSizeY", this.h);
        parser.set("/Script/FortniteGame.FortGameUserSettings", "LastUserConfirmedResolutionSizeX", this.w);
        parser.set("/Script/FortniteGame.FortGameUserSettings", "LastUserConfirmedResolutionSizeY", this.h);
          parser.set("/Script/FortniteGame.FortGameUserSettings", "DesiredScreenWidth", this.w);
          parser.set("/Script/FortniteGame.FortGameUserSettings", "DesiredScreenHeight", this.h);
            parser.set("/Script/FortniteGame.FortGameUserSettings", "LastUserConfirmedDesiredScreenWidth", this.w);
            parser.set("/Script/FortniteGame.FortGameUserSettings", "LastUserConfirmedDesiredScreenHeight", this.h);
            parser.set("/Script/FortniteGame.FortGameUserSettings", "FrameRateLimit", this.frl);
      console.log("Saved?");
      fs.writeFile(process.env.LOCALAPPDATA + '/FortniteGame/Saved/Config/WindowsClient/GameUserSettings.ini', parser.stringify(delimiter), function(err) {
    if(err) {
      vueApp.error();
        return console.log(err);
    }
    else
    {
      vueApp.success = true;
    }

});
this.active = false;
    },
    close: function ()
    {
      remote.getCurrentWindow().close();
    },
    parse: function()
    {
      parser = new ConfigIniParser(delimiter);
      parser.parse(gameSettingsFile);
      this.w = parser.getNumber("/Script/FortniteGame.FortGameUserSettings", "ResolutionSizeX");
      this.origW = this.w;
      this.h = parser.getNumber("/Script/FortniteGame.FortGameUserSettings", "ResolutionSizeY");
      this.origH = this.h;
      this.frl = parser.getNumber("/Script/FortniteGame.FortGameUserSettings", "FrameRateLimit");
      this.frl = Math.round(this.frl);
      this.origFrl = this.frl;
    }
  } // end of methods
})
