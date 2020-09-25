try {
  navigator.clipboard
    .writeText(window.location.href)
    .then(() => alert('done'))
    .catch(
      (error = 'Error: DOMException') => console.error(error) & alert(error)
    );
} catch (error) {
  alert(error);
}
