const fetch = require('node-fetch');

class Printers
{
  static key      = 'MbQnyKKDOk237U8HHcMoouyUxB9lawGeZ35Eh4WjMcI';
  static host     = 'http://localhost:12354';
  static endpoint = {
    index: 'api/printers',
    barcode: 'api/printers/barcode',
    receipt: 'api/printers/receipt'
  };

  static async getPrinters(mainWindow)
  {
    const url         = `${Printers.host}/${Printers.endpoint.index}`;
    const requestInfo = {
      method: 'get',
      headers: {
        'x-localhost': Printers.key
      }
    };

    await fetch(url)
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    });
  }
}

module.exports = Printers;

