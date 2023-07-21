
import {store} from "../store/store";
import { Provider } from "react-redux";
import { AppProps } from 'next/app'
import RootLayout from "../components/layout";
import "./../dist/output.css";
import {fas} from "@fortawesome/free-solid-svg-icons";
import '@fortawesome/fontawesome-svg-core/styles.css';
import {SessionProvider} from "next-auth/react";
const {library, config} = require('@fortawesome/fontawesome-svg-core')// Do this for fontawesome to work with nextjs
library.add(fas);
function MyApp({ Component, pageProps }:AppProps) {
  
  return (
    <>
      <SessionProvider session={pageProps.session}>
        <Provider store={store}>
          <RootLayout>
            <Component {...pageProps} />
          </RootLayout>
        </Provider>
      </SessionProvider>
    </>
  );
}

export default MyApp
