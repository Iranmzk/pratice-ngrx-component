import {Product} from './products';
import {Injectable} from '@angular/core';
import {ComponentStore} from '@ngrx/component-store';

/* It's defining the shape of the state. */
export interface ProductsState {
  collection: Product[];
  currentProductId: string | null;
}

/* Setting the initial state of the store. */
export const initialState: ProductsState = {
  collection: [],
  currentProductId: null,
};

/* It's creating a new class called ProductStore, and it's extending the ComponentStore class. */
@Injectable()
export class ProductStore extends ComponentStore<ProductsState> {
  products$ = this.select(state => state.collection)
  currentProductId$ = this.select(state => state.currentProductId)
  currentProduct$ = this.select(
    this.products$,
    this.currentProductId$,
    (products, id) => products.find(prod => prod.id === id)
  );

  constructor() {
    super(initialState);
  }

  /**
   * We're creating a new array that contains all the products in the collection, and then we're adding the new product to
   * the end of that array
   * @param {Product} product - Product - this is the product that we want to add to the collection
   */
  addProduct(product: Product) {
    this.setState((state) => {
      return {
        ...state,
        collection: [...state.collection, product],
      };
    });
  }

  /**
   * It takes a productId as a parameter, and then it patches the state with the currentProductId
   * @param {string} productId - string
   */
  selectProduct(productId: string | null) {
    this.patchState({
      currentProductId: productId,
    });
  }

  /* Updating the state. */
  updateProduct = this.updater((state: ProductsState, product: Product) => {
    return {
      ...state,
      collection: state.collection.map((prod) => {
        if (product.id === prod.id) {
          return product;
        }
        return prod;
      }),
    };
  });

  /* A function that is updating the state. */
  deleteProduct = this.updater((state: ProductsState, productId: string) => {
    return {
      ...state,
      collection: state.collection.filter((product) => {
        return product.id !== productId;
      }),
    };
  });
}
