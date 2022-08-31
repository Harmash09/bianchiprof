function forms(triggerSelector, nameSelector, telephoneSelector, directionSelector, citySelector, popupSelector) {

    const requestButton = document.querySelector(triggerSelector);
    const message = { //набор сообщений
        success: 'Дякуємо! Чекайте на дзвінок менеджера!',
        failure: 'Что-то пошло не так'
    };

    document.addEventListener('click', (event) => {
        if (!event.target.classList.contains('btn')) {
            clearPopup();
        };
    });

    requestButton.addEventListener('click', (e) => {

        const name = document.querySelector(nameSelector).value;
        const telephone = document.querySelector(telephoneSelector).value;
        const direction = document.querySelector(directionSelector).value;
        const city = document.querySelector(citySelector).value;
        const popup = document.querySelector(popupSelector);

        e.preventDefault();
        clearPopup();

        if (name.trim().length < 2) {
            const textContent = "Занадто коротке Ім'я";
            showPopup(nameSelector, textContent);
            return
        };

        if (telephone.length < 18) {
            const textContent = "Занадто короткий номер телефону";
            showPopup(telephoneSelector, textContent);
            return
        };

        if (!direction) {
            const textContent = "Виберіть один з пунктів списку";
            showPopup(directionSelector, textContent);
            return
        };

        if (!city) {
            const textContent = "Виберіть один з пунктів списку";
            showPopup(citySelector, textContent);
            return
        };

        if (localStorage.getItem('dispatchTime')) {
            const wait = 1000 * 60 * 15 //время ожидания между отправками
            const diff = new Date().getTime() - localStorage.getItem('dispatchTime');
            if (diff < wait) {
                const minute = Math.ceil((wait - diff) / (1000 * 60));
                const textContent = `Спробуйте відправити наступну заявку через ${minute} хвилин`;
                showPopup(popupSelector, textContent);
                return
            };
        }
        sendRequest(name, telephone, direction, city);
    });

    function clearPopup() {
        const popups = document.querySelectorAll('.popuptext');
        popups.forEach(element => {
            element.classList.remove('show');
        });
    }

    function showPopup(trigger, text) {
        const popup = document.querySelector(trigger + 'Popup');
        popup.textContent = text;
        popup.classList.toggle('show');
    }

    const sendRequest = (name, telephone, direction, city) => {
        console.log(name, telephone, direction, city);
        showThanksModal(triggerSelector, message.success);
        localStorage.setItem('dispatchTime', new Date().getTime());
    };

    function closeWindow(id) {
        document.querySelector('body').className = '';
        document.querySelector('body').style.removeProperty("overflow");
        document.querySelector('body').style.removeProperty("padding-right");
        document.querySelector(id).className = 'modal fade';
        document.querySelector(id).style.setProperty('display', 'none');
        document.querySelector('.modal-backdrop').remove();
    };

    function showThanksModal(selector, message) {  //отображаем новое модальное окно пользователю после ввода данных
        if (selector === '.send-request-modal') {
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
        document.querySelector('#validationName').value = '';
        document.querySelector('#validationTelephone').value = '';
        document.querySelector('#validationDirection').value = '';
        document.querySelector('#validationCity').value = '';

        document.querySelector('#validationNameModal').value = '';
        document.querySelector('#validationTelephoneModal').value = '';
        document.querySelector('#validationDirectionModal').value = '';
        document.querySelector('#validationCityModal').value = '';
    };

    function getDynamicInformation(selector) {
        const input = document.querySelector(selector);
        const minLength = (selector === '#validationTelephone' || selector === '#validationTelephoneModal') ? 18 : 2;
        input.addEventListener('input', () => {
            if (input.value.trim().length < minLength) {
                input.style.border = '1px solid red';
            } else {
                input.style.border = null;
            }
        });
    };

    getDynamicInformation('#validationName');
    getDynamicInformation('#validationTelephone');
    getDynamicInformation('#validationNameModal');
    getDynamicInformation('#validationTelephoneModal');

};

export default forms;