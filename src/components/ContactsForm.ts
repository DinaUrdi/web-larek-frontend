import { Component } from "./base/Component";
import { IEvents } from "./base/events";
import { ensureElement } from "../utils/utils";

interface IContactsForm {
    email: string;
    phone: string;
    valid: boolean;
}

export class ContactsForm extends Component<IContactsForm> {
    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;
    protected _submitButton: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
        this._phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);
        this._submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this._errors = ensureElement<HTMLElement>('.form__errors', container);

        // Валидация при изменении полей
        this._emailInput.addEventListener('input', () => this.validate());
        this._phoneInput.addEventListener('input', () => this.validate());

        // Обработчик отправки формы
        container.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validate()) {
                events.emit('contacts:submit', {
                    email: this.email,
                    phone: this.phone
                });
            }
        });
        
    }

    set email(value: string) {
        this._emailInput.value = value;
        this.validate();
    }

    get email(): string {
        return this._emailInput.value;
    }

    set phone(value: string) {
        this._phoneInput.value = value;
        this.validate();
    }

    get phone(): string {
        return this._phoneInput.value;
    }

    set valid(value: boolean) {
        this._submitButton.disabled = !value;
    }

    set errors(value: string) {
        this._errors.textContent = value;
    }

    getContainer(): HTMLElement {
    return this.container;
}

    validate(): boolean {
        const emailValid = this._validateEmail(this._emailInput.value);
        const phoneValid = this._validatePhone(this._phoneInput.value);
        const isValid = emailValid && phoneValid;
        
        this.valid = isValid;
        this.errors = !isValid ? 'Проверьте правильность введенных данных' : '';
        return isValid;
    }

    clear() {
  this._emailInput.value = '';
  this._phoneInput.value = '';
  this.valid = false;
  this.errors = '';
}

    private _validateEmail(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    private _validatePhone(phone: string): boolean {
        return phone.length >= 10;
    }
}