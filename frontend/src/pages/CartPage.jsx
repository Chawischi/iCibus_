import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TimerPedido from '../components/TimerPedido';
import {
    checkoutCart,
    fetchCartData,
    updateCartItemQuantity,
    removeCartItem,
} from '../services/cartServices';

const CartPage = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showTimer, setShowTimer] = useState(false);

    const navigate = useNavigate();
    const DELIVERY_FEE = 10.0;

    const fetchCart = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const data = await fetchCartData(token);
            setCart(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const updateQuantity = async (itemId, quantity) => {
        if (quantity < 1) return;
        try {
            const token = localStorage.getItem('token');
            await updateCartItemQuantity(itemId, quantity, token);
            fetchCart();
        } catch (err) {
            alert(err.message);
        }
    };

    const removeItem = async (itemId) => {
        try {
            const token = localStorage.getItem('token');
            await removeCartItem(itemId, token);
            fetchCart();
        } catch (err) {
            alert(err.message);
        }
    };

    const checkout = async () => {
        try {
            const token = localStorage.getItem('token');
            await checkoutCart(token);
            setShowTimer(true);
            setCart(null);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleTimerFinish = () => {
        navigate('/');
    };

    if (showTimer) {
        return (
            <div className="min-h-screen flex justify-center bg-white pt-[100px]">
                <TimerPedido duracaoTotal={11} onFinish={handleTimerFinish} />
            </div>
        );
    }

    if (loading) return <p>Carregando carrinho...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    const totalItems = cart?.items?.reduce(
        (acc, item) => acc + item.product.preco * item.quantity,
        0
    ) || 0;
    const totalOrder = totalItems + DELIVERY_FEE;

    return (
        <div className="max-w-6xl mx-auto p-6 flex flex-col md:flex-row gap-8">
            <div className="flex-1">
                <h1 className="text-4xl mb-8 font-extrabold flex items-center gap-3">
                    <span role="img" aria-label="Carrinho">🛒</span>
                    Meu Carrinho
                </h1>

                {(!cart || !cart.items || cart.items.length === 0) && (
                    <div className="text-center text-gray-700 text-xl font-semibold italic py-12 border border-dashed border-gray-300 rounded-md">
                        🛒 Seu carrinho está vazio.
                        <div className="mt-6">
                            <a
                                href="/"
                                className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
                            >
                                Adicionar itens
                            </a>
                        </div>
                    </div>
                )}

                {cart?.items?.length > 0 && cart.items.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center gap-6 p-5 mb-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow min-h-[120px]"
                    >
                        <img
                            src={
                                item.product?.imagem
                                    ? `http://localhost:3000/uploads/${item.product.imagem}`
                                    : 'https://via.placeholder.com/100x80?text=Sem+imagem'
                            }
                            alt={item.product?.nome || ''}
                            className="w-28 h-24 object-cover rounded-md flex-shrink-0"
                        />
                        <div className="flex-1 flex flex-col justify-between h-full">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h2 className="font-semibold text-lg">{item.product?.nome}</h2>
                                    {item.product?.restauranteNome && (
                                        <span className="text-xs bg-yellow-300 text-yellow-900 font-semibold px-2 py-0.5 rounded-full select-none">
                                            {item.product.restauranteNome}
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-700 mb-2">Preço: R$ {Number(item.product?.preco || 0).toFixed(2)}</p>
                            </div>
                            <div>
                                <label className="font-semibold block mb-1">Quantidade:</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))}
                                    className="border rounded w-20 text-center py-1 h-9"
                                />
                            </div>
                        </div>
                        <button
                            onClick={() => removeItem(item.id)}
                            className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 transition"
                            aria-label={`Remover ${item.product?.nome}`}
                        >
                            Remover
                        </button>
                    </div>
                ))}
            </div>

            <aside className="w-full md:w-80 p-6 bg-white rounded-lg shadow-md border border-gray-200 flex flex-col gap-6">
                <h2 className="text-2xl font-bold mb-4">Resumo do pedido</h2>
                <div className="flex justify-between text-gray-700">
                    <span>Total dos itens:</span>
                    <span>R$ {totalItems.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                    <span>Taxa de entrega:</span>
                    <span>R$ {DELIVERY_FEE.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t border-gray-300 pt-4">
                    <span>Total:</span>
                    <span>R$ {totalOrder.toFixed(2)}</span>
                </div>

                <button
                    onClick={checkout}
                    disabled={!cart?.items?.length}
                    className={`px-6 py-3 rounded text-white font-semibold transition
            ${cart?.items?.length
                            ? 'bg-green-600 hover:bg-green-700 cursor-pointer'
                            : 'bg-gray-400 cursor-not-allowed'
                        }
          `}
                    aria-disabled={!cart?.items?.length}
                >
                    Finalizar Compra
                </button>
            </aside>
        </div>
    );
};

export default CartPage;
