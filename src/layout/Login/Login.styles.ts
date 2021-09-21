import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: '20px',
      backgroundColor: '#FFC857',
      minHeight: '100vh',
    },
    paper: {
      minHeight: '100vh',
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
      backgroundColor: theme.palette.background.paper,
    },
    flex: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    },
    background: {
      backgroundColor: '#FFC857',
      position: 'relative',
    },
    logo: {
      marginTop: '100px',
    },
    title: {
      fontSize: 16,
      fontWeight: 700,
      lineHeight: '20px',
      marginBottom: theme.spacing(10),
      color: theme.palette.text.primary,
    },
    titlePrimary: {
      color: theme.palette.primary.main,
    },
    button: {
      marginBottom: theme.spacing(4),
    },
    span: {
      marginBottom: theme.spacing(25),
    },
    link: {
      textDecoration: 'none',
      color: theme.palette.primary.main,
    },
    imagePurple: {
      position: 'absolute',
      top: '200px',
      left: '-55px',
    },
    imageYellow: {
      position: 'absolute',
      top: '50px',
      left: '165px',
    },
    carousel: {
      position: 'absolute',
      width: '400px',
      height: '100px',
      bottom: '100px',
      '& .rec.rec-arrow': {
        visibility: 'hidden',
        display: 'none',
      },
      '& .rec.rec-dot': {
        background: theme.palette.background.paper,
      },
      '& .rec.rec-dot:focus': {
        background: theme.palette.primary.main,
        width: '28px',
        borderRadius: 20,
      },
      '& .rec.rec-pagination': {
        paddingLeft: '8px',
      },
      '& .rec-carousel-wrapper': {
        alignItems: 'flex-start',
      },
    },
    caption: {
      fontSize: '24px',
      lineHeight: '36px',
    },
    subtitle: {
      fontSize: '20px',
      lineHeight: '36px',
    },
  }),
);
