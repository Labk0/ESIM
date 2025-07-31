import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ProductList from './components/ProductList';
import Checkout from './components/Checkout/Checkout.tsx';
import { CartProvider } from './context/CartContext';
import SideCart from './components/SideCart';
import Home from './components/Home';

const StoreLayout = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-2">
            <ProductList />
        </div>
        <div className="lg:col-span-1">
            <SideCart />
        </div>
    </div>
);

function App() {
    return (
        <CartProvider>
            <Router>
                <div className="min-h-screen bg-gray-50">
                    <Header />
                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/products" element={<StoreLayout />} />
                            <Route path="/checkout" element={<Checkout />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </CartProvider>
    );
}

export default App;