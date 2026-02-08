import Layout from "./Layout.jsx";

import Home from "./Home";

import Register from "./Register";

import Design from "./Design";

import Mockup from "./Mockup";

import Checkout from "./Checkout";

import Orders from "./Orders";

import OrderDetails from "./OrderDetails";

import MyDesigns from "./MyDesigns";

import SignIn from "./SignIn";

import Shop from "./Shop";

import Cart from "./Cart";

import Contact from "./Contact";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    Register: Register,
    
    Design: Design,
    
    Mockup: Mockup,
    
    Checkout: Checkout,
    
    Orders: Orders,
    
    OrderDetails: OrderDetails,
    
    MyDesigns: MyDesigns,
    
    SignIn: SignIn,

    Shop: Shop,

    Cart: Cart,

    Contact: Contact,

}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/Register" element={<Register />} />
                
                <Route path="/Design" element={<Design />} />
                
                <Route path="/Mockup" element={<Mockup />} />
                
                <Route path="/Checkout" element={<Checkout />} />
                
                <Route path="/Orders" element={<Orders />} />
                
                <Route path="/OrderDetails" element={<OrderDetails />} />
                
                <Route path="/MyDesigns" element={<MyDesigns />} />
                
                <Route path="/SignIn" element={<SignIn />} />

                <Route path="/Shop" element={<Shop />} />

                <Route path="/Cart" element={<Cart />} />

                <Route path="/Contact" element={<Contact />} />

            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}