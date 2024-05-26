class User {
    constructor(username, password) {
      this.username = username;
      this.password = password;
    }
  }

  const registerForm = document.getElementById('registerForm');
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirmPassword').value;
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (username.length < 3 || password.length < 8) {
      alert('Username must be at least 3 characters and password must be at least 8 characters');
      return;
    }
    const user = new User(username, password);
    const users = JSON.parse(localStorage.getItem('users')) || [];
    console.log(users);
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
      window.location.href = "../login.html";
  });
