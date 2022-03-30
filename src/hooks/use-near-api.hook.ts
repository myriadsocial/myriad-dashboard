import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {
  nearInitialize,
  connectToNearWallet,
  getNearBalance,
  NearConnectResponseProps,
  NearBalanceProps,
} from 'src/lib/services/near-api-js';
import {RootState} from 'src/reducers';
import {fetchBalances} from 'src/reducers/balance/actions';
import {BalanceState} from 'src/reducers/balance/reducer';
import {UserState} from 'src/reducers/user/reducer';

export const useNearApi = () => {
  const dispatch = useDispatch();

  const {anonymous, currencies} = useSelector<RootState, UserState>(state => state.userState);
  const {balanceDetails} = useSelector<RootState, BalanceState>(state => state.balanceState);

  useEffect(() => {
    if (!anonymous && currencies.length > 0 && balanceDetails.length === 0) {
      dispatch(fetchBalances());
    }
  }, [anonymous, currencies, balanceDetails]);

  const connectToNear = async (): Promise<NearConnectResponseProps> => {
    const {near, wallet} = await nearInitialize();
    const data = connectToNearWallet(near, wallet);

    return data;
  };

  const getNearBalanceDetail = async (): Promise<NearBalanceProps> => {
    const {near, wallet} = await nearInitialize();
    const balance = getNearBalance(near, wallet.getAccountId());
    return balance;
  };

  return {
    connectToNear,
    getNearBalanceDetail,
    balanceDetails,
  };
};
