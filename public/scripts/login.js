// const submitBtn = document.getElementsByTagName("form");

// console.log("btn: ", form);

const getUser = async (e) => {
  e.preventDefault();

  console.log('triggered');

  const email = document.getElementsByName("email")[0].value;
  const password = document.getElementsByName("password")[0].value;


  const data = {email, password};

  console.log('data: ', data);
  try {
    const user = await fetch('/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log('response from server: ', user);

    const get = await fetch('/', {
      method: 'GET',
    });

    console.log('response from server: ', get.url);

    window.location.assign(get.url);
  } catch (err) {
    console.error(err);
  }


}

// form.onsubmit = getUser;