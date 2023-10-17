import NProgress from 'nprogress';
import Router from 'next/router';
import { ApolloProvider } from '@apollo/client';
import { SessionProvider } from 'next-auth/react';
import Page from '../components/Page';
import '../components/styles/nprogress.css';
import withData from '../lib/withData';
import { AddIngredientStateProvider } from '../lib/addIngredientState';
import { EditShoppingItemStateProvider } from '../lib/editShoppingItemState';
import { EditRecipeItemStateProvider } from '../lib/editRecipeItemState';
import { AddShoppingListItemStateProvider } from '../lib/addShoppingListItemState';
import { AddRecipeItemStateProvider } from '../lib/addRecipeItemState';
import { MobileNavStateProvider } from '../lib/mobileNavState';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

// eslint-disable-next-line react/prop-types
function MyApp({ Component, pageProps: { session, ...pageProps }, apollo }) {
  return (
    <SessionProvider session={session}>
      <ApolloProvider client={apollo}>
        <AddIngredientStateProvider>
          <EditShoppingItemStateProvider>
            <AddShoppingListItemStateProvider>
              <AddRecipeItemStateProvider>
                <EditRecipeItemStateProvider>
                  <MobileNavStateProvider>
                    <Page>
                      <Component {...pageProps} />
                    </Page>
                  </MobileNavStateProvider>
                </EditRecipeItemStateProvider>
              </AddRecipeItemStateProvider>
            </AddShoppingListItemStateProvider>
          </EditShoppingItemStateProvider>
        </AddIngredientStateProvider>
      </ApolloProvider>
    </SessionProvider>
  );
}

MyApp.getInitialProps = async function ({ Component, ctx }) {
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  pageProps.query = ctx.query;
  return { pageProps };
};

export default withData(MyApp);
