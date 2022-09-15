function forms() {

    const message = { //набор сообщений
        success: 'Дякуємо! Чекайте на дзвінок менеджера!',
        failure: 'Спробуйте відправити повідомлення через декілька хвилин'
    };

    document.addEventListener('click', (event) => {
        if (!event.target.classList.contains('btn')) {
            clearPopup();
        };
    });

    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', bindPostData);

        async function bindPostData(e) {
            e.preventDefault(); //убираем действия по умолчанию
            clearPopup();

            let prefix = '';
            const data = new FormData(form); //получаем данные
            data.append('mainMail', 'admin@bianchiprof.com'); //почта для теста, в дальнейшем будет отправка пользователю + руководителю
            data.append('copyMail', 'korn.alexey@gmail.com');

            if (data.has('userNameModal')) {//Устанавливаем префикс имени поля для модального окна
                prefix = 'Modal';
            }

            const name = data.get('userName' + prefix);
            const telephone = data.get('telephone' + prefix);
            const direction = data.get('direction' + prefix);
            const city = data.get('city' + prefix);

            if (name.trim().length < 2) {
                const textContent = "Занадто коротке Ім'я";
                showPopup('userName' + prefix, textContent);
                return
            };

            if (telephone.length < 18) {
                const textContent = "Занадто короткий номер телефону";
                showPopup('telephone' + prefix, textContent);
                return
            };

            if (!direction) {
                const textContent = "Виберіть один з пунктів списку";
                showPopup('direction' + prefix, textContent);
                return
            };

            if (!city) {
                const textContent = "Виберіть один з пунктів списку";
                showPopup('city' + prefix, textContent);
                return
            };

            if (localStorage.getItem('dispatchTime')) {
                const wait = 1000 * 60 * 15 //время ожидания между отправками
                const diff = new Date().getTime() - localStorage.getItem('dispatchTime');
                if (diff < wait) {
                    const minute = Math.ceil((wait - diff) / (1000 * 60));
                    const textContent = `Спробуйте відправити наступну заявку через ${minute} хвилин`;
                    showPopup('sendRequest' + prefix, textContent);
                    return
                };
            }

            form.classList.add('sending');
            
            let response = await fetch('sendmail.php', {
                method: 'POST',
                body: data
            });

            if (response.ok) {
                form.classList.remove('sending');
                showThanksModal(prefix, message.success);
                localStorage.setItem('dispatchTime', new Date().getTime());
                resetForm();
                
            } else {
                form.classList.remove('sending');
                showThanksModal(prefix, message.failure);
            };

        };
    });

    function clearPopup() {
        const popups = document.querySelectorAll('.popup');
        popups.forEach(element => {
            element.remove();
        });
    };

    function showPopup(trigger, text) {
        const popup = document.createElement('div');
        const element = document.getElementsByName(trigger);
        popup.className = "popup";
        popup.innerHTML = `<span class="popuptext show">${text}</span>`;

        element[0].before(popup);
    };

    function closeWindow(selector) {
        const modalWindow = document.querySelector(selector);
        const backdrop = document.querySelector('.modal-backdrop');
        const body = document.querySelector('body');
        modalWindow.classList.add('hide');
        modalWindow.classList.remove('show');
        backdrop.className = 'hide';
        body.removeAttribute('style');
    };

    function showThanksModal(prefix, message) {  //отображаем новое модальное окно пользователю после ввода данных
        if (prefix === 'Modal') {
            closeWindow('#Modal');
        }
        document.querySelector('body').className = 'modal-open';
        document.querySelector('body').style.setProperty("overflow", "hidden");
        document.querySelector('body').style.setProperty("padding-right", "17px");

        const fade = document.createElement('div');

        fade.innerHTML = `
            <div class="modal-backdrop fade show">
            `;
        document.querySelector('body').append(fade);
        const thanksModal = document.createElement('div'); //формируем html нового окна

        thanksModal.innerHTML = `
            <div class="modal fade show" id="thanksModal" tabindex="-1" aria-labelledby="exampleThanksModalLabel" aria-modal="true" role="dialog" style="display: block">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <form action="">
                            <h4 class="modal-title" id="exampleThanksModalLabel">${message}</h4>
                        </form>
                    </div>
                </div>
            </div>
        `;
        document.querySelector('body').append(thanksModal);
        setTimeout(() => {
            closeWindow('#thanksModal'); //закрываем модальное окно
            thanksModal.remove();
            resetForm();
        }, 3000);
    };

    function resetForm() {
        const resetForms = document.querySelectorAll('form');
        resetForms.forEach(e => {
            e.reset();
        });
    };

    function getDynamicInformation(selector) {
        const input = document.querySelector(selector);
        const minLength = (selector === '#validationTelephone' || selector === '#validationTelephoneModal') ? 13 : 2;
        input.addEventListener('input', () => {
            if (input.value.trim().length < minLength) {
                input.style.border = '1px solid red';
            } else {
                input.style.border = null;
            }
        });
    };

    try {
        getDynamicInformation('#validationName');
        getDynamicInformation('#validationTelephone');
    } catch {
        ///////
    };

    getDynamicInformation('#validationNameModal');
    getDynamicInformation('#validationTelephoneModal');

};

export default forms;