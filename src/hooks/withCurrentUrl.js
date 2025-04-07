import { useLocation } from 'react-router-dom';

const useCurrentUrl = () => {
  const location = useLocation();

  const currentUrl = window.location.origin + location.pathname + location.search;

  return currentUrl;
};


// Wrapper to use hook in a class component
const withCurrentUrl = (WrappedComponent) => {
    return function Wrapper(props) {
      const url = useCurrentUrl();
      return <WrappedComponent {...props} currentUrl={url} />;
    };
  };

export default withCurrentUrl;