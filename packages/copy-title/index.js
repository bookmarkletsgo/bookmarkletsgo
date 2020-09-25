try {
  navigator.clipboard
    .writeText(window.document.title)
    .then(() => alert('done'))
    .catch(
      (error = 'Error: DOMException') => console.error(error) & alert(error)
    );
} catch (error) {
  alert(error);
}
