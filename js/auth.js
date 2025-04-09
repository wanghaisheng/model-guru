document.addEventListener('DOMContentLoaded', () => {
    // Get all necessary elements
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');
    const signInForm = document.querySelector('#signin form');
    const registerForm = document.querySelector('#register form');
    const socialButtons = document.querySelectorAll('.btn-social');
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    
    // Tab switching functionality
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and forms
            tabs.forEach(t => t.classList.remove('active'));
            forms.forEach(f => f.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding form
            tab.classList.add('active');
            const formId = tab.getAttribute('data-tab');
            document.getElementById(formId).classList.add('active');
        });
    });

    // Form validation
    if (signInForm) {
        signInForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = signInForm.querySelector('input[type="email"]').value;
            const password = signInForm.querySelector('input[type="password"]').value;
            
            // Basic validation
            if (!email || !password) {
                showError('Please fill in all fields');
                return;
            }
            
            // Here you would typically make an API call to authenticate
            console.log('Sign in attempt:', { email, password });
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = registerForm.querySelector('#name').value;
            const email = registerForm.querySelector('#reg-email').value;
            const password = registerForm.querySelector('#reg-password').value;
            const confirmPassword = registerForm.querySelector('#confirm-password').value;
            const terms = registerForm.querySelector('#terms').checked;
            
            // Basic validation
            if (!name || !email || !password || !confirmPassword) {
                showError('Please fill in all fields');
                return;
            }
            
            if (password !== confirmPassword) {
                showError('Passwords do not match');
                return;
            }
            
            if (!terms) {
                showError('Please agree to the terms and conditions');
                return;
            }
            
            // Here you would typically make an API call to register
            console.log('Register attempt:', { name, email, password });
        });
    }

    // Error handling
    function showError(message) {
        // Create error element if it doesn't exist
        let errorElement = document.querySelector('.auth-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'auth-error';
            document.querySelector('.auth-forms').prepend(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Hide error after 3 seconds
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 3000);
    }

    // Password visibility toggle
    passwordInputs.forEach(input => {
        const toggle = document.createElement('span');
        toggle.className = 'password-toggle';
        toggle.innerHTML = '<i class="fas fa-eye"></i>';
        input.parentNode.appendChild(toggle);
        
        toggle.addEventListener('click', () => {
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            toggle.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
    });

    // Social login buttons
    socialButtons.forEach(button => {
        button.addEventListener('click', () => {
            const provider = button.querySelector('i').classList.contains('fa-google') ? 'Google' : 'GitHub';
            console.log(`Social login attempt with ${provider}`);
            // Here you would typically handle social login
        });
    });
}); 