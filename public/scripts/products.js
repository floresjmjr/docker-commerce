document.addEventListener('DOMContentLoaded', () => {
  const Server = {
    // Make custom requests to the server (only PUT and DELETE really)
    // Alternatively you can use the "fetch" API
    makeRequest: function(method, url, data = '') {
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
    // Executes the relevant handlers based on whether the querySelector can find the id, if not then no related handler is executed
    // Registers/Executes the event handlers and waits for events to occur
    registerHandlers: function() {
      // Admin Delete (All Products) Functionality
      const delBtnNodes = document.querySelectorAll('.deleteButton');
      for (el of delBtnNodes) {
        Handler.deleteProduct(el);
      }
    },

    // Delete product event handler function
    deleteProduct: function(node) {
      try {
        node.addEventListener('click', async (e) => {
          const path = `${window.location.href}/${e.target.value}`;

          const server = await Server.makeRequest('DELETE', path);

          if (server.status === 200) {
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
  };

  Handler.registerHandlers();

  // To make a handler for search so that it searches while they type
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
