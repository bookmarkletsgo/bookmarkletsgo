try{
  navigator.clipboard
    .writeText(`${window.document.title} ${window.location.href}`)
    .then(() => alert('done'))
    .catch((error = 'Error: DOMException') => console.error(error) & alert(error));
} catch (e) {
  alert(e);
}
