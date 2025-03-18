document.addEventListener('DOMContentLoaded', () => {
    // Элементы модальных окон
    const registerModal = document.getElementById('register-modal');
    const loginModal = document.getElementById('login-modal');
    const registerBtn = document.getElementById('register-btn');
    const loginBtn = document.getElementById('login-btn');
    const startNowBtn = document.getElementById('start-now-btn');
    const closeBtns = document.querySelectorAll('.close-modal');
    
    // Кнопка "Узнать подробнее" в баннере СВО
    const svoDetailsBtn = document.querySelector('.svo-banner .btn');
    
    // Формы
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    
    // Открытие модальных окон
    registerBtn.addEventListener('click', () => {
        registerModal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Запрет прокрутки страницы
        animateModalOpen(registerModal);
    });
    
    // Обработчик для кнопки "Начать сейчас"
    if (startNowBtn) {
        startNowBtn.addEventListener('click', () => {
            registerModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            animateModalOpen(registerModal);
        });
    }
    
    // Обработчик для кнопки "Узнать подробнее" в баннере СВО
    if (svoDetailsBtn) {
        svoDetailsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            registerModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            animateModalOpen(registerModal);
        });
    }
    
    loginBtn.addEventListener('click', () => {
        loginModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        animateModalOpen(loginModal);
    });
    
    // Закрытие модальных окон
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            closeAllModals();
        });
    });
    
    // Закрытие модального окна при клике вне его содержимого
    window.addEventListener('click', (e) => {
        if (e.target === registerModal || e.target === loginModal) {
            closeAllModals();
        }
    });
    
    // Функция закрытия всех модальных окон
    function closeAllModals() {
        registerModal.style.display = 'none';
        loginModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Разрешение прокрутки страницы
    }
    
    // Анимация открытия модального окна
    function animateModalOpen(modal) {
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.opacity = '0';
        modalContent.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            modalContent.style.opacity = '1';
            modalContent.style.transform = 'translateY(0)';
        }, 10);
    }
    
    // Форматирование номера карты
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            let formattedValue = '';
            
            for (let i = 0; i < value.length; i++) {
                if (i > 0 && i % 4 === 0) {
                    formattedValue += ' ';
                }
                formattedValue += value[i];
            }
            
            e.target.value = formattedValue;
        });
    }
    
    // Форматирование даты истечения срока карты
    const expiryDateInput = document.getElementById('expiryDate');
    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            
            e.target.value = value;
        });
    }
    
    // Форматирование номера карты для формы входа
    const loginCardNumberInput = document.getElementById('login-cardNumber');
    if (loginCardNumberInput) {
        loginCardNumberInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            let formattedValue = '';
            
            for (let i = 0; i < value.length; i++) {
                if (i > 0 && i % 4 === 0) {
                    formattedValue += ' ';
                }
                formattedValue += value[i];
            }
            
            e.target.value = formattedValue;
        });
    }
    
    // Форматирование даты истечения срока карты для формы входа
    const loginExpiryDateInput = document.getElementById('login-expiryDate');
    if (loginExpiryDateInput) {
        loginExpiryDateInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            
            e.target.value = value;
        });
    }
    
    // Функция для проверки номера карты по алгоритму Луна
    function validateCardNumber(cardNumber) {
        // Удаляем все пробелы
        const cleanNumber = cardNumber.replace(/\s/g, '');
        
        // Проверяем, что номер содержит только цифры и имеет правильную длину
        if (!/^\d{13,19}$/.test(cleanNumber)) {
            return false;
        }

        // Алгоритм Луна
        let sum = 0;
        let isEven = false;

        // Проходим по цифрам справа налево
        for (let i = cleanNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cleanNumber[i]);

            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }

            sum += digit;
            isEven = !isEven;
        }

        return sum % 10 === 0;
    }

    // Функция для проверки срока действия карты
    function validateExpiryDate(expiryDate) {
        const [month, year] = expiryDate.split('/');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;
        
        const cardMonth = parseInt(month);
        const cardYear = parseInt(year);

        // Проверяем формат
        if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(expiryDate)) {
            return false;
        }

        // Проверяем срок действия
        if (cardYear < currentYear || (cardYear === currentYear && cardMonth < currentMonth)) {
            return false;
        }

        return true;
    }

    // Функция для проверки CVV
    function validateCVV(cvv) {
        return /^\d{3,4}$/.test(cvv);
    }

    // Функция для форматирования номера карты
    function formatCardNumber(input) {
        let value = input.value.replace(/\D/g, '');
        let formattedValue = '';
        
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }
        
        input.value = formattedValue;
        updateCardDisplay('number', formattedValue);
    }

    // Функция для форматирования срока действия
    function formatExpiryDate(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }
        input.value = value;
        updateCardDisplay('expiry', value);
    }

    // Функция для форматирования имени держателя карты
    function formatCardHolder(input) {
        let value = input.value.toUpperCase();
        input.value = value;
        updateCardDisplay('holder', value);
    }

    // Функция для форматирования CVV
    function formatCVV(input) {
        let value = input.value.replace(/\D/g, '');
        input.value = value;
        updateCardDisplay('cvv', value);
    }

    // Функция для обновления отображения карты
    function updateCardDisplay(field, value) {
        switch(field) {
            case 'number':
                document.getElementById('display-card-number').textContent = value || 'XXXX XXXX XXXX XXXX';
                break;
            case 'holder':
                document.getElementById('display-card-holder').textContent = value || 'IVAN PETROV';
                break;
            case 'expiry':
                document.getElementById('display-card-expiry').textContent = value || 'MM/YY';
                break;
            case 'cvv':
                document.getElementById('display-card-cvv').textContent = value || 'XXX';
                break;
        }
    }

    // Функция для отображения ошибки
    function showError(element, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        // Удаляем предыдущие ошибки
        const existingError = element.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        element.parentElement.appendChild(errorDiv);
        element.classList.add('error');
    }

    // Функция для удаления ошибки
    function removeError(element) {
        const errorDiv = element.parentElement.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
        element.classList.remove('error');
    }

    // Обработчик формы регистрации
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const cardNumber = document.getElementById('cardNumber');
            const expiryDate = document.getElementById('expiryDate');
            const cvv = document.getElementById('cvv');
            
            let isValid = true;
            
            // Проверяем номер карты
            if (!validateCardNumber(cardNumber.value)) {
                showError(cardNumber, 'Неверный номер карты');
                isValid = false;
            } else {
                removeError(cardNumber);
            }
            
            // Проверяем срок действия
            if (!validateExpiryDate(expiryDate.value)) {
                showError(expiryDate, 'Неверный срок действия карты');
                isValid = false;
            } else {
                removeError(expiryDate);
            }
            
            // Проверяем CVV
            if (!validateCVV(cvv.value)) {
                showError(cvv, 'Неверный CVV код');
                isValid = false;
            } else {
                removeError(cvv);
            }
            
            if (isValid) {
                // Здесь можно добавить отправку данных на сервер
                console.log('Данные карты валидны');
            }
        });
    }
    
    // Обработчик формы входа
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const cardNumber = document.getElementById('login-cardNumber');
            const expiryDate = document.getElementById('login-expiryDate');
            const cvv = document.getElementById('login-cvv');
            
            let isValid = true;
            
            // Проверяем номер карты
            if (!validateCardNumber(cardNumber.value)) {
                showError(cardNumber, 'Неверный номер карты');
                isValid = false;
            } else {
                removeError(cardNumber);
            }
            
            // Проверяем срок действия
            if (!validateExpiryDate(expiryDate.value)) {
                showError(expiryDate, 'Неверный срок действия карты');
                isValid = false;
            } else {
                removeError(expiryDate);
            }
            
            // Проверяем CVV
            if (!validateCVV(cvv.value)) {
                showError(cvv, 'Неверный CVV код');
                isValid = false;
            } else {
                removeError(cvv);
            }
            
            if (isValid) {
                // Здесь можно добавить отправку данных на сервер
                console.log('Данные карты валидны');
            }
        });
    }
    
    // Добавляем форматирование при вводе
    document.querySelectorAll('input[name="cardNumber"]').forEach(input => {
        input.addEventListener('input', function() {
            formatCardNumber(this);
        });
    });

    document.querySelectorAll('input[name="expiryDate"]').forEach(input => {
        input.addEventListener('input', function() {
            formatExpiryDate(this);
        });
    });
    
    // Функция отображения уведомлений
    function showNotification(message, type = 'info') {
        // Создание элемента уведомления
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Добавление уведомления на страницу
        document.body.appendChild(notification);
        
        // Анимация появления
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        }, 10);
        
        // Автоматическое скрытие через 3 секунды
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            
            // Удаление элемента после завершения анимации
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Функция обновления UI после входа
    function updateUIAfterLogin(user) {
        // Здесь можно обновить интерфейс для авторизованного пользователя
        // Например, заменить кнопки входа/регистрации на имя пользователя и кнопку выхода
        
        const authButtons = document.querySelector('.auth-buttons');
        if (authButtons) {
            authButtons.innerHTML = `
                <div class="user-info">
                    <span class="user-name">${user ? user.fullName : 'Пользователь'}</span>
                    <button id="logout-btn" class="btn btn-outline">Выход</button>
                </div>
            `;
            
            // Добавление обработчика для кнопки выхода
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', async () => {
                    try {
                        const response = await fetch('/api/logout', {
                            method: 'POST'
                        });
                        
                        const data = await response.json();
                        
                        if (data.success) {
                            // Успешный выход
                            showNotification('Выход выполнен успешно!', 'success');
                            
                            // Восстановление исходного интерфейса
                            authButtons.innerHTML = `
                                <button id="login-btn" class="btn btn-outline">Вход</button>
                                <button id="register-btn" class="btn btn-primary">Регистрация</button>
                            `;
                            
                            // Повторное добавление обработчиков событий
                            const newLoginBtn = document.getElementById('login-btn');
                            const newRegisterBtn = document.getElementById('register-btn');
                            
                            if (newLoginBtn) {
                                newLoginBtn.addEventListener('click', () => {
                                    loginModal.style.display = 'flex';
                                    document.body.style.overflow = 'hidden';
                                    animateModalOpen(loginModal);
                                });
                            }
                            
                            if (newRegisterBtn) {
                                newRegisterBtn.addEventListener('click', () => {
                                    registerModal.style.display = 'flex';
                                    document.body.style.overflow = 'hidden';
                                    animateModalOpen(registerModal);
                                });
                            }
                        } else {
                            showNotification(data.message || 'Ошибка при выходе', 'error');
                        }
                    } catch (error) {
                        console.error('Ошибка:', error);
                        showNotification('Произошла ошибка при выходе', 'error');
                    }
                });
            }
        }
    }
    
    // Проверка авторизации при загрузке страницы
    async function checkAuth() {
        try {
            const response = await fetch('/api/user');
            const data = await response.json();
            
            if (data.success && data.user) {
                updateUIAfterLogin(data.user);
            }
        } catch (error) {
            console.error('Ошибка при проверке авторизации:', error);
        }
    }
    
    // Вызов проверки авторизации
    checkAuth();
    
    // Добавление стилей для уведомлений
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 9999;
            transform: translateX(100%);
            opacity: 0;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .notification.success {
            background-color: #2ecc71;
        }
        
        .notification.error {
            background-color: #e74c3c;
        }
        
        .notification.info {
            background-color: #3498db;
        }
        
        .user-info {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .user-name {
            font-weight: 600;
            color: var(--primary-color);
        }
    `;
    
    document.head.appendChild(notificationStyles);
    
    // Анимация 3D-карты
    const card3d = document.querySelector('.card-3d');
    if (card3d) {
        card3d.addEventListener('mousemove', (e) => {
            const cardRect = card3d.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;
            
            const mouseX = e.clientX - cardCenterX;
            const mouseY = e.clientY - cardCenterY;
            
            const rotateY = mouseX / 10;
            const rotateX = -mouseY / 10;
            
            card3d.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
        });
        
        card3d.addEventListener('mouseleave', () => {
            card3d.style.transform = 'rotateY(0) rotateX(0)';
            card3d.style.transition = 'transform 0.5s ease';
        });
        
        card3d.addEventListener('mouseenter', () => {
            card3d.style.transition = 'transform 0.1s ease';
        });
    }
    
    // Анимация появления элементов при прокрутке
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.feature-card, .hero-content, .hero-image');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('visible');
            }
        });
    };
    
    // Добавление класса для анимации
    const scrollAnimationStyles = document.createElement('style');
    scrollAnimationStyles.textContent = `
        .feature-card, .hero-content, .hero-image {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .feature-card.visible, .hero-content.visible, .hero-image.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .hero-content {
            transition-delay: 0.2s;
        }
        
        .hero-image {
            transition-delay: 0.4s;
        }
        
        .feature-card:nth-child(1) {
            transition-delay: 0.1s;
        }
        
        .feature-card:nth-child(2) {
            transition-delay: 0.2s;
        }
        
        .feature-card:nth-child(3) {
            transition-delay: 0.3s;
        }
        
        .feature-card:nth-child(4) {
            transition-delay: 0.4s;
        }
    `;
    
    document.head.appendChild(scrollAnimationStyles);
    
    // Запуск анимации при загрузке и прокрутке
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
    
    // Управление слайдером отзывов
    const testimonialsSlider = document.querySelector('.testimonials-slider');
    const prevButton = document.querySelector('.testimonial-prev');
    const nextButton = document.querySelector('.testimonial-next');
    
    if (testimonialsSlider && prevButton && nextButton) {
        // Обработчик для кнопки "Предыдущий отзыв"
        prevButton.addEventListener('click', () => {
            const cardWidth = testimonialsSlider.querySelector('.testimonial-card').offsetWidth + 30; // Ширина карточки + отступ
            testimonialsSlider.scrollBy({
                left: -cardWidth,
                behavior: 'smooth'
            });
        });
        
        // Обработчик для кнопки "Следующий отзыв"
        nextButton.addEventListener('click', () => {
            const cardWidth = testimonialsSlider.querySelector('.testimonial-card').offsetWidth + 30; // Ширина карточки + отступ
            testimonialsSlider.scrollBy({
                left: cardWidth,
                behavior: 'smooth'
            });
        });
        
        // Добавление анимации для карточек отзывов при прокрутке
        const animateTestimonials = () => {
            const testimonialCards = document.querySelectorAll('.testimonial-card');
            
            testimonialCards.forEach(card => {
                const cardPosition = card.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (cardPosition < windowHeight - 100) {
                    card.classList.add('visible');
                }
            });
        };
        
        // Обновление стилей для анимации отзывов
        const testimonialAnimationStyles = document.createElement('style');
        testimonialAnimationStyles.textContent = `
            .testimonial-card {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.8s ease, transform 0.8s ease;
            }
            
            .testimonial-card.visible {
                opacity: 1;
                transform: translateY(0);
            }
            
            .testimonial-card:nth-child(1) { transition-delay: 0.1s; }
            .testimonial-card:nth-child(2) { transition-delay: 0.2s; }
            .testimonial-card:nth-child(3) { transition-delay: 0.3s; }
            .testimonial-card:nth-child(4) { transition-delay: 0.4s; }
            .testimonial-card:nth-child(5) { transition-delay: 0.5s; }
            .testimonial-card:nth-child(6) { transition-delay: 0.6s; }
            .testimonial-card:nth-child(7) { transition-delay: 0.7s; }
            .testimonial-card:nth-child(8) { transition-delay: 0.8s; }
            .testimonial-card:nth-child(9) { transition-delay: 0.9s; }
            .testimonial-card:nth-child(10) { transition-delay: 1.0s; }
        `;
        
        document.head.appendChild(testimonialAnimationStyles);
        
        // Запуск анимации отзывов при загрузке и прокрутке
        window.addEventListener('load', animateTestimonials);
        window.addEventListener('scroll', animateTestimonials);
        
        // Автоматическое прокручивание слайдера
        let autoScrollInterval;
        
        const startAutoScroll = () => {
            autoScrollInterval = setInterval(() => {
                const cardWidth = testimonialsSlider.querySelector('.testimonial-card').offsetWidth + 30;
                const scrollPosition = testimonialsSlider.scrollLeft;
                const maxScroll = testimonialsSlider.scrollWidth - testimonialsSlider.clientWidth;
                
                if (scrollPosition >= maxScroll) {
                    // Если достигнут конец, прокручиваем в начало
                    testimonialsSlider.scrollTo({
                        left: 0,
                        behavior: 'smooth'
                    });
                } else {
                    // Прокручиваем к следующей карточке
                    testimonialsSlider.scrollBy({
                        left: cardWidth,
                        behavior: 'smooth'
                    });
                }
            }, 5000); // Интервал автопрокрутки (5 секунд)
        };
        
        const stopAutoScroll = () => {
            clearInterval(autoScrollInterval);
        };
        
        // Запуск автопрокрутки при загрузке страницы
        startAutoScroll();
        
        // Остановка автопрокрутки при наведении мыши
        testimonialsSlider.addEventListener('mouseenter', stopAutoScroll);
        testimonialsSlider.addEventListener('touchstart', stopAutoScroll);
        
        // Возобновление автопрокрутки при уходе мыши
        testimonialsSlider.addEventListener('mouseleave', startAutoScroll);
        testimonialsSlider.addEventListener('touchend', startAutoScroll);
    }
});
