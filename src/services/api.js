import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
})

export const getTableByToken = (token) =>
    api.get(`/tables/${token}`)

export const getProducts = () =>
    api.get('/products')

export const placeOrder = (data) =>
    api.post('/orders', data)

export const getOrder = (id) =>
    api.get(`/orders/${id}`)