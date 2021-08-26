import React, {useState, useEffect} from 'react';

import DividerComponent from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import {useFriendsHook} from '../../hooks/use-friends-hook';
import FriendListComponent from './friend-list.component';
import FriendRequestComponent from './friend-requests.component';
import {useStyles} from './friend.style';

import {debounce} from 'lodash';
import SearchComponent from 'src/components/common/search.component';
import {useExperienceHook} from 'src/hooks/use-experience-hook';

interface FriendComponentProps {
  title?: string;
}

const FriendComponent: React.FC<FriendComponentProps> = ({title}) => {
  const style = useStyles();

  const [expandFriends, setExpandFriends] = useState(true);
  const [expandRequest, setExpandRequest] = useState(true);
  const [showAllRequest, setShowAllRequest] = useState(false);

  const [search, setSearchQuery] = useState('');

  const [searchExpQuery, setSearchExpQuery] = useState('');

  const {
    searchFriend,
    loadFriends,
    loadMoreFriends,
    loadRequests,
    loadMoreRequests,
    toggleRequest,
  } = useFriendsHook();

  const {loadExperience, searchExperience} = useExperienceHook();

  useEffect(() => {
    loadFriends();
    loadRequests();

    loadExperience();
  }, []);

  const handleSearchFriend = debounce((query: string) => {
    setSearchQuery(query);

    if (query.length) {
      searchFriend(query);
    } else {
      loadFriends();
    }
  }, 300);

  const onExpandFriendRequest = () => {
    setExpandRequest(!expandRequest);
    setShowAllRequest(false);
  };

  const onShowAllFriendRequest = () => {
    setShowAllRequest(true);
    setExpandRequest(true);
    setExpandFriends(false);
  };

  const onFriendlistExpanded = (closeOthers: boolean) => {
    setExpandFriends(!expandFriends);

    if (closeOthers) {
      setExpandRequest(false);
      setShowAllRequest(false);
    } else {
      setShowAllRequest(false);
    }
  };

  const handleSearchExperience = debounce((query: string) => {
    setSearchExpQuery(query);

    if (query.length) {
      searchExperience(query);
    } else {
      loadExperience();
    }
  }, 500);

  return (
    <div className={style.root}>
      <div className={style.header}>
        <SearchComponent
          value={searchExpQuery}
          placeholder="Find an experience"
          onSubmit={handleSearchExperience}
          isDebounce={true}
        />

        <Typography variant="h4" className={style.title}>
          {' '}
          {title || 'Your Friends'}
        </Typography>

        <SearchComponent
          value={search}
          placeholder="Find a Friend"
          onSubmit={handleSearchFriend}
          isDebounce
        />
      </div>

      <FriendRequestComponent
        expand={expandRequest}
        showAll={showAllRequest}
        toggleRequest={toggleRequest}
        onExpand={onExpandFriendRequest}
        onShowAll={onShowAllFriendRequest}
        showMore={loadMoreRequests}
      />
      <DividerComponent />
      <FriendListComponent
        showMore={loadMoreFriends}
        expand={expandFriends}
        onExpand={onFriendlistExpanded}
      />
    </div>
  );
};

export default FriendComponent;
