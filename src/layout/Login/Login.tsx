import React from 'react';
import Carousel from 'react-elastic-carousel';

import Link from 'next/link';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Purple from '../../images/Bank_note_Isometric_1.svg';
import Yellow from '../../images/Conversation__Isometric_1.svg';
import LogoImage from '../../images/myriad-logo-black.svg';
import {useStyles} from './Login.styles';

type LoginProps = {
  children: React.ReactNode;
};

export const Login: React.FC<LoginProps> = ({children}) => {
  const style = useStyles();

  return (
    <div className={style.root}>
      <Grid container spacing={0}>
        <Grid item xs={7}>
          <div className={`${style.paper} ${style.flex}`}>
            <LogoImage className={style.logo} />

            <Typography variant="h1" className={style.title}>
              Social Media with <span className={style.titlePrimary}>no boundaries</span>
            </Typography>

            {children}

            <Typography component="span">
              To access Myriad, you need to use{' '}
              <Link href={'https://polkadot.js.org/extension/'}>
                <a
                  href={'https://polkadot.js.org/extension/'}
                  className={style.link}
                  target="_blank"
                  rel="noreferrer">
                  Polkadot.js
                </a>
              </Link>
              , on your browser{' '}
              <span role="img" aria-label="emoticon-computer">
                💻
              </span>
            </Typography>
          </div>
        </Grid>
        <Grid item xs={5}>
          <div className={`${style.paper} ${style.background}`}>
            <Yellow className={style.imageYellow} />
            <Purple className={style.imagePurple} />
            <div className={style.carousel}>
              <Carousel isRTL={false} itemsToShow={1}>
                <div>
                  <Typography className={style.caption} component="span" color="textPrimary">
                    <Typography className={style.caption} component="span" color="primary">
                      Limitless
                    </Typography>{' '}
                    Conversation
                  </Typography>
                  <Typography className={style.subtitle} component="p" color="textPrimary">
                    No limitation on what you said in Myriad Fredom of Speech is Our Vision
                  </Typography>
                </div>
                <div>
                  <Typography className={style.caption} component="span" color="textPrimary">
                    <Typography className={style.caption} component="span" color="primary">
                      Monetize
                    </Typography>{' '}
                    your Idea
                  </Typography>
                  <Typography className={style.subtitle} component="p" color="textPrimary">
                    Speak what inside your mind and get a chance to earn coins
                  </Typography>
                </div>
              </Carousel>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};
