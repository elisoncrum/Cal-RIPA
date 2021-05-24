import axios from 'axios'
import * as msal from '@azure/msal-browser'
import store from '@/store/index'
import router from '../router'
import { add, isAfter } from 'date-fns'
import { consensualEncounterResultingInSearch } from '../stories/molecules/RipaActionsTaken.stories'

let authConfig = {
  cache: {
    cacheLocation: 'localStorage',
  },
  mode: 'redirect',
}

let msalInstance

const AuthService = {
  tryLogin: async () => {
    if (!sessionStorage.getItem('ripa-idToken')) {
      await msalInstance.handleRedirectPromise()
      const currentAccount = await msalInstance.getAllAccounts()
      console.log('checking account with no token ' + currentAccount)
      if (currentAccount.length) {
        // check to see if user is not in any groups.  If not, redirect
        if (currentAccount[0].idTokenClaims.roles.length === 0) {
          store.dispatch('setInvalidUser', true)
          // redirect to home page
          router.push('/checkUser')
        }
        const accessToken = await msalInstance.acquireTokenSilent({
          account: currentAccount[0],
          scopes: ['user.read'],
          redirectUri: window.location.origin,
        })
        store.dispatch('setUserAccountInfo', currentAccount[0])
        sessionStorage.setItem(
          'ripa-userAccount',
          JSON.stringify(currentAccount[0]),
        )
        sessionStorage.setItem('ripa-idToken', accessToken.idToken)
        sessionStorage.setItem(
          'ripa-tokenExpirationDate',
          add(new Date(), { minutes: 5 }),
        )
        sessionStorage.removeItem('ripa-logOutAttempt')
        return true
      } else {
        clearLocalStorageAuthInfo()
        msalInstance.loginRedirect()
      }
    } else {
      sessionStorage.removeItem('ripa-logOutAttempt')
      const currentAccount = await msalInstance.getAllAccounts()
      if (currentAccount.length) {
        store.dispatch('setUserAccountInfo', currentAccount[0])
      }
      return true
    }
  },

  getApiConfig: () => {
    return axios.get('/config.json')
  },

  checkToken: async () => {
    // check if we have a user account AND token
    const userAccount = JSON.parse(sessionStorage.getItem('ripa-userAccount'))
    const idToken = sessionStorage.getItem('ripa-idToken')
    if (userAccount && idToken) {
      // if SO, try to get a token using that
      // check to see if the current time is greater than the expiration date
      const tokenExpDate = sessionStorage.getItem('ripa-tokenExpirationDate')
      const isTokenExpired = isAfter(new Date(), new Date(tokenExpDate))
      if (isTokenExpired) {
        clearLocalStorageAuthInfo()
        await msalInstance.handleRedirectPromise()
        msalInstance.logoutRedirect({
          account: userAccount,
          postLogoutRedirectUri: window.location.origin,
        })
        return false
        // msalInstance.loginRedirect()
      } else {
        const silentRequest = {
          scopes: ['User.Read'],
          account: userAccount,
          redirectUri: window.location.origin,
        }
        const tokenRequest = await msalInstance.acquireTokenSilent(
          silentRequest,
        )
        if (tokenRequest.idToken) {
          // we were able to receive a valid token from the server
          // update it and return true
          store.dispatch('setUserAccountInfo', userAccount)
          sessionStorage.setItem('ripa-idToken', tokenRequest.idToken)
          return true
        }
      }
    } else {
      // if NOT, we are missing pieces of the login information, go to login
      return false
    }
  },

  getIsAuthenticated: async () => {
    const userAccount = JSON.parse(sessionStorage.getItem('ripa-userAccount'))
    store.dispatch('setUserAccountInfo', userAccount)
    if (msalInstance === undefined) {
      await getAuthConfig()
      if (userAccount) {
        const silentRequest = {
          scopes: ['User.Read'],
          account: userAccount,
          forceRefresh: false,
          redirectUri: window.location.pathname,
        }
        // if we still have the user account, refresh the token
        const tokenResponse = await msalInstance.acquireTokenSilent(
          silentRequest,
        )
        if (tokenResponse.accessToken) {
          // if the response contains an ID token, you are still logged in
          sessionStorage.setItem('ripa-idToken', tokenResponse.idToken)
          return true
        } else {
          // if there's no token force user to login again
          clearLocalStorageAuthInfo()
          return false
        }
      } else {
        // if we don't have user account info, need to login
        return false
      }
    } else {
      if (sessionStorage.getItem('ripa-idToken')) {
        return true
      } else {
        return false
      }
    }
  },
  doLogOut: async () => {
    // get user from local storage
    const currentAccount = sessionStorage.getItem('ripa-userAccount')
    sessionStorage.setItem('ripa-logOutAttempt', true)
    // remove session storage info
    clearLocalStorageAuthInfo()
    if (currentAccount) {
      msalInstance.logoutRedirect({
        account: JSON.parse(currentAccount),
        postLogoutRedirectUri: window.location.origin,
      })
    }
  },
  getAuthConfig: async () => {
    const loadConfig = await axios
      .get('/config.json')
      .then(res => {
        authConfig = {
          ...authConfig,
          auth: {
            tenant: res.data.Authentication.TenantId,
            clientId: res.data.Authentication.ClientId,
            authority: res.data.Authentication.AuthorityUrl,
          },
        }
        msalInstance = new msal.PublicClientApplication(authConfig)
        store.dispatch('setAuthConfig', true)
        store.dispatch('setApiConfig', {
          apiBaseUrl: res.data.Configuration.ServicesBaseUrl,
          apiSubscription: res.data.Configuration.Subscription,
          defaultCounty: res.data.Configuration.DefaultCounty,
        })
        return true
      })
      .catch(err => {
        if (err) {
          store.dispatch('setAuthConfig', false)
          store.dispatch('setApiConfig', null)
          return false
        }
      })
    return loadConfig
  },
  checkManualLogOut: () => {
    const manualLogOut = sessionStorage.getItem('ripa-logOutAttempt')
    if (manualLogOut === null) {
      return false
    } else {
      return true
    }
  },
  clearManualLogOut: () => {
    sessionStorage.removeItem('ripa-logOutAttempt')
  },
}

const getAuthConfig = async () => {
  const loadConfig = await axios
    .get('/config.json')
    .then(res => {
      authConfig = {
        ...authConfig,
        auth: {
          tenant: res.data.Authentication.TenantId,
          clientId: res.data.Authentication.ClientId,
          authority: res.data.Authentication.AuthorityUrl,
        },
      }
      msalInstance = new msal.PublicClientApplication(authConfig)
      store.dispatch('setAuthConfig', true)
      store.dispatch('setApiConfig', {
        apiBaseUrl: res.data.Configuration.ServicesBaseUrl,
        apiSubscription: res.data.Configuration.Subscription,
        defaultCounty: res.data.Configuration.DefaultCounty,
        displayBeatInput: res.data.Configuration.DisplayBeatsInput === 'true',
        environmentName: res.data.Configuration.Environment,
        displayEnvironment: res.data.Configuration.Environment !== 'p',
      })
      return true
    })
    .catch(err => {
      if (err) {
        store.dispatch('setAuthConfig', false)
        store.dispatch('setApiConfig', null)
        return false
      }
    })
  return loadConfig
}

const clearLocalStorageAuthInfo = () => {
  sessionStorage.removeItem('ripa-userAccount')
  sessionStorage.removeItem('ripa-idToken')
  sessionStorage.removeItem('ripa-tokenExpirationDate')
}

export default AuthService
