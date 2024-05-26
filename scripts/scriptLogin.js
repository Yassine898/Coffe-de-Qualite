const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const users = JSON.parse(localStorage.getItem('users'));
  if (!users) {
    alert('No users registered. Please register first.');
    window.location.href = 'register.html';
    return;
  }
  const userFound = users.find((user) => user.username === username && user.password === password);
  if (!userFound) {
    alert('Invalid username or password');
  } else {
        localStorage.setItem('currentUser', JSON.stringify(userFound));
        window.location.href="index.html";
  }
});