import React, {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';

import {useStyles} from './profile.style';

import {ProfileEditContainer} from 'src/components-v2/Profile/edit/ProfileEditContainer';
import {ProfileHeaderContainer} from 'src/components-v2/Profile/profile-header/ProfileHeaderContainer';
import {UserMenuContainer} from 'src/components-v2/UserMenu';
import {TopNavbarComponent, SectionTitle} from 'src/components-v2/atoms/TopNavbar';
import {User} from 'src/interfaces/user';
import {fetchProfileFriend} from 'src/reducers/profile/actions';

type Props = {
  profile: User;
  loading: boolean;
};

const ProfileTimeline: React.FC<Props> = ({profile, loading}) => {
  const style = useStyles();
  const dispatch = useDispatch();

  const [isEdit, setIsEdit] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchProfileFriend());

    return undefined;
  }, [profile.id]);

  const handleOpenEdit = () => {
    setIsEdit(true);
  };

  return (
    <div className={style.root}>
      <div className={style.scroll}>
        <div className={style.mb}>
          <TopNavbarComponent description={profile.name} sectionTitle={SectionTitle.PROFILE} />
        </div>
        {isEdit && <ProfileEditContainer />}
        {!isEdit && (
          <>
            <ProfileHeaderContainer edit={handleOpenEdit} />
            <UserMenuContainer />
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileTimeline;
