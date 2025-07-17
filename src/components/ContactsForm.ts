import { Component } from './base/Component';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

interface IContactsForm {
	email: string;
	phone: string;
	valid: boolean;
	errors: string;
}

export class ContactsForm extends Component<IContactsForm> {
	protected _emailInput: HTMLInputElement;
	protected _phoneInput: HTMLInputElement;
	protected _submitButton: HTMLButtonElement;
	protected _errors: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._emailInput = ensureElement<HTMLInputElement>(
			'input[name="email"]',
			container
		);
		this._phoneInput = ensureElement<HTMLInputElement>(
			'input[name="phone"]',
			container
		);
		this._submitButton = ensureElement<HTMLButtonElement>('.button', container);
		this._errors = ensureElement<HTMLElement>('.form__errors', container);

		// Обработчики изменений
		this._emailInput.addEventListener('input', () => {
			this.events.emit('contacts:change', {
				field: 'email',
				value: this._emailInput.value,
			});
		});

		this._phoneInput.addEventListener('input', () => {
			this.events.emit('contacts:change', {
				field: 'phone',
				value: this._phoneInput.value,
			});
		});

		// Подписка на ошибки
		events.on('order:errors', (errors: Record<string, string>) => {
			this.setErrors(errors);
		});

		// Обработчик отправки формы
		container.addEventListener('submit', (e) => {
			e.preventDefault();
			this.events.emit('contacts:submit');
		});
	}

	set email(value: string) {
		this._emailInput.value = value;
	}

	set phone(value: string) {
		this._phoneInput.value = value;
	}

	getContainer(): HTMLElement {
		return this.container;
	}

	setErrors(errors: Record<string, string>) {
		const contactErrors = {
			email: errors.email,
			phone: errors.phone,
		};

		const errorMessages = Object.values(contactErrors).filter(Boolean);
		this._errors.textContent = errorMessages.join(', ');
		this._submitButton.disabled = errorMessages.length > 0;
	}

	clear() {
		this._emailInput.value = '';
		this._phoneInput.value = '';
		this._errors.textContent = '';
		this._submitButton.disabled = true;
	}
}
