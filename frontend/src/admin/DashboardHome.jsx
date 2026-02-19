import axios from "axios";
import {useState,useEffect} from "react";

function DashboardHome() {
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [sales, setSales] = useState([]);
    const [totalSales, setTotalSales] = useState(0.0);

    useEffect(() => {
        fetchOrders();
        fetchUsers();
        fetchProducts();
        fetchSoldOrders();
    }, [])

    useEffect(() => {
        const total = sales.reduce((sum, sale) => sum + Number(sale.totalAmount), 0);
        setTotalSales(total);
    }, [sales]);

    const fetchOrders = async () => {
        const respone = await axios.get("http://localhost:3636/orders");
        setOrders(respone.data);
    }
    const fetchUsers = async () => {
        const response = await axios.get("http://localhost:3636/users");
        setUsers(response.data);
    }
    const fetchProducts = async () => {
        const response = await axios.get("http://localhost:3636/products");
        setProducts(response.data);
    }
    const fetchSoldOrders = async () => {
      const response = await axios.get("http://localhost:3636/sales");
      setSales(response.data);
    }
    const handleUpdateOrderStatus = async (id) =>{
      await axios.put(`http://localhost:3636/updateOrder/${id}`,{
        status:"sold"
      })
      fetchOrders();
      fetchSoldOrders();
    }
    //console.log("sales: ",sales)

  return (
    <div className="dashboard-home">

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Sales</h4>
          <p>TND {totalSales}</p>
        </div>

        <div className="stat-card">
          <h4>Total Orders</h4>
          <p>{orders.length}</p>
        </div>

        <div className="stat-card">
          <h4>Users</h4>
          <p>{users.length}</p>
        </div>

        <div className="stat-card">
          <h4>Products</h4>
          <p>{products.length}</p>
        </div>
      </div>

      {/* Products Table */}
      <div className="table-section">
        <div className="table-header">
          <h3>Recent Products</h3>
          <button className="gold-btn">+ Add Product</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => {
                return (
                    <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>TND{product.price}</td>
                    <td>{product.stock}</td>
                    <td><span className="status active">Active</span></td>
                    </tr>
                )
            })}


          </tbody>
        </table>
      </div>

      <div className="table-section">
        <div className="table-header">
          <h3>Recent Orders</h3>
        </div>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Adress</th>
              <th>Phone</th>
              <th>City</th>
              <th>Products</th>
              <th>TotalAmount</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => {
                return (
                    <tr key={order.idOrder}>
                    <td>{order.name}</td>
                    <td>{order.address}</td>
                    <td>{order.phone}</td>
                    <td>{order.city}</td>
                    <td>{order.products.map((p) => {
                        return(<>
                            <div key={p.id}>
                              <p>{p.name}</p>
                              <p>{p.size}</p>
                          </div>
                        </>)
                    })}</td>
                    <td>{order.totalAmount}</td>
                    <td><button className="status active" onClick={() => handleUpdateOrderStatus(order.idOrder)}>{order.status}</button></td>
                    </tr>
                )
            })}


          </tbody>
        </table>
      </div>

    </div>
  );
}

export default DashboardHome;
