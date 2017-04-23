class ContactBook {
  constructor(storeClass, remote) {
    this.store = new storeClass('contacts', remote, () => {
      this.refresh();
    });
    this.init();

    // render component for the first time
    this.refresh();

    this.toggleContactFormEditing(false);
  }

  init() {
    this.initElements();
    this.initItemTemplate();
    this.attachHandlers();
  }

  initElements() {
    this.contactList = document.getElementById('contactList');
    this.contactDetailsForm = document.getElementById('contactDetails');
    this.contactIdField = document.getElementById('contactid');
    this.firstNameField = document.getElementById('firstname');
    this.lastNameField = document.getElementById('lastname');
    this.phoneField = document.getElementById('phone');

    this.addContactButton = document.getElementById('addContact');
    this.removeContactButton = document.getElementById('removeContact');
    this.editContactButton = document.getElementById('editContact');
    this.cancelEditButton = document.getElementById('cancelEdit');
    this.saveContactButton = document.getElementById('saveContact');
  }

  initItemTemplate() {
    const contactListItem = this.contactList.querySelector('li');
    this.contactList.removeChild(contactListItem);
    this._contactTemplate = contactListItem;
  }

  attachHandlers() {
    this.contactDetailsForm.addEventListener('submit', e => {
      e.preventDefault();
    });

    function attachOnclick(handlers) {
      const elements = Object.keys(handlers)
      elements.forEach(element => {
        const el = this[element]
        el.addEventListener('click', handlers[element].bind(this))
      })
    }

    attachOnclick.call(this, {
      'addContactButton': this.addContact,
      'editContactButton': this.editContact,
      'saveContactButton': this.saveContact,
      'removeContactButton': this.removeContact,
      'cancelEditButton': this.cancelEdit,
    })
  }

  addContact() {
    this.setContactDetails({ firstName: 'Name' });
    this.toggleContactFormEditing(true);
  }

  editContact() {
    const contactId = this.getContactId();
    this.store.get(contactId).then(contact => {
      this.setContactDetails(contact);
      this.toggleContactFormEditing(true);
    })
  }

  saveContact() {
    const contact = this.getContactDetails();

    this.store.save(contact).then(() => {
      this.setContactDetails({});
      this.toggleContactFormEditing(false);
      this.refresh();
    })
  }

  removeContact() {
    const contactId = this.getContactId();
    this.store.remove(contactId).then(() => {
      this.setContactDetails({});
      this.toggleContactFormEditing(false);
      this.refresh();
    })
  }

  cancelEdit() {
    this.setContactDetails({});
    this.toggleContactFormEditing(false);
  }

  getContactDetails() {
    return {
      _id: this.getContactId(),
      firstName: this.firstNameField.value,
      lastName: this.lastNameField.value,
      phone: this.phoneField.value,
    }
  }

  refresh() {
    this.store.getAll().then(contacts => {
      this.renderContactList(contacts);
    })
  }

  renderContactList(contacts) {
    this.contactList.innerHTML = '';
    this.contactList.appendChild(this.createContactList(contacts));
  }

  createContactList(contacts) {
    if (!contacts.length) {
      return this.createNoDataItem();
    }

    let res = document.createDocumentFragment();

    contacts.forEach(contact => {
      res.appendChild(this.createContact(contact))
    });

    return res;
  }

  createNoDataItem() {
    let res = document.createElement('li');
    res.className = 'contact-list-empty';
    res.textContent = 'No contacts';
    return res;
  }

  createContact(contact) {
    let res = this._contactTemplate.cloneNode(true);
    res.setAttribute('data-contactid', contact._id);
    res.querySelector('.contact-name').innerText = contact.firstName + ' ' + contact.lastName;
    res.querySelector('.contact-phone').innerText = contact.phone;
    res.addEventListener('click', this.showContact.bind(this));
    return res;
  }

  showContact(e) {
    const contactId = e.currentTarget.getAttribute('data-contactid');
    this.store.get(contactId).then(contact => {
      this.setContactDetails(contact);
      this.toggleContactFormEditing(false);
    })
  }

  setContactDetails(contactDetails) {
    this.contactIdField.value = contactDetails._id || '';
    this.firstNameField.value = contactDetails.firstName || '';
    this.lastNameField.value = contactDetails.lastName || '';
    this.phoneField.value = contactDetails.phone || '';
  }

  toggleContactFormEditing(isEditing) {
    const isContactSelected = !this.getContactId();

    this.toggleFade(this.contactDetailsForm, !isEditing && isContactSelected);

    this.toggleElement(this.editContactButton, !isEditing && !isContactSelected);
    this.toggleElement(this.removeContactButton, !isEditing && !isContactSelected);

    this.toggleElement(this.addContactButton, !isEditing);
    this.toggleElement(this.saveContactButton, isEditing);
    this.toggleElement(this.cancelEditButton, isEditing);

    this.toggleDisabled(this.firstNameField, !isEditing);
    this.toggleDisabled(this.lastNameField, !isEditing);
    this.toggleDisabled(this.phoneField, !isEditing);

    this.firstNameField.focus();
    this.firstNameField.setSelectionRange(0, this.firstNameField.value.length);
  }

  getContactId() {
    return this.contactIdField.value;
  }

  toggleFade(el, isFade) {
    el.style.opacity = isFade ? .5 : 1;
  }

  toggleElement(el, isShown) {
    el.style.display = isShown ? 'block' : 'none';
  }

  toggleDisabled(el, isDisabled) {
    if (isDisabled) {
      el.setAttribute('disabled', '');
    } else {
      el.removeAttribute('disabled');
    }
  }
}
