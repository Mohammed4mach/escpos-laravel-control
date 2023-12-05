const { execa }           = require('execa');
const { killPortProcess } = require('kill-port-process');

class EscposServer
{
  static server;
  static program = __dirname + '/../../bin/php/php.exe';
  static artisan = __dirname + '/../../bin/escpos-server/artisan';
  static command = 'serv';
  static portNum = 12354;
  static port    = `--port=${EscposServer.portNum}`;
  static runing  = false;
  static quit    = false;

  static async start(mainWindow) {
    const program = EscposServer.program;
    const artisan = EscposServer.artisan;
    const port    = EscposServer.port;
    const command = EscposServer.command;

    try
    {
      await killPortProcess(EscposServer.portNum);
    }
    catch(error)
    {
      console.log(`No process listening on ${EscposServer.portNum}`);
    }

    try
    {
      EscposServer.server = execa(program, [artisan, command, port]);
      EscposServer.runing = true;
    }
    catch(error)
    {
      mainWindow.webContents.send('server:stop');
    }

    if(!EscposServer.server.failed)
      mainWindow.webContents.send('server:start');

    EscposServer.server.stdout.on('data', (data) => {
      console.log(data.toString())
    });

    EscposServer.server.on('exit', (code, signal) => {
      console.log(`Server exited ${code} - singal ${signal}`);

      if(!EscposServer.quit)
        mainWindow.webContents.send('server:stop');

      EscposServer.runing = false;
    })
  }

  static async stop(mainWindow) {
    // EscposServer.server.kill('SIGQUIT');
    await killPortProcess(EscposServer.portNum);
  }

  static async toggle(mainWindow) {
    if(EscposServer.runing)
    {
      console.log('Stopping the server!');
      EscposServer.stop(mainWindow)
    }
    else
    {
      console.log('Starting the server!');
      EscposServer.start(mainWindow);
    }
  }
}

module.exports = EscposServer;

