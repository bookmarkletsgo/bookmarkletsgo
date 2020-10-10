export default function copy(text) {
  const errorHandler = (error) => {
    console.error(String(error));
    prompt('Enter Ctrl+C to copy:', text);
  };

  try {
    navigator.clipboard
      .writeText(text)
      .then(() => alert('done'))
      .catch(errorHandler);
    // .catch(
    //   (error = 'Error: DOMException') => console.error(error) & alert(error)
    // );
  } catch (error) {
    // alert(error);
    errorHandler(error);
  }
}
