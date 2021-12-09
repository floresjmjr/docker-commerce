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
    const res = await fetch('/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const user = await res.json();

    console.log('response from server: ', user);

    const remember = document.getElementsByName("remember")[0].checked;
    if (remember) {
      window.localStorage.setItem("user", JSON.stringify(user));
    } else {
      window.sessionStorage.setItem("user", JSON.stringify(user));
    }

    const get = await fetch('/', {
      method: 'GET',
    });

    console.log('response from server: ', get.url);

    window.location.assign(get.url);
  } catch (err) {
    console.error(err);
  }
};

// form.onsubmit = getUser;