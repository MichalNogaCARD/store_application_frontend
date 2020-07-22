import React, {Component} from "react";
import * as URLs from '../../URLs'
import Table from "react-bootstrap/Table";

class ProductSearch extends Component {

    constructor(props) {
        super(props);

        this.state = {
            products: []
        }
    }

    filter = e => this.setState({filter: e.target.value});

    componentDidMount() {
        const url = URLs.backend + 'api/products/all';
        const headers = new Headers();
        headers.set('Content-Type', 'application/json;charset=UTF-8');
        headers.set('Authorization', 'Bearer ' + sessionStorage.getItem('token'));

        fetch(url, {
            method: 'GET',
            headers: headers
        })
            .then(response => response.json())
            .then(products => this.setState({products: products}));
    }

    render() {
        const allProducts = this.state.products;
        let rowNumber = 0;
        let products = allProducts;

        if (this.state.filter) {
            products = allProducts.filter(product => product.name.toString().toLowerCase().includes(this.state.filter.toLowerCase()));
        }

        return (<div className="input-page">
                <input type='text' onChange={this.filter} className='btn-block' placeholder='SZUKANA NAZWA'/>

                <div className="table-page">
                    <Table bordered hover>
                        <thead>
                        <TableHeadItem/>
                        </thead>
                        <tbody>
                        {products.map(product => <ProductItem key={product.id} rowNumber={rowNumber += 1}
                                                              product={product}/>)}
                        </tbody>
                    </Table>
                </div>
            </div>
        )
    }
}

const TableHeadItem = () =>
    <tr>
        <th>Lp</th>
        <th>Nazwa</th>
        <th>Cena</th>
    </tr>

const ProductItem = props =>
    <tr>
        <td>{props.rowNumber}</td>
        <td>{props.product.name}</td>
        <td>{props.product.nettPrice} PLN</td>
    </tr>

export {ProductSearch}