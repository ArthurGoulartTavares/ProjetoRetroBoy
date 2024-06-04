// Animação botão mobile
const btnm = document.getElementById('btn-menu');
const menuDiv = document.getElementById('menu-mobile');

menuDiv.addEventListener('click', openmenu);

function openmenu() {
    menuDiv.classList.toggle('open');
    btnm.classList.toggle('active');
}

// Blog 
document.addEventListener('DOMContentLoaded', () => {
    const blogContainer = document.querySelector('.blog');

    blogContainer.addEventListener('click', event => {
        const current = event.target;
        const isReadMoreBtn = current.className.includes('read-more-btn');

        if (!isReadMoreBtn) return;

        const post = current.closest('.blog-post');
        const isExpanded = post.classList.contains('expanded');
        
        if (isExpanded) {
            post.classList.remove('expanded');
            current.textContent = 'Expandir...';
        } else {
            post.classList.add('expanded');
            current.textContent = 'Fechar...';
        }

        const img = post.querySelector('.post-image');
        if (isExpanded) {
            img.classList.remove('expanded');
            img.classList.add('reduced');
        } else {
            img.classList.remove('reduced');
            img.classList.add('expanded');
        }
    });
});


// Formulário
class FormSubmit {
    constructor(settings) {
        this.settings = settings;
        this.form = document.querySelector(settings.form);
        this.formButton = document.querySelector(settings.button);
        this.nextButtons = document.querySelectorAll('[data-next]');
        this.prevButtons = document.querySelectorAll('[data-prev]');
        this.formSteps = document.querySelectorAll('.form-step');
        this.currentStep = 0;

        if (this.form) {
            this.url = this.form.getAttribute("action");
            this.showStep(this.currentStep);
        }

        this.sendForm = this.sendForm.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handlePrev = this.handlePrev.bind(this);
        this.collectFormData = this.collectFormData.bind(this);

        this.formButton.addEventListener("click", this.sendForm);
        this.nextButtons.forEach(button => button.addEventListener("click", this.handleNext));
        this.prevButtons.forEach(button => button.addEventListener("click", this.handlePrev));
    }

    showStep(step) {
        this.formSteps.forEach((stepElem, index) => {
            stepElem.classList.toggle('active', index === step);
        });
    }

    handleNext() {
        const servico = this.form.querySelector('input[name="servico"]:checked');
        if (!servico) return;

        if (this.currentStep === 0) {
            const servicoValue = servico.value;
            if (servicoValue === "Reforma de console") {
                this.currentStep = 1;
            } else if (servicoValue === "Manutenção de console") {
                this.currentStep = 2;
            } else if (servicoValue === "Manutenção de cartucho") {
                this.currentStep = 3;
            }
        } else {
            this.currentStep++;
        }

        this.showStep(this.currentStep);
    }

    handlePrev() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.showStep(this.currentStep);
        }
    }

    collectFormData() {
        const formData = new FormData(this.form);
        const data = {};
        formData.forEach((value, key) => {
            if (data[key]) {
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        });
        console.log(data);
    }

    async sendForm(event) {
        event.preventDefault();
        this.collectFormData();

        const formData = new FormData(this.form);

        try {
            const response = await fetch(this.url, {
                method: this.form.getAttribute("method"),
                body: formData,
                headers: { 'Accept': 'application/json' }
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const json = await response.json();
            console.log('Success:', json);
            this.sendEmail(formData);
            this.form.reset();
            this.showStep(0);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    sendEmail(formData) {
        emailjs.send("service_9q1upvd", "template_dcpss89", formData)
            .then(function(response) {
                console.log('Email enviado com sucesso!', response.status, response.text);
            }, function(error) {
                console.error('Erro ao enviar email:', error);
            });
    }
}

const formSubmit = new FormSubmit({
    form: '[data-form]',
    button: '[data-button]',
});
