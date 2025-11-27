export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  isNew?: boolean;
  collection?: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export enum Page {
  HOME = 'home',
  SHOP = 'shop',
  PRODUCT = 'product',
  CART = 'cart',
  CHECKOUT_SUCCESS = 'checkout_success',
  ACCOUNT = 'account',
  ABOUT = 'about',
  CONTACT = 'contact',
  JOURNAL = 'journal',
  SUSTAINABILITY = 'sustainability',
  CAREERS = 'careers',
  PRESS = 'press',
  // Auth Pages
  LOGIN = 'login',
  SIGNUP = 'signup',
  FORGOT_PASSWORD = 'forgot_password',
  NEW_PASSWORD = 'new_password',
}