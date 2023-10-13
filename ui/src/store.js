import create from 'zustand'

export const useStore = create(set => ({
    csrf_token: "",
    setCsrfIfEmpty: (csrf) => set( state => ((state.csrf_token == "" && csrf != "")? {csrf_token: csrf}: {})),

    usr_info: {},
    setUsrInfo: (usr_info) => set( state => ({ usr_info })),

    stripe_key: null,
    setStripeKey: (stripe_key) => set( state => ({ stripe_key })),

    stripe_promise: null,
    setStripePromise: (stripe_promise) => set( state => ({ stripe_promise })),
}))
