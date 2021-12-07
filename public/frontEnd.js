document.addEventListener('DOMContentLoaded', () => {
  //Make custom requests to the server
  function makeRequest(method, url, data = '') {
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
  }

  //Delete eventhandler function
  function deleteProduct(node) {
    try {
      node.addEventListener('click', async (e) => {
        const path = `${window.location.href}/${e.target.value}`;
        console.log(path);
        const server = await makeRequest('DELETE', path);
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
  }

  //Admin Delete (All Products) Functionality
  const delBtnNodes = document.querySelectorAll('.deleteButton');
  if (delBtnNodes.length) {
    for (el of delBtnNodes) {
      deleteProduct(el);
    }
  }

  //Admin Delete (Single Product) Functionlity
  const delBtnNode = document.querySelector('#single-product-delete-button');
  if (delBtnNode) {
    deleteProduct(delBtnNode);
  }

  //Admin Update Product Functionality
  const updateButton = document.getElementById('updateProductButton');
  if (updateButton) {
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
        const serverRequest = await makeRequest('PUT', path, data);
        const parsedData = JSON.parse(serverRequest.response);
        if (parsedData.id) {
          window.location.assign(`http://localhost:3000/products/${parsedData.id}`);
        }
      } catch (error) {
        console.error(`Error message on the front-end: ${error}`);
      }
    });
  }
});
