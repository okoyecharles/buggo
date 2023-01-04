import { Provider } from 'react-redux';
import store from '../redux/configureStore';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ToastContainer position="bottom-right" />
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}
