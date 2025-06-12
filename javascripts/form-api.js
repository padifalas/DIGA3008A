class ContactForm {
    constructor(options = {}) {
        this.config = {
           
            apiEndpoint: options.apiEndpoint || 'https://formspree.io/f/xldnbjqo', //this is my endpoint id
            timeout: options.timeout || 10000,
            enableAnalytics: options.enableAnalytics || false,
            ...options
        };
        
        this.isSubmitting = false;
        this.form = null;
        this.overlay = null;
        this.hasInitialFocus = false; 
        
        this.init();
    }
    
    init() {
        this.overlay = document.getElementById('contactOverlay');
        this.form = document.getElementById('contactForm');
        
        if (!this.overlay || !this.form) {
            console.error('Contact form elements not found.');
            return;
        }
        
        this.bindEvents();
        this.setupAccessibility();
    }
    
    bindEvents() {
        const trigger = document.getElementById('contactTrigger');
        const closeBtn = document.getElementById('contactClose');
        
        if (!trigger || !closeBtn) {
            console.error('Contact form trigger or close button not found.');
            return;
        }
        
        trigger.addEventListener('click', () => this.openForm());
        closeBtn.addEventListener('click', () => this.closeForm());
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) this.closeForm();
        });
        
        //  async form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        this.setupValidation();
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.overlay.classList.contains('active')) {
                this.closeForm();
            }
        });
    }
    
    setupAccessibility() {
        //   focus on  name input when the the thing form over;ay opens 
      
        this.overlay.addEventListener('transitionend', (e) => {
            //  handle the overlay own , not child elements
            if (e.target === this.overlay && 
                this.overlay.classList.contains('active') && 
                !this.hasInitialFocus) {
                
                const firstInput = this.form.querySelector('input');
                if (firstInput) {
                    //  delay to ensure the trans is done first
                    setTimeout(() => {
                        firstInput.focus();
                        this.hasInitialFocus = true;
                    }, 50);
                }
            }
        });
    }
    
    setupValidation() {
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = `${field.previousElementSibling.textContent.replace(' *', '')} is required`;
        }
        
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        
        this.showFieldError(field, isValid, errorMessage);
        return isValid;
    }
    
    showFieldError(field, isValid, message) {
        field.style.borderColor = isValid ? '#e0e0e0' : '#dc3545';
        
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) existingError.remove();
        
        if (!isValid) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.style.cssText = 'color: #dc3545; font-size: 0.8rem; margin-top: 0.25rem;';
            errorDiv.textContent = message;
            field.parentNode.appendChild(errorDiv);
        }
    }
    
    clearFieldError(field) {
        field.style.borderColor = '#e0e0e0';
        const error = field.parentNode.querySelector('.field-error');
        if (error) error.remove();
    }
    
    validateForm() {
        const requiredFields = this.form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    // calls api
    async handleSubmit(e) {
        e.preventDefault();
        
        if (this.isSubmitting) return;
        
        if (!this.validateForm()) {
            this.showMessage('Please fix the errors above', 'error');
            return;
        }
        
        this.isSubmitting = true;
        this.showSubmitLoading(true);
        
        try {
            const formData = new FormData(this.form);
            const response = await this.submitToAPI(formData); 
            
            if (response.success) {
                this.showMessage('Thanks for reaching out! I\'ll get back to you soon.', 'success');
                this.form.reset();
                
                if (this.config.enableAnalytics) {
                    this.trackEvent('contact_form_success');
                }
                
                setTimeout(() => this.closeForm(), 3000);
            } else {
                throw new Error(response.message || 'Submission failed');
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
     
            let errorMessage;
            if (error.name === 'AbortError') {
                errorMessage = 'Request timed out. Please try again.';
            } else if (error.message.includes('network')) {
                errorMessage = 'Network error. Please check your connection and try again.';
            } else {
                errorMessage = error.message || 'Something went wrong. Please try again.';
            }
            
            this.showMessage(errorMessage, 'error');
            
            if (this.config.enableAnalytics) {
                this.trackEvent('contact_form_error', { error: error.message });
            }
        } finally {
            this.isSubmitting = false;
            this.showSubmitLoading(false);
        }
    }
    

    async submitToAPI(formData) {
     
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
        
        try {
            const response = await fetch(this.config.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                body: formData, 
                signal: controller.signal 
            });
            
            clearTimeout(timeoutId);
            
          
            if (response.ok) {
                // m using formspree which will returns JSON on success
                try {
                    const responseData = await response.json();
                    return { success: true, data: responseData };
                } catch {
                    return { success: true };
                }
            } else {
               
                let errorMessage;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorData.message || `HTTP ${response.status}`;
                } catch {
                    errorMessage = `HTTP ${response.status}: ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }
            
        } catch (error) {
            clearTimeout(timeoutId);
            
      
            if (error.name === 'AbortError') {
                throw new Error('Request timed out');
            } else if (error instanceof TypeError) {
                throw new Error('Network error - please check your connection');
            } else {
                throw error; 
            }
        }
    }
    
    showSubmitLoading(isLoading) {
        const button = document.getElementById('submitButton');
        const text = button.querySelector('.submit-text');
        
        if (isLoading) {
            button.disabled = true;
            text.style.display = 'none';
            button.insertAdjacentHTML('beforeend', '<div class="submit-spinner"></div>');
        } else {
            button.disabled = false;
            text.style.display = 'inline';
            const spinner = button.querySelector('.submit-spinner');
            if (spinner) spinner.remove();
        }
    }
    
    showMessage(message, type) {
        const messageEl = document.getElementById('formMessage');
        messageEl.textContent = message;
        messageEl.className = `form-message ${type}`;
        messageEl.style.display = 'block';
        
        if (type === 'error') {
            setTimeout(() => {
                messageEl.style.display = 'none';
            }, 7000);
        }
    }
    
    openForm() {
        this.hasInitialFocus = false; // reset focus flag when opening
        this.overlay.classList.add('active');
        this.overlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        if (this.config.enableAnalytics) {
            this.trackEvent('contact_form_opened');
        }
    }
    
    closeForm() {
        this.overlay.classList.remove('active');
        this.overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        this.hasInitialFocus = false;
        
        const messageEl = document.getElementById('formMessage');
        messageEl.style.display = 'none';
        
        if (this.isSubmitting) {
            this.isSubmitting = false;
            this.showSubmitLoading(false);
        }
    }
    
    trackEvent(eventName, data = {}) {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, data);
        }
        
        if (window.analytics && typeof window.analytics.track === 'function') {
            window.analytics.track(eventName, data);
        }
    }
    
    destroy() {
        const trigger = document.getElementById('contactTrigger');
        const overlay = document.getElementById('contactOverlay');
        
        trigger?.remove();
        overlay?.remove();
    }
    
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
}


document.addEventListener('DOMContentLoaded', () => {
    window.contactForm = new ContactForm({
        apiEndpoint: 'https://formspree.io/f/xldnbjqo', //  endpoint
        enableAnalytics: false,
        timeout: 15000
    });
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContactForm;
}