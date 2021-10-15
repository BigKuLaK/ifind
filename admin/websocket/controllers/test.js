const Controller = require('../lib/Controller');

class TestController extends Controller {
  constructor(connection) {
    super(connection);
  }

  onmessage(message) {
    console.log({ message });
  }
}

module.exports = TestController;
