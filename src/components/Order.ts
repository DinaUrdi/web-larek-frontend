import { Component } from "./base/Component";
import { IEvents } from "./base/events";
import { ensureElement } from "../utils/utils";
import { PaymentMethod } from "../types";

interface IOrderForm {
    payment: PaymentMethod;
    address: string;
    valid: boolean;
}

export class Order extends Component<IOrderForm> {
    protected _paymentButtons: HTMLButtonElement[];
    protected _addressInput: HTMLInputElement;
    protected _submitButton: HTMLButtonElement;
    protected _errors: HTMLElement;
    protected _payment: PaymentMethod | null = null;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._paymentButtons = Array.from(container.querySelectorAll('.button_alt'));
        this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);
        this._submitButton = ensureElement<HTMLButtonElement>('.order__button', container);
        this._errors = ensureElement<HTMLElement>('.form__errors', container);

        // Обработчики для кнопок оплаты
        this._paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.payment = button.name as PaymentMethod;
                events.emit('order:payment_change', { payment: this.payment });
                this.validate();
            });
        });

        // Валидация при изменении адреса
        this._addressInput.addEventListener('input', () => {
            this.validate();
        });

        // Обработчик отправки формы
        container.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validate()) {
                events.emit('order:submit', {
                    payment: this.payment,
                    address: this._addressInput.value
                });
            }
        });
    }

    set payment(value: PaymentMethod) {
        this._payment = value;
        this._paymentButtons.forEach(button => {
            button.classList.toggle('button_alt-active', button.name === value);
        });
    }

    get payment(): PaymentMethod | null {
        return this._payment;
    }

    set address(value: string) {
        this._addressInput.value = value;
    }

    set valid(value: boolean) {
        this._submitButton.disabled = !value;
    }

    set errors(value: string) {
        this._errors.textContent = value;
    }

    validate(): boolean {
        const isValid = Boolean(this._payment && this._addressInput.value.trim());
        this.valid = isValid;
        return isValid;
    }

    clear() {
        this._payment = null;
        this._paymentButtons.forEach(button => {
            button.classList.remove('button_alt-active');
        });
        this._addressInput.value = '';
        this.valid = false;
    }
}