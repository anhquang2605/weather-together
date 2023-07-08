
import {store} from "../store/store";
import { Provider } from "react-redux";
import { AppProps } from 'next/app'
import RootLayout from "../components/layout";
import "./../dist/output.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import {fas} from "@fortawesome/free-solid-svg-icons";
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
library.add(fas);