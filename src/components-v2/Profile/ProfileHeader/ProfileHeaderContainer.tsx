import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {ProfileHeaderComponent} from '.';
import {User, Report} from '../../../interfaces/user';
import {setTippedUserId} from '../../../reducers/wallet/actions';
import {SendTipContainer} from '../../SendTip/';

import {Modal} from 'src/components-v2/atoms/Modal';
import {useFriendHook} from 'src/components/profile/use-profile-friend.hook';
import {useProfileHook} from 'src/components/profile/use-profile.hook';
import {FriendStatus} from 'src/interfaces/friend';
import {RootState} from 'src/reducers';
import {ProfileState} from 'src/reducers/profile/reducer';
import {UserState} from 'src/reducers/user/reducer';

type Props = {
  edit?: () => void;
};

export const ProfileHeaderContainer: React.FC<Props> = ({edit}) => {
  const {
    detail: profile,
    friends: {
      meta: {totalItemCount: totalFriends},
    },
    experience: {
      meta: {totalItemCount: totalExperience},
    },
  } = useSelector<RootState, ProfileState>(state => state.profileState);
  const {user} = useSelector<RootState, UserState>(state => state.userState);

  const dispatch = useDispatch();

  const {friendStatus, makeFriend, checkFriendStatus, removeFriendRequest, toggleRequest} =
    useFriendHook();
  const {reportUser} = useProfileHook();

  const [tippedUser, setTippedUser] = useState<User | null>(null);
  const sendTipOpened = Boolean(tippedUser);

  const isOwnProfile = profile?.id === user?.id;

  const urlLink = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return '';
  };

  useEffect(() => {
    if (profile) {
      checkFriendStatus(profile.id);
    }
  }, [profile]);

  const sendFriendReqest = () => {
    if (!profile) return;

    makeFriend(profile);
  };

  const declineFriendRequest = () => {
    if (!friendStatus) return;

    removeFriendRequest(friendStatus);
  };

  if (!user) return null;

  const closeSendTip = () => {
    setTippedUser(null);
  };

  if (!profile) return null;

  const handleSendTip = () => {
    setTippedUser(profile);
    dispatch(setTippedUserId(profile.id));
  };

  const handleSubmit = (payload: Partial<Report>) => {
    reportUser(payload);
  };

  const handleBlockUser = () => {
    if (friendStatus) {
      toggleRequest(friendStatus, FriendStatus.BLOCKED);
    }
  };

  return (
    <>
      <ProfileHeaderComponent
        user={profile}
        selfProfile={isOwnProfile}
        status={friendStatus}
        totalFriends={totalFriends}
        totalExperience={totalExperience}
        onSendRequest={sendFriendReqest}
        onDeclineRequest={declineFriendRequest}
        onSendTip={handleSendTip}
        onBlock={handleBlockUser}
        onEdit={edit}
        linkUrl={`${urlLink()}/profile/${profile.id}`}
        onSubmit={handleSubmit}
      />
      <Modal
        gutter="none"
        open={sendTipOpened}
        onClose={closeSendTip}
        title="Send Tip"
        subtitle="Finding this post is insightful? Send a tip!">
        <SendTipContainer />
      </Modal>
    </>
  );
};
