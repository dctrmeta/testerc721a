// log
import store from "../store";

const fetchDataRequest = () => {
  return {
    type: "CHECK_DATA_REQUEST",
  };
};

const fetchDataSuccess = (payload) => {
  return {
    type: "CHECK_DATA_SUCCESS",
    payload: payload,
  };
};

const fetchDataFailed = (payload) => {
  return {
    type: "CHECK_DATA_FAILED",
    payload: payload,
  };
};

export const fetchData = () => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {
      let totalSupply = await store
        .getState()
        .blockchain.smartContract.methods.totalSupply()
        .call();
      let cost = await store
        .getState()
        .blockchain.smartContract.methods.cost()
        .call();

      let isWl = await store
        .getState()
        .blockchain.smartContract.methods._isFuckListActive()
        .call()
      
      // let numAvailableToMint = await store
      //   .getState()
      //   .blockchain.smartContract.methods.numAvailableToMint()
      //   .call

      dispatch(
        fetchDataSuccess({
          totalSupply,
          cost,
          isWl, //
          // numAvailableToMint, //
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
};
