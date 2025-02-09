const deleteBtn = document.getElementById('deleteBtn');
const confirmationModal = document.getElementById('confirmationModal');
const cancelBtn = document.getElementById('cancelBtn');
const closeModal = document.getElementById('closeModal');

// Show the modal when the delete button is clicked
deleteBtn.addEventListener('click', () => {
  confirmationModal.classList.remove('hidden');
});

// Close the modal when the cancel button is clicked
cancelBtn.addEventListener('click', () => {
  confirmationModal.classList.add('hidden');
});

// Close the modal when the close icon is clicked
closeModal.addEventListener('click', () => {
  confirmationModal.classList.add('hidden');
});
