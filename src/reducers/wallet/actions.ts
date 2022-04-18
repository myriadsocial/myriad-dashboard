import {acronym} from '../../helpers/string';
import {Actions as BaseAction, setLoading, setError} from '../base/actions';
import {RootState} from '../index';
import * as constants from './constants';

import {Action} from 'redux';
import {WalletDetail} from 'src/interfaces/wallet';
import * as PostAPI from 'src/lib/api/post';
import * as UserAPI from 'src/lib/api/user';
import {ThunkActionCreator} from 'src/types/thunk';

/**
 * Action Types
 */

export interface FetchRecipientDetail extends Action {
  type: constants.FETCH_RECIPIENT_DETAIL;
  payload: WalletDetail;
}

export interface SetRecipientDetail extends Action {
  type: constants.SET_RECIPIENT_DETAIL;
  recipientDetail: WalletDetail;
}

export interface SetTippedUserId extends Action {
  type: constants.SET_TIPPED_USER_ID;
  tippedUserId: string;
}

export interface SetTippedUser extends Action {
  type: constants.SET_TIPPED_USER;
  payload: {
    name: string;
    profilePictureURL: string;
  };
}

export interface SetIsTipSent extends Action {
  type: constants.SET_IS_TIP_SENT;
  isTipSent: boolean;
}

export interface SetFee extends Action {
  type: constants.SET_FEE;
  fee: string | null;
}
export interface SetExplorerURL extends Action {
  type: constants.SET_EXPLORER_URL;
  explorerURL: null | string;
}

/**
 * Union Action Types
 */

export type Actions =
  | FetchRecipientDetail
  | SetRecipientDetail
  | SetTippedUserId
  | SetTippedUser
  | SetIsTipSent
  | SetFee
  | SetExplorerURL
  | BaseAction;

/**
 *
 * Actions
 */

export const setRecipientDetail = (recipientDetail: WalletDetail): SetRecipientDetail => ({
  type: constants.SET_RECIPIENT_DETAIL,
  recipientDetail,
});

export const setTippedUserId = (tippedUserId: string): SetTippedUserId => ({
  type: constants.SET_TIPPED_USER_ID,
  tippedUserId,
});

export const setTippedUser = (name: string, profilePictureURL: string): SetTippedUser => ({
  type: constants.SET_TIPPED_USER,
  payload: {
    name,
    profilePictureURL,
  },
});

export const setIsTipSent = (isTipSent: boolean): SetIsTipSent => ({
  type: constants.SET_IS_TIP_SENT,
  isTipSent,
});

export const setFee = (fee: string | null): SetFee => ({
  type: constants.SET_FEE,
  fee,
});
export const setExplorerURL = (explorerURL: null | string): SetExplorerURL => ({
  type: constants.SET_EXPLORER_URL,
  explorerURL,
});

/**
 * Action Creator
 */

export const fetchRecipientDetail: ThunkActionCreator<Actions, RootState> =
  (postId: string) => async dispatch => {
    dispatch(setLoading(true));

    try {
      const walletDetail = await PostAPI.getWalletAddress(postId);

      dispatch(setRecipientDetail(walletDetail));
    } catch (error) {
      dispatch(setError(error));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const fetchTippedUserId: ThunkActionCreator<Actions, RootState> =
  (postId: string) => async (dispatch, getState) => {
    const {
      timelineState: {posts, post},
    } = getState();

    dispatch(setLoading(true));

    try {
      const walletDetail = await PostAPI.getWalletAddress(postId);

      // when tipping on dedicated post page
      if (post) {
        const {people, user} = post;
        if (people) {
          dispatch(setTippedUser(people.name, people.profilePictureURL));
        } else {
          dispatch(setTippedUser(user.name, user.profilePictureURL ?? acronym(user.name)));
        }
      }

      // when tipping on timeline
      if (posts.length) {
        const tippablePosts = posts;

        const {people} = tippablePosts.find(post => post.id === postId) ?? {};
        if (people) {
          dispatch(setTippedUser(people.name, people.profilePictureURL));
        } else {
          const user = await UserAPI.getUserDetail(walletDetail.referenceId);
          dispatch(setTippedUser(user.name, user.profilePictureURL ?? acronym(user.name)));
        }
      }

      dispatch(setTippedUserId(walletDetail.referenceId));
    } catch (error) {
      dispatch(setError(error));
    } finally {
      dispatch(setLoading(false));
    }
  };