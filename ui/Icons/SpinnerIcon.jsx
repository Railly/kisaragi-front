export default function SpinnerIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <path
        className="bg-white opacity-25"
        fill="currentColor"
        // spinner
        d="M12 22a10 10 0 100-20 10 10 0 000 20z"
      ></path>
      <path
        className="bg-white opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}
