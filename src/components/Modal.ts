import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';

interface IModalData {
	content: HTMLElement;
}

export class Modal extends Component<IModalData> {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this._content = ensureElement<HTMLElement>('.modal__content', container);

		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this._content.addEventListener('click', (event) => event.stopPropagation());
	}

	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	open(content?: HTMLElement, anchorElement?: HTMLElement): void {
		if (content) {
			this.content = content;
		}
		if (anchorElement) {
    		const rect = anchorElement.getBoundingClientRect();
    		this.container.style.position = 'absolute';
    		this.container.style.top = `${rect.bottom + window.scrollY}px`;
    		this.container.style.left = `${rect.left + window.scrollX}px`;
  		} else {
    		this.container.style.position = 'fixed';
    		this.container.style.top = '0';
    		this.container.style.left = '0';
  		}
		
		this.container.classList.add('modal_active');
		this.events.emit('modal:open');
	}

	close() {
		this.container.classList.remove('modal_active');
		this.content = null;
		this.events.emit('modal:close');
	}

	render(data: IModalData): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}
