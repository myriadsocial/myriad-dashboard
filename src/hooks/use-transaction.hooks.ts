import {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {TransactionOrderType} from 'src/interfaces/transaction';
import {RootState} from 'src/reducers';
import {
  fetchTransactions,
  setTransactionFilter,
  setTransactionSort,
  TransactionFilterProps,
} from 'src/reducers/transaction/actions';
import {TransactionState} from 'src/reducers/transaction/reducer';
import {UserState} from 'src/reducers/user/reducer';

export const useTransaction = () => {
  const dispatch = useDispatch();
  const {user, currentWallet} = useSelector<RootState, UserState>(state => state.userState);
  const {transactions, meta, filter, loading} = useSelector<RootState, TransactionState>(
    state => state.transactionState,
  );
  const [error, setError] = useState(null);

  useEffect(() => {
    currentWallet && loadTransactions();
  }, [currentWallet]);

  const loadTransactions = async (page?: number) => {
    const currentPage = page ? page : 1;

    if (!user) return;

    try {
      dispatch(fetchTransactions(currentPage));
    } catch (error) {
      setError(error);
    }
  };

  const filterTransaction = async (filter: TransactionFilterProps) => {
    await dispatch(setTransactionFilter(filter));

    loadTransactions();
  };

  const sortTransaction = async (sort: TransactionOrderType) => {
    await dispatch(setTransactionSort(sort));

    loadTransactions();
  };

  return {
    error,
    loading,
    meta,
    hasMore: meta.currentPage < meta.totalPageCount,
    filter,
    transactions: transactions.filter(tx => !!tx.currency),
    loadTransactions,
    filterTransaction,
    sortTransaction,
  };
};
