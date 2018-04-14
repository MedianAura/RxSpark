const {app, BrowserWindow} = require("electron");
const {ArgumentParser} = require("argparse");

if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit();
}

let parser = new ArgumentParser({
    version: require("../package").version,
    addHelp: true,
    description: require("../package").description,
    prog: require("../package").name
});

parser.addArgument(
    ['-d', '--debug'],
    {help: 'Active le mode debug.', defaultValue: false, action: "storeTrue", required : false}
);

if (process.argv.join(" ").indexOf("electron") > -1) {
    process.argv.splice(0, 2);
}
let result = parser.parseKnownArgs(process.argv);
let args = result[0];

let mainWindow;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
    });

    global.args = args;
    mainWindow.loadURL(`file://${__dirname}/index.html`);

    if (args.debug) {
        mainWindow.webContents.openDevTools({mode: 'detach'});
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});