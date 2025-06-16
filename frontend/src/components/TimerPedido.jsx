import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { CheckCircle, Clock, Truck } from 'lucide-react';

const fases = [
    { label: 'Preparando Pedido', icon: <Clock size={48} />, tempo: 0 },
    { label: 'Saiu para Entrega', icon: <Truck size={48} />, tempo: 5 },
    { label: 'Pedido Entregue', icon: <CheckCircle size={48} />, tempo: 10 },
];

const TimerPedido = ({ duracaoTotal = 11, onFinish }) => {
    const [tempo, setTempo] = useState(0);

    useEffect(() => {
        const intervalo = setInterval(() => {
            setTempo((prev) => {
                if (prev >= duracaoTotal) {
                    clearInterval(intervalo);
                    if (onFinish) onFinish(); // <-- Aqui só chamamos a função passada
                    return duracaoTotal;
                }
                return prev + 1;
            });
        }, 1000);

        return () => clearInterval(intervalo);
    }, [duracaoTotal, onFinish]);

    const faseAtual = () => {
        if (tempo >= 10) return 2;
        if (tempo >= 5) return 1;
        return 0;
    };

    return (
        <div className="flex justify-around items-center p-4 bg-white rounded-xl shadow-md w-full max-w-2xl mx-auto h-[150px]">
            {fases.map((fase, index) => {
                const isActive = faseAtual() >= index;

                return (
                    <div key={index} className="flex flex-col items-center text-center">
                        <div
                            className={`rounded-full p-4 transition-all duration-500 ${
                                isActive ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                            }`}
                        >
                            {fase.icon}
                        </div>
                        <p className={`mt-2 font-medium text-sm ${isActive ? 'text-green-600' : 'text-gray-500'}`}>
                            {fase.label}
                        </p>
                    </div>
                );
            })}
        </div>
    );
};

TimerPedido.propTypes = {
    duracaoTotal: PropTypes.number,
    onFinish: PropTypes.func,
};

export default TimerPedido;
