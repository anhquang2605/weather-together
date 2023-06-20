
import {store} from "../store/store";
import { Provider } from "react-redux";
import { AppProps } from 'next/app'
import RootLayout from "../components/layout";
import "./../dist/output.css";
function MyApp({ Component, pageProps }:AppProps) {
  return (
    <>
      <Provider store={store}>
        <RootLayout>
          <Component {...pageProps} />
        </RootLayout>
      </Provider>
    </>
  );
}

export default MyApp