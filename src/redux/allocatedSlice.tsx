import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type Allocated = {
  id: string;
  items: string;
  quantity: number;
  unitPrice: number;
};

export type AllocatedArrayType = Allocated[];

const initialState: AllocatedArrayType = [];

export const AllocatedSlice = createSlice({
  name: "allocatedBudget",
  initialState,
  reducers: {
    clearCart: (state: AllocatedArrayType) => {
      state.length = 0;

      // let array: number[] = [];
    },
    allocate: (state: AllocatedArrayType, action: PayloadAction<Allocated>) => {
      state.push(action.payload);

      // let array: number[] = [];
    },
    deleteItem: (state: AllocatedArrayType, action: PayloadAction<string>) => {
      // console.log("payload" + state[0]);
      const filtered = state.filter((element) => {
        return element.id !== action.payload;
      });
      return filtered;
    },
    increaseQuantity: (
      state: AllocatedArrayType,
      action: PayloadAction<string>
    ) => {
      return state.map((element) => {
        if (element.id === action.payload) {
          return {
            ...element,
            quantity: element.quantity + 1,
          };
          //return element;
        } else {
          return element;
        }
      });

      // console.log(newAllocated);
    },
    decreaseQuantity: (
      state: AllocatedArrayType,
      action: PayloadAction<string>
    ) => {
      return state.map((element) => {
        if (element.id === action.payload) {
          return {
            ...element,
            quantity: element.quantity - 1,
          };
          //return element;
        } else {
          return element;
        }
      });

      // console.log(newAllocated);
    },
  },
});

export default AllocatedSlice.reducer;
export const {
  allocate,
  deleteItem,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = AllocatedSlice.actions;
export type AllocatedSliceType = ReturnType<
  typeof AllocatedSlice.getInitialState
>;
