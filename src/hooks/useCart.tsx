import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
     const storagedCart = localStorage.getItem('@RocketShoes:cart');

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try { //Verificar se o produto existe no carrinho para incrementar a quantidade, e verificar a quantidade no estoque
      const updatedCart = [...cart] // conceito de imutabilidade
      const productExists = updatedCart.find(product => productId === productId) // verificando se o produto existe no cart
      const stock = await api.get(`/stock/${productId}`) // pegando o elemento na API pelo ID que foi passado no parametro
      const stockAmount = stock.data.amount; // .data vem do Axios pois está recebendo uma promisse
      const currentAmount = productExists ? productExists.amount : 0; // se não existir, o amount é 0
      const amount = currentAmount + 1

      if(amount > stockAmount){
        toast.error('Quantidade solicitada fora de estoque'); // erro caso estoure a quantidade 
        return;
      }

      if(productExists){
        productExists.amount = amount // adicionando 1 ao total de produto
      } else {
        const product = await api.get(`/products/${productId}`)

        const newProduct = {
          ...product.data, 
          amount: 1
        } // Lembrar de sempre usar o Data para visualizar dados de promisses
        updatedCart.push(newProduct)
      }

      setCart(updatedCart) // Atribuindo o carrinho atualizado ao estado
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(updatedCart))  // utilizando o LocalStorage para atualizar o banco de dados
    } catch {
      toast.error('Erro na adição do produto');
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
