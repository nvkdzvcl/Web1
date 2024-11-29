document.addEventListener('DOMContentLoaded', function() {
    // Retrieve the logged-in user from localStorage
    const user = JSON.parse(localStorage.getItem('loggedInUser'));

    if (!user) {
        // If no logged-in user, redirect to the login page and set a flag in sessionStorage
        if (!sessionStorage.getItem('redirected')) {
            alert('Vui lòng đăng nhập');
            sessionStorage.setItem('redirected', 'true');  // Set the flag to prevent infinite redirects
            window.location.href = 'admin_login.html';  // Redirect to the login page
            return;
        }
    } else {
        // Display user info on the admin page
        document.getElementById('usernameItem').textContent = 'Username: ' + user.username;
        document.getElementById('emailItem').textContent = 'Email: ' + user.email;
    }
});
document.getElementById('logoutLink').addEventListener('click', function (e) {
    e.preventDefault(); // Prevent the default link behavior

    // Clear loggedInUser data from localStorage
    localStorage.removeItem('loggedInUser');
    
    // Optionally, clear any sessionStorage flags if necessary
    sessionStorage.removeItem('redirected'); // Clear redirected flag if you have one

    // Redirect the user to the login page
    window.location.href = 'admin_login.html';  // Redirect to the login page
});