//This script loads on every page that is rendered because it is included in "main.handlbars" which is rendered at each page
//This event handler waits until all the html code has been included in the DOM before performing any action
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
      // Admin Delete (All Products) Functionality
      if (window.location.pathname === '/products') {
        const delBtnNodes = document.querySelectorAll('.deleteButton');
        for (el of delBtnNodes) {
          Handler.deleteProduct(el);
        }
      }

      // Admin Delete (Single Product) Functionlity
      const delBtnNode = document.querySelector('#single-product-delete-button');
      if (delBtnNode) {
        Handler.deleteProduct(delBtnNode);
      }

      // cart remove item functionality
      const remBtnNodes = document.querySelectorAll('.cartRemove');
      if (remBtnNodes.length) {
        for (el of remBtnNodes) {
          Handler.removeItemFromCart(el);
        }
      }

      // Admin Update Product Functionality
      const updateButton = document.getElementById('updateProductButton');
      if (updateButton) {
        Handler.updateButton();
      }
    },

    // Delete product event handler function
    deleteProduct: function (node) {
      try {
        node.addEventListener('click', async (e) => {
          const path = `${window.location.href}/${e.target.value}`;
          console.log(path);
          const server = await Server.makeRequest('DELETE', path);
          console.log('response1', server.status);
          if (server.status === 200) {
            console.log('status 200 in event');
            if (window.location.pathname === '/products') {
              const productNode = e.target.parentNode.parentNode;
              productNode.remove();
            } else {
              window.location.assign('http://localhost:3000/products');
            }
          }
        });
      } catch (error) {
        console.error(`Error message on the front-end: ${error}`);
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

    // Update the product event handler function
    updateProduct: function () {
      updateButton.addEventListener('click', async () => {
        try {
          const path = window.location.href;
          const inputNodes = document.querySelectorAll('#productForm input');
          const inputArray = Array.prototype.slice.call(inputNodes);
          const data = {};
          for (el of inputArray) {
            data[el.name] = el.value;
          }
          data['description'] = document.querySelector('textarea').textContent.trim();
          const serverRequest = await Server.makeRequest('PUT', path, data);
          const parsedData = JSON.parse(serverRequest.response);
          if (parsedData.id) {
            window.location.assign(`http://localhost:3000/products/${parsedData.id}`);
          }
        } catch (error) {
          console.error(`Error message on the front-end: ${error}`);
        }
      });
    },
  };

  Handler.registerHandlers();

  //To make a handler for search so that it searches while they type
  // const search = document.querySelector('#search')
  // if(search){
  //   search.addEventListener('input', (e)=>{
  //     console.log(e.target.value)
  //     console.log(title)
  //     const template = `
  //       <script id='productsTemplate' type='text/x-handlebars-template'>
  //         {{#each products}}
  //           <li class='productContainer'>
  //             <a href='/products/{{id}}'>
  //               <div class='productPictureContainer'>
  //                 <img src='{{image}}' />
  //               </div>
  //               <p>{{title}}</p>
  //             </a>
  //             <div class='priceContainer'>
  //               <button class='deleteButton' value='{{id}}'>Delete</button>
  //               <p>{{price}}</p>
  //             </div>
  //           </li>
  //         {{/each}}
  //       </script>`
  //   })
  // }
});
