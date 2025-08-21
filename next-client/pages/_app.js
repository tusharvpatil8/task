// // pages/_app.js
// import Footer from "@/components/template/footer";
// import Header from "@/components/template/header";
// import "@/styles/globals.css";
// import Head from "next/head";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// // Redux & Persist
// import { Provider } from "react-redux";
// import { PersistGate } from "redux-persist/integration/react";
// import { store, persistor } from "@/store/store"; // make sure this path is correct

// export default function App({ Component, pageProps }) {
//   return (
//     <Provider store={store}>
//       <PersistGate loading={null} persistor={persistor}>
//         <Head>
//           <title>MyBlog</title>
//           <meta
//             name="description"
//             content="MyBlog - Innovative web solutions for the digital world."
//           />
//           <meta name="viewport" content="width=device-width, initial-scale=1" />
//         </Head>

//         <div className="flex flex-col min-h-screen font-slussenExtended">
//           <Header />

//           <main className="flex-grow">
//             <Component {...pageProps} />
//           </main>

//           <Footer />
//         </div>

//         <ToastContainer
//           position="top-right"
//           autoClose={3000}
//           hideProgressBar={false}
//           newestOnTop
//           closeOnClick
//           pauseOnHover
//           draggable
//           theme="light"
//         />
//       </PersistGate>
//     </Provider>
//   );
// }


// pages/_app.js
import Footer from "@/components/template/footer";
import Header from "@/components/template/header";
import "@/styles/globals.css";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Redux & Persist
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { wrapper } from "@/store/store"; // Import the wrapper

function App({ Component, pageProps }) {
  const { store, props } = wrapper.useWrappedStore(pageProps);

  return (
    <Provider store={store}>
      <PersistGate persistor={store.__persistor} loading={null}>
        <Head>
          <title>MyBlog</title>
          <meta
            name="description"
            content="MyBlog - Innovative web solutions for the digital world."
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>

        <div className="flex flex-col min-h-screen font-slussenExtended">
          <Header />

          <main className="flex-grow">
            <Component {...pageProps} />
          </main>

          <Footer />
        </div>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="light"
        />
      </PersistGate>
    </Provider>
  );
}

export default wrapper.withRedux(App);