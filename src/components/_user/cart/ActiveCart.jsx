import React, {useState, useEffect, useRef} from "react";
import * as URLs from '../../URLs';
import Table from "react-bootstrap/Table";

const Product = props =>
    <tr>
        <td>{props.rowNumber}</td>
        <td>{props.name}</td>
        <td>{props.quantity}</td>
        <td>{props.nettPrice} PLN</td>
        <td>{props.vat} %</td>
        <td>{props.value} PLN</td>
    </tr>

const ActiveCart = () => {

    const [products, setProducts] = useState([])
    const [addresses, setAddresses] = useState([])
    const [address, setAddress] = useState({})
    const [cartClosed, setCartClosed] = useState(false)
    const [change, setChange] = useState(true)

    useEffect(() => {
        async function getData() {
            await getProductsFromActiveCart()
            await getAddresses()
        }

        getData().catch(err => console.log(err))
        setChange(false)
    }, [change])

    const handleAddressChange = event => {
        let target = event.target
        let value = target.value

        let addressToStore = addresses.filter(function (address, index, array) {
            if (address.id.toString() === value) {
                return address
            }
        })
        setAddress(addressToStore[0])
    }

    const handleSubmit = async () => {
        const url = URLs.backend + 'api/carts/close'
        const headers = new Headers();
        headers.set('Content-Type', 'application/json;charset=UTF-8');
        headers.set('Authorization', 'Bearer ' + sessionStorage.getItem('token'));

        const response = fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({id: address.id})
        })

        await response
            .then(() => setChange(true))
            .then(() => setCartClosed(true))
            .then(() => setProducts([]))
            .catch(err => console.log(err))

        const body = (await response).json();
        console.log(await body)

        // todo przekierowanie na nowy adres: produkty wyslane do realizacji
    }

    const getProductsFromActiveCart = async () => {
        const url = URLs.backend + 'api/products/activeCart'
        const headers = new Headers();
        headers.set('Content-Type', 'application/json;charset=UTF-8')
        headers.set('Authorization', 'Bearer ' + sessionStorage.getItem('token'))

        const response = fetch(url, {
            method: 'GET',
            headers: headers
        })
        const products = JSON.parse(await (await response).text())
        setProducts(await products)
    }

    const getAddresses = async () => {
        const url = URLs.backend + 'api/deliveryAddress/all'
        const headers = new Headers();
        headers.set('Content-Type', 'application/json;charset=UTF-8')
        headers.set('Authorization', 'Bearer ' + sessionStorage.getItem('token'))

        const response = fetch(url, {
            method: 'GET',
            headers: headers
        })

        const addresses = JSON.parse(await (await response).text())
        const firstAddress = await addresses[0]
        setAddresses(await addresses)
        setAddress(await firstAddress)
    }

    if (Object.entries(products).length === 0) {
        return (
            <div className='main-page'>
                <div hidden={cartClosed}>
                    <section className="container">
                        <h5 className="top-page-text">MÓJ KOSZYK</h5>
                        <div className="top-page-text-details">
                            <p className="top-page-text-details-at">@ status</p>
                            <p className="top-page-text-details-text">nie masz jeszcze żadnych produktów w koszyku</p>
                        </div>
                    </section>
                </div>
                <div className='alert alert-success m-4' hidden={!cartClosed}> {/*todo napis się nie pokazuje*/}
                    <p>Produkty dodane do koszyka</p>
                </div>
            </div>
        )
    } else {
        return (
            <div>
                <div className='table-page'>
                    <Table bordered hover>
                        <thead>
                        <tr>
                            <td>Lp</td>
                            <td>Nazwa</td>
                            <td>Ilość</td>
                            <td>Netto</td>
                            <td>VAT</td>
                            <td>Wartość netto</td>
                        </tr>
                        </thead>
                        <tbody>
                        {products.map((product, i) => <Product
                            key={product.id}
                            rowNumber={i + 1}
                            name={product.name}
                            quantity={product.quantity}
                            nettPrice={product.nettPrice}
                            vat={product.vat}
                            value={product.nettPrice * product.quantity}
                        />)}
                        </tbody>
                    </Table>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className='table-page'>
                        <label>DOSTAWA:</label>
                        <select name='address' value={address} onChange={handleAddressChange}>
                            {
                                addresses.map(address => <option key={address.id}
                                                                 value={address.id}>{address.street}</option>)
                            }
                        </select>
                        <div className='table-page'>

                            <button type='submit' className='btn btn-block btn-outline-secondary'>PRZEŚLIJ DO REALIZACJI
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export {ActiveCart}