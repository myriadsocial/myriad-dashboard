import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
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
  }),
);
