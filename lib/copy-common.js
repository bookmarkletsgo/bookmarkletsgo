export default function copy(text) {
  const errorHandler = (error) => {
    console.debug(String(error));
    prompt('Enter Ctrl+C to copy:', text);
  };

  try {
    navigator.clipboard
      .writeText(text)
      .then(() => alert('done'))
      .catch(errorHandler);
  } catch (error) {
    errorHandler(error);
  }
}
