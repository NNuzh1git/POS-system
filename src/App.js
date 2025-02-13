import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";

// Страница Меню
const MenuPage = ({ menu, categories, setCategory, category, addToOrder }) => {
  return (
    <div className="menu-container">
      <header className="pos-header">Меню</header>
      <div className="category-filter">
        {categories.map((cat) => (
          <button
            key={cat}
            className={category === cat ? "active" : ""}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="menu-section">
        <div className="menu-items">
          {menu.filter(item => category === "All" || item.category === category).map((item) => (
            <div key={item.id} className="menu-item-card">
              <h4>{item.name}</h4>
              <p>${item.price}</p>
              <button onClick={() => addToOrder(item)} className="add-btn">
                Добавить в заказ
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Страница Сделать заказ
const CreateOrderPage = ({ 
  menu, 
  addToOrder, 
  order, 
  removeFromOrder, 
  total, 
  tableNumber, 
  setTableNumber, 
  orderNumber, 
  setOrderNumber, 
  completeOrder, 
  category, 
  setCategory 
}) => {
  const tableButtons = Array.from({ length: 5 }, (_, index) => index + 1); // Столы 1-5

  return (
    <div className="create-order-container">
      <div className="order-section">
        <div className="table-selection">
          <label>Выберите стол: </label>
          <div className="table-buttons">
            {tableButtons.map((number) => (
              <button
                key={number}
                className={tableNumber === number ? "active" : ""}
                onClick={() => setTableNumber(number)}
              >
                Стол {number}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="menu-section">
        <div className="category-filter">
          <h3>Выберите категорию:</h3>
          <button className={category === "All" ? "active" : ""} onClick={() => setCategory("All")}>Все</button>
          <button className={category === "Drinks" ? "active" : ""} onClick={() => setCategory("Drinks")}>Напитки</button>
          <button className={category === "Soups" ? "active" : ""} onClick={() => setCategory("Soups")}>Супы</button>
          <button className={category === "Fast Food" ? "active" : ""} onClick={() => setCategory("Fast Food")}>Фастфуд</button>
          <button className={category === "Dishes" ? "active" : ""} onClick={() => setCategory("Dishes")}>Блюда</button>
        </div>

        <div className="menu-items">
          {menu.filter(item => category === "All" || item.category === category).map((item) => (
            <div key={item.id} className="menu-item-card">
              <h4>{item.name}</h4>
              <p>${item.price}</p>
              <button onClick={() => addToOrder(item)} className="add-btn">
                Добавить в заказ
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="order-section">
        <h2>Состав заказа</h2>
        <ul className="order-list">
          {order.map((item) => (
            <li key={item.id} className="order-item">
              {item.name} - ${item.price} x {item.quantity}
              <button className="remove-btn" onClick={() => removeFromOrder(item.id)}>Удалить</button>
            </li>
          ))}
        </ul>
        <h3>Итого: ${total}</h3>
        {order.length > 0 && <button className="complete-btn" onClick={completeOrder}>Завершить заказ</button>}
      </div>
    </div>
  );
};

// Страница История заказов
const OrderHistoryPage = ({ orderHistory }) => {
  return (
    <div className="order-history">
      <header className="pos-header">История заказов</header>
      <ul className="history-list">
        {orderHistory.slice().reverse().map((history) => (
          <li key={history.orderNumber} className="history-item">
            <h3>Заказ #{history.orderNumber} (Стол {history.tableNumber})</h3>
            <p>Дата: {history.date}</p>
            <ul>
              {history.items.map((item) => (
                <li key={item.id}>
                  {item.name} - ${item.price} x {item.quantity}
                </li>
              ))}
            </ul>
            <p>Итого: ${history.total}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

function App() {
  const [order, setOrder] = useState([]);
  const [total, setTotal] = useState(0);
  const [tableNumber, setTableNumber] = useState(1);
  const [orderNumber, setOrderNumber] = useState(1);
  const [category, setCategory] = useState("All");
  const [orderHistory, setOrderHistory] = useState([]);

  const menu = [
    { id: 1, name: "Cola", price: 2, category: "Drinks" },
    { id: 2, name: "Coffee", price: 3, category: "Drinks" },
    { id: 3, name: "Soup", price: 5, category: "Soups" },
    { id: 4, name: "Burger", price: 6, category: "Fast Food" },
    { id: 5, name: "Pizza", price: 8, category: "Fast Food" },
    { id: 6, name: "Pasta", price: 7, category: "Dishes" },
    { id: 7, name: "Salad", price: 4, category: "Dishes" },
  ];

  const categories = ["All", "Drinks", "Soups", "Fast Food", "Dishes"];

  const addToOrder = (item) => {
    const existingItem = order.find((orderItem) => orderItem.id === item.id);
    if (existingItem) {
      setOrder(
        order.map((orderItem) =>
          orderItem.id === item.id
            ? { ...orderItem, quantity: orderItem.quantity + 1 }
            : orderItem
        )
      );
    } else {
      setOrder([...order, { ...item, quantity: 1 }]);
    }
    setTotal(total + item.price);
  };

  const removeFromOrder = (id) => {
    const existingItem = order.find((orderItem) => orderItem.id === id);
    if (existingItem.quantity > 1) {
      setOrder(
        order.map((orderItem) =>
          orderItem.id === id
            ? { ...orderItem, quantity: orderItem.quantity - 1 }
            : orderItem
        )
      );
      setTotal(total - existingItem.price);
    } else {
      setOrder(order.filter((orderItem) => orderItem.id !== id));
      setTotal(total - existingItem.price);
    }
  };

  const completeOrder = () => {
    setOrderHistory([ ...orderHistory, { orderNumber, tableNumber, items: order, total, date: new Date().toLocaleString() } ]);

    // Создание чека
    const receiptWindow = window.open('', '_blank', 'width=350,height=600');
    receiptWindow.document.write(`
      <html>
      <head>
        <title>Чек - Ресторан Дасмия</title>
        <style>
          .print-receipt {
            width: 300px;
            font-family: Arial, sans-serif;
            font-size: 16px;
            line-height: 1.5;
            margin: 0 auto;
            padding: 10px;
            text-align: left;
            border: 1px solid #000;
            box-sizing: border-box;
          }
          .print-receipt h2, .print-receipt p {
            margin: 0;
            padding: 5px 0;
          }
          .print-receipt .separator {
            border-top: 1px dashed #000;
            margin: 10px 0;
          }
          .print-receipt .total, .print-receipt .payment {
            font-weight: bold;
          }
          .print-receipt .amount {
            font-size: 18px;
            text-align: right;
          }
        </style>
      </head>
      <body>
        <div class="print-receipt">
          <h2>Ресторан - Дасмия</h2>
          <p>Квитанция об оплате заказа</p>
          <p>Дата: ${new Date().toLocaleString()}</p>
          <p>Номер заказа: #${orderNumber}</p>
          <p>Стол: №${tableNumber}</p>
          <div class="separator"></div>
          
          <div>
            <p>Наименование        Кол-во х Цена  Сумма</p>
            <div class="separator"></div>
            ${order.map(item => `
              <p>${item.name}       ${item.quantity} х $${item.price}    $${item.price * item.quantity}</p>
            `).join('')}
          </div>

          <div class="separator"></div>
          <p class="total">ИТОГ К ОПЛАТЕ: $${total}</p>
          <div class="separator"></div>
          <p class="payment">Наличные: $10</p>
          <p class="amount">Сдача: $4</p>
        </div>
      </body>
      </html>
    `);
    receiptWindow.document.close();

    // Печать чека
    receiptWindow.print();

    alert(`Заказ #${orderNumber} для стола ${tableNumber} завершен! Итого: $${total}`);
    setOrder([]);
    setTotal(0);
    setOrderNumber(orderNumber + 1);
  };

  return (
    <Router>
      <div className="pos-container">
        <header className="pos-header">
          <nav>
            <Link to="/">Меню</Link> | <Link to="/order">Сделать заказ</Link> | <Link to="/history">История заказов</Link>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<MenuPage menu={menu} categories={categories} setCategory={setCategory} category={category} addToOrder={addToOrder} />} />
          <Route path="/order" element={<CreateOrderPage menu={menu} addToOrder={addToOrder} order={order} removeFromOrder={removeFromOrder} total={total} tableNumber={tableNumber} setTableNumber={setTableNumber} orderNumber={orderNumber} setOrderNumber={setOrderNumber} completeOrder={completeOrder} category={category} setCategory={setCategory} />} />
          <Route path="/history" element={<OrderHistoryPage orderHistory={orderHistory} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
