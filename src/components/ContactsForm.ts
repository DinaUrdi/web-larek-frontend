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
		this.setText(this._errors, errorMessages.join(', '));
        this.setDisabled(this._submitButton, errorMessages.length > 0);
	}

	clear() {
		this._emailInput.value = '';
		this._phoneInput.value = '';
		this.setText(this._errors, '');
        this.setDisabled(this._submitButton, true);
	}
}
