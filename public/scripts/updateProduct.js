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
            reject(request);
          }
        });
      });
    },
  };

  const Handler = {
    //Executes the relevant handlers based on whether the querySelector can find the id, if not then no related handler is executed
    // Registers/Executes the event handlers and waits for events to occur
    registerHandlers: function () {
      // Admin Update Product Functionality
      const updateButton = document.getElementById('updateProductButton');
      Handler.updateProduct(updateButton);
    },

//     validationScript: function(errors){
//     const header = document.querySelector('h2')
//     const errorScript = document.createElement('#errors')
//     header.insertAdjacentElement('afterbegin', errorScript)
//     //  <div class="alert alert-warning alert-dismissible fade show" role="alert">
// //   <strong>Error:</strong> {{this.msg}}
// //   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
// // </div>
//     },

    // Update the product event handler function
    updateProduct: function (node) {
      node.addEventListener('click', async () => {
        try {
          const path = window.location.href;
          const inputNodes = document.querySelectorAll('#productForm input');
          const inputArray = Array.prototype.slice.call(inputNodes);
          const data = {};
          for (el of inputArray) {
            data[el.name] = el.value;
          }
          const selectTag = document.querySelector('#category')
          data['category'] = selectTag.options[selectTag.selectedIndex].value
          console.log('front-end', data)
          data['description'] = document.querySelector('textarea').textContent.trim();
          const serverRequest = await Server.makeRequest('PUT', path, data);
          const parsedData = JSON.parse(serverRequest.response);
          if (parsedData.id) {
            window.location.assign(`http://localhost:3000/products/${parsedData.id}`);
          } else {
            this.validationScript(parsedData)
          }
        } catch (error) {
          console.error(`Error message on the front-end: ${error}`);
        }
      });
    },
  };

  Handler.registerHandlers();
});
