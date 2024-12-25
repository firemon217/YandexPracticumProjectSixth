import initialCards from "./cards.js"
import '../pages/index.css';

window.onload = () =>
{
    //Инициализация переменных элементов
    const placesList = document.querySelector(".places__list")
    const cardTemplate = document.querySelector("#card-template")
    const profilePopup = document.querySelector(".popup_type_edit")
    const cardPopup = document.querySelector(".popup_type_new-card")
    const imagePopup = document.querySelector(".popup_type_image")

    //Инициализация форм
    const forms = Array.from(document.forms)
    const inputList = forms.map(elem => {return Array.from(elem.querySelectorAll(".popup__input"))}).flat()


    //Добавление классов активности
    profilePopup.classList.add("popup_is-animated")
    cardPopup.classList.add("popup_is-animated")
    imagePopup.classList.add("popup_is-animated")

    //Проверка на валидность поля
    function isValid(elem)
    {
        const input = elem.target
        const form = input.closest("form")
        if(!input.validity.valid)
        {
            showInputError(input, form)
        }
        else
        {
            hideInputError(input, form)
        }
    }

    const hasInvalidInput = (inputList) => {
        return inputList.some((inputElement) => {
          return !inputElement.validity.valid;
        })
    };

    const toggleButtonState = (inputList, buttonElement) => {
        if (!hasInvalidInput(inputList)) 
        {
            buttonElement.classList.add('popup__button_active');
        } 
        else 
        {
            buttonElement.classList.remove('popup__button_active');
        }
    };

    //Вывод ошибки поля
    function showInputError(input, form)
    {
        const formError = document.querySelector(`.error-${input.id}`)
        const buttonForm = form.querySelector(".popup__button")
        formError.textContent = input.validationMessage
        input.classList.add("popup__input_error")
        formError.classList.add('popup__error-message_active');
        toggleButtonState(Array.from(form.querySelectorAll("input")), buttonForm)
    }

    //Сокрытие ошибки ввода
    function hideInputError(input, form)
    {
        const formError = document.querySelector(`.error-${input.id}`)
        const buttonForm = form.querySelector(".popup__button")
        input.classList.remove("popup__input_error")
        formError.classList.remove('popup__error-message_active');
        toggleButtonState(Array.from(form.querySelectorAll("input")), buttonForm)
    }

    //Функция для создания карточки из шаблона
    function createCard(name, link) {
        const cardCopy = cardTemplate.cloneNode(true).content
        cardCopy.querySelector(".card__image").src = link
        cardCopy.querySelector(".card__title").textContent = name
        cardCopy.querySelector(".card__delete-button").addEventListener("click", event => {
            event.target.closest(".card-block").remove()
        })
        cardCopy.querySelector(".card__like-button").addEventListener("click", event => {
            event.target.classList.toggle("card__like-button_is-active")
        })
        cardCopy.querySelector(".card__image").addEventListener("click", event => {
            openModal(imagePopup)
            imagePopup.querySelector(".popup__image").src = link
            imagePopup.querySelector(".popup__caption").textContent = name
        })
        const card = document.createElement("div")
        card.classList.add("card-block")
        card.append(cardCopy)
        return card
    }
    
    //Функция для добавления карточек на страницу
    function appendCard()
    {
        if(arguments.length == 1)
        {
        arguments[0].forEach(elem => {
            placesList.append(createCard(elem.name, elem.link))
        })
        }
        if(arguments.length == 2)
        {
            placesList.prepend(createCard(arguments[0], arguments[1]))
        }
    }

    //Открывает модальное окно
    function openModal(popup) {      
        popup.classList.add('popup_is-opened');
    }

    //Закрывает модальное окно
    function closeModal(popup)
    {
        popup.classList.remove('popup_is-opened');
    }

    //Обработчки отправки формы профиля
    function handleProfileFormSubmit(event) {
        event.preventDefault()
        if(event.target.classList.contains("popup__button_active"))
        {
            document.querySelector(".profile__title").textContent = profilePopup.querySelector(".popup__input_type_name").value
            document.querySelector(".profile__description").textContent = profilePopup.querySelector(".popup__input_type_description").value
            closeModal(profilePopup)
        }
    }

    //Обработчки отправки формы создания карточки
    function handleCardFormSubmit(event)
    {
        event.preventDefault()
        if(event.target.classList.contains("popup__button_active"))
        {
            let name = cardPopup.querySelector(".popup__input_type_card-name").value
            let link = cardPopup.querySelector(".popup__input_type_url").value
            cardPopup.querySelector(".popup__input_type_card-name").value = ""
            cardPopup.querySelector(".popup__input_type_url").value = ""
            initialCards.unshift({name: name, link: link})
            appendCard(name, link)
            closeModal(cardPopup)
        }
    }

    //Начальная иницилизация карточек
    appendCard(initialCards)

    //Добавление событий кликов на элементы
    document.querySelector(".profile__edit-button").addEventListener("click", event => {
        openModal(profilePopup)
        profilePopup.querySelector(".popup__input_type_name").value = document.querySelector(".profile__title").textContent
        profilePopup.querySelector(".popup__input_type_description").value = document.querySelector(".profile__description").textContent
    })

    profilePopup.querySelector(".popup__close").addEventListener("click", event => {
        closeModal(profilePopup)
    })

    profilePopup.querySelector(".popup__button").addEventListener("click", handleProfileFormSubmit)

    document.querySelector(".profile__add-button").addEventListener("click", event => {
        openModal(cardPopup)
    })

    cardPopup.querySelector(".popup__close").addEventListener("click", event => {
        closeModal(cardPopup)
    })

    cardPopup.querySelector(".popup__button").addEventListener("click", handleCardFormSubmit)

    imagePopup.querySelector(".popup__close").addEventListener("click", event => {
        closeModal(imagePopup)
    })

    //События валидации ввода
    inputList.forEach(elem => {
        elem.addEventListener("change", isValid)
    })
}