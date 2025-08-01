import { Component } from './base/Component';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';
import { PaymentMethod } from '../types';

interface IOrderForm {
	payment: PaymentMethod;
	address: string;
	valid: boolean;
	errors: string;
}

export class Order extends Component<IOrderForm> {
	protected _paymentButtons: HTMLButtonElement[];
	protected _addressInput: HTMLInputElement;
	protected _submitButton: HTMLButtonElement;
	protected _errors: HTMLElement;
	protected _payment: PaymentMethod | null = null;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._paymentButtons = Array.from(
			container.querySelectorAll('.button_alt')
		);
		this._addressInput = ensureElement<HTMLInputElement>(
			'input[name="address"]',
			container
		);
		this._submitButton = ensureElement<HTMLButtonElement>(
			'.order__button',
			container
		);
		this._errors = ensureElement<HTMLElement>('.form__errors', container);

		// Обработчики для кнопок оплаты
		this._paymentButtons.forEach((button) => {
			button.addEventListener('click', () => {
				this.events.emit('order:change', {
					field: 'payment',
					value: button.name,
				});
				this._togglePaymentButton(button);
			});
		});

		// Валидация при изменении адреса
		this._addressInput.addEventListener('input', () => {
			this.events.emit('order:change', {
				field: 'address',
				value: this._addressInput.value,
			});
		});
		// Обработчик отправки формы
		container.addEventListener('submit', (e) => {
			e.preventDefault();
			this.events.emit('order:submit');
		});
	}

	private _togglePaymentButton(selectedButton: HTMLButtonElement) {
		this._paymentButtons.forEach((button) => {
			button.classList.toggle('button_alt-active', button === selectedButton);
		});
	}

	set address(value: string) {
		this._addressInput.value = value;
	}

	setErrors(errors: Record<string, string>) {
		const orderErrors = {
			payment: errors.payment,
			address: errors.address,
		};

		const errorMessages = Object.values(orderErrors).filter(Boolean);
		this.setText(this._errors, errorMessages.join(', '));
		}

	clear() {
		this._paymentButtons.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', false);
		});
		this._addressInput.value = '';
		this.setText(this._errors, '');
        this.setDisabled(this._submitButton, true);
	}
}
