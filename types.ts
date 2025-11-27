
export interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  images?: string[]; // Added support for gallery images
  category: string;
  isNew?: boolean;
  collection?: string;
  colors?: string[];
  reviews?: Review[];
  description?: string;
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
  // Policy & Guide Pages
  SHIPPING = 'shipping',
  CARE_INSTRUCTIONS = 'care_instructions',
  SIZE_GUIDE = 'size_guide',
  PRIVACY = 'privacy',
  TERMS = 'terms',
}
