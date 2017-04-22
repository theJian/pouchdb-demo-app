class ContactBook {
  constructor() {
    // TODO: implement
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
        el.addEventListener('click', handlers[element])
      })
    }

    attachOnclick({
      'addContactButton': this.addContact,
      'editContactButton': this.editContact,
      'saveContactButton': this.saveContact,
      'removeContactButton': this.removeContact,
      'cancelEditButton': this.cancelEdit,
    })
  }

  addContact() {

  }

  editContact() {

  }

  saveContact() {

  }

  removeContact() {

  }

  cancelEdit() {

  }

}
