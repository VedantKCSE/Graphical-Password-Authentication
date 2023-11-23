const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');
let uppass = [];
let inpass = [];
let input = "0";

signUpButton.addEventListener('click', () => {
    container.classList.add('right-panel-active');
});

signInButton.addEventListener('click', () => {
    container.classList.remove('right-panel-active');
});

const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

function upimg(element) {
    var Image = element.querySelector('img');
    if (Image) {
        if (Image.classList.contains('clicked')) {
            Image.classList.remove('clicked');
            uppass.splice(uppass.indexOf(element.id), 1);
        }
        else {
            Image.classList.add('clicked');
            uppass.push(element.id);
        }
    }
}

function inimg(element) {
    var Image = element.querySelector('img');
    if (Image) {
        if (Image.classList.contains('clicked')) {
            Image.classList.remove('clicked');
            inpass.splice(inpass.indexOf(element.id), 1);
        }
        else {
            Image.classList.add('clicked');
            inpass.push(element.id);
        }
    }
    inpass.toString();
}

function signup() {
    const emailInput = document.getElementById('upmail').value;
    
    if (!emailRegex.test(emailInput)) {
        alert("Invalid email address");
        return;
    }
    
    const data = {
      email: emailInput,
      password: uppass.toString()
  };

  fetch('http://localhost:3000/signup', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(result => {
      if (result.success) {
          var myText = "Account Created Successfully";
          alert(myText);
      } else {
          alert("Error while signing up");
      }
  });
}

var v2 = new Boolean(false);

function signin() {
    const emailInput = document.getElementById('inmail').value;

    if (!emailRegex.test(emailInput)) {
        alert("Invalid email address");
        return;
    }

     fetch('http://localhost:3000/signin', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: emailInput, password: inpass.toString() })
  })
  .then(response => response.json())
  .then(result => {
      if (result.success) {
          var myText = "Login is successful";
          alert(myText);
          NewTab();
      } else {
          var myText = "Login Failed";
          alert(myText);
      }
  });
}

function NewTab() {
    window.open("./done.html");
}
