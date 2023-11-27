// reset-password.js
function resetPassword() {
  const email = document.getElementById('resetEmail').value;
  const password = document.getElementById('resetPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const token = document.getElementById('resetToken').value;

  // Validate the password and confirm password
  if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
  }

  // Make a POST request to the server to reset the password
  const data = {
      email: email,
      password: password,
      token: token
  };

  fetch('http://localhost:3000/reset-password', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(result => {
      if (result.success) {
          alert("Password reset successful");
          // Redirect to the login page or any other desired page
          window.location.href = "./login.html";
      } else {
          alert("Password reset failed. Please check your email and token.");
      }
  });
}
