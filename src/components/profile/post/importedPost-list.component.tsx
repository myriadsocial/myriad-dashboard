import React, {useEffect} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {useSelector} from 'react-redux';

import CircularProgress from '@material-ui/core/CircularProgress';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Grow from '@material-ui/core/Grow';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import {LoadingPage} from '../../common/loading.component';
import {useStyles} from '../profile.style';
import {useProfileTimeline} from '../use-profile-timeline.hook';

import {ScrollTop} from 'src/components/common/ScrollToTop.component';
import PostComponent from 'src/components/post/post.component';
import {TipSummaryProvider} from 'src/components/tip-summary/tip-summary.context';
import {useTimelineHook} from 'src/hooks/use-timeline.hook';
import {Post} from 'src/interfaces/post';
import {ExtendedUser} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

type Props = {
  profile: ExtendedUser;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function ImportedPostList({profile}: Props) {
  const style = useStyles();

  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const {loading, posts, hasMore, nextPage} = useTimelineHook();
  const {filterImportedPost, clearPosts} = useProfileTimeline(profile);

  useEffect(() => {
    filterImportedPost();

    return () => {
      clearPosts();
    };
  }, []);

  const isOwnPost = (post: Post) => {
    if (user && post.walletAddress === user.id) return true;
    return false;
  };

  if (posts.length === 0 && !loading) {
    return (
      <div style={{textAlign: 'center', padding: 16, backgroundColor: 'white', borderRadius: 8}}>
        <h2>{user?.id === profile.id ? 'You' : profile.name} haven’t imported any post yet</h2>
        <p>
          When {user?.id === profile.id ? 'you' : profile.name} import post in them, it will show up
          here.
        </p>
      </div>
    );
  }

  return (
    <>
      <TipSummaryProvider>
        <InfiniteScroll
          scrollableTarget="scrollable-timeline"
          className={style.child}
          dataLength={posts.length || 100}
          next={nextPage}
          hasMore={hasMore}
          loader={<LoadingPage />}>
          {posts.map((post: Post, i: number) => (
            <Grow key={i}>
              <PostComponent post={post} postOwner={isOwnPost(post)} />
            </Grow>
          ))}

          {loading && (
            <Grid container item xs={12} justify="center">
              <CircularProgress color="secondary" />
            </Grid>
          )}

          <ScrollTop>
            <Fab color="secondary" size="small" aria-label="scroll back to top">
              <KeyboardArrowUpIcon />
            </Fab>
          </ScrollTop>
        </InfiniteScroll>
      </TipSummaryProvider>
    </>
  );
}
