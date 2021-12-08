document.addEventListener('DOMContentLoaded', () => {
  const Server = {
    // Make custom requests to the server (only PUT and DELETE really)
    // Alternatively you can use the "fetch" API
    makeRequest: function (method, url, data = '') {
      const request = new XMLHttpRequest();
      request.open(method, url);
      request.setRequestHeader('Content-type', 'application/json');
      if (data) {
        const requestData = JSON.stringify(data);
        request.send(requestData);
      } else {
        request.send();
      }
      return new Promise((resolve, reject) => {
        request.addEventListener('load', () => {
          if (request.status === 200) {
            resolve(request);
          } else {
            reject(false);
          }
        });
      });
    },
  };

  const Handler = {
    //Executes the relevant handlers based on whether the querySelector can find the id, if not then no related handler is executed
    // Registers/Executes the event handlers and waits for events to occur
    registerHandlers: function () {
      // cart remove item functionality
      const remBtnNodes = document.querySelectorAll('.cartRemove');
      for (el of remBtnNodes) {
        Handler.removeItemFromCart(el);
      }
    },

    // Remove item from cart event handler function
    removeItemFromCart: function (node) {
      try {
        node.addEventListener('click', async (e) => {
          console.log('CLICK ME HEHE');
          const path = `${window.location.href}/${e.target.value}`;
          console.log(path);
          const server = await Server.makeRequest('DELETE', path);
          console.log('response1', server.status);
          if (server.status === 200) {
            console.log('status 200 in event');

            const productNode = e.target.parentNode.parentNode.parentNode.parentNode;
            productNode.remove();
          }
        });
      } catch (error) {
        console.error(`Error message on the front-end: ${error}`);
      }
    },
  };

  Handler.registerHandlers();
});
