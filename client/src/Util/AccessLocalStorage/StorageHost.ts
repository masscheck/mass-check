import getId from './GetId';
import methods from './Methods';

interface allowedDomainInterface {
  origin: string;
  allowedMethods: string[];
}

const storageHost = (allowedDomains: allowedDomainInterface[]) => {
  const handleMessage = (event) => {
    const { data } = event;
    const domain = allowedDomains.find((allowedDomain) =>
      event.origin.includes(allowedDomain.origin)
    );
    const id = getId(data);

    if (!id) {
      return;
    }

    if (!domain) {
      event.source.postMessage(
        {
          id,
          connectError: true,
          error: `${event.origin} is not an allowed domain`,
        },
        event.origin
      );

      return;
    }

    const { method } = data;

    if (!~domain.allowedMethods.indexOf(method) && method !== 'connect') {
      event.source.postMessage(
        {
          id,
          error: `${method} is not an allowed method from ${event.origin}`,
        },
        event.origin
      );

      return;
    }

    methods[method](event, data);
  };

  const close = () => {
    window.removeEventListener('message', handleMessage);
  };

  window.addEventListener('message', handleMessage);

  return {
    close,
  };
};

export default storageHost;
