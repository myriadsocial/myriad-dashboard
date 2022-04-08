import React from 'react';

import useConfirm from '../common/Confirm/use-confirm.hook';
import useTipping from '../common/Tipping/use-tipping.hook';
import {TipHistory} from './TipHistory';

import {useTipHistory} from 'src/hooks/tip-history.hook';
import {ReferenceType} from 'src/interfaces/interaction';
import {People} from 'src/interfaces/people';
import {User} from 'src/interfaces/user';
import {WalletReferenceType} from 'src/interfaces/wallet';
import * as PostAPI from 'src/lib/api/post';

type TipHistoryContainerProps = {
  referenceType: ReferenceType;
};

export const TipHistoryContainer: React.FC<TipHistoryContainerProps> = props => {
  const {referenceType} = props;

  const tipping = useTipping();
  const confirm = useConfirm();

  const {
    isTipHistoryOpen,
    hasMore,
    reference,
    tippingDisabled,
    currencies,
    transactions,
    closeTipHistory,
    handleFilterTransaction,
    handleSortTransaction,
    handleLoadNextPage,
  } = useTipHistory();

  const handleSendTip = async () => {
    if (!reference) return;

    let receiver: User | People | null = null;

    // if tipping to User
    if ('username' in reference) {
      receiver = reference;
    }

    // if tipping to Comment
    if ('section' in reference) {
      receiver = reference.user;
    }

    // if tipping to Post
    if ('platform' in reference) {
      // if imported
      if (reference.people) {
        try {
          const {referenceId, referenceType} = await PostAPI.getWalletAddress(reference.id);

          if (referenceType === WalletReferenceType.WALLET_ADDRESS) {
            receiver = {...reference.people, walletAddress: referenceId};
          }
        } catch {
          confirm({
            title: 'Send tip on imported post is unavailable',
            description:
              'Currently, send tip on imported post is under repair. Please try again later',
            icon: 'warning',
            confirmationText: 'close',
          });
        }
      } else {
        receiver = reference.user;
      }
    }

    if (!receiver) return;

    tipping.send({
      receiver,
      reference,
      referenceType,
    });
  };

  return (
    <TipHistory
      open={isTipHistoryOpen}
      hasMore={hasMore}
      currencies={currencies}
      tippingDisabled={tippingDisabled}
      tips={transactions.filter(tx => Boolean(tx.currency))}
      sendTip={handleSendTip}
      onClose={closeTipHistory}
      onSort={handleSortTransaction}
      onFilter={handleFilterTransaction}
      nextPage={handleLoadNextPage}
    />
  );
};

export default TipHistoryContainer;
