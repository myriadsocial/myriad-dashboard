import {isUrl} from '@udecode/plate-common';

import React, {useEffect, useState} from 'react';

import {FormControl, FormHelperText, Input, InputLabel, Typography} from '@material-ui/core';

import {Embed} from '../atoms/Embed';
import {useStyles} from './PostImport.styles';

import ShowIf from 'src/components/common/show-if.component';
import {SocialsEnum} from 'src/interfaces/social';

type PostImportProps = {
  value?: string;
  onChange: (url: string | null) => void;
};

const regex = {
  [SocialsEnum.TWITTER]: /^https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)/,
  [SocialsEnum.FACEBOOK]:
    /^(?:https?:\/\/)?(?:www\.|m\.|mobile\.|touch\.|mbasic\.)?(?:facebook\.com|fb(?:\.me|\.com))\/(?!$)(?:(?:\w)*#!\/)?(?:pages\/)?(?:photo\.php\?fbid=)?(?:[\w\-]*\/)*?(?:\/)?(?:profile\.php\?id=)?([^\/?&\s]*)(?:\/|&|\?)?.*$/s,
  [SocialsEnum.REDDIT]: /(?:^.+?)(?:reddit.com\/r)(?:\/[\w\d]+){2}(?:\/)([\w\d]*)/,
  [SocialsEnum.TELEGRAM]: /^https?:\/\/t\.me\/([a-z]+)\/([0-9]+)/,
};

export const PostImport: React.FC<PostImportProps> = props => {
  const {value = '', onChange} = props;
  const styles = useStyles();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [url, setUrl] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(false);
  const showError = url.length > 0 && !isValidUrl;

  useEffect(() => {
    setUrl(value);

    if (isUrl(value)) {
      parseUrl(value);
    } else {
      setIsValidUrl(false);
    }

    return () => {
      setPreviewUrl(null);
    };
  }, [value]);

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const url = event.target.value;

    setUrl(url);
    setPreviewUrl(null);

    if (isUrl(url)) {
      parseUrl(url);
    } else {
      setIsValidUrl(false);
      onChange(null);
    }
  };

  const parseUrl = (url: string) => {
    setIsValidUrl(false);

    //TODO: send these consts to importPost() in timeline actions so .split() not required
    const matchTwitter = regex[SocialsEnum.TWITTER].exec(url);
    const matchReddit = regex[SocialsEnum.REDDIT].exec(url);
    const matchFacebook = regex[SocialsEnum.FACEBOOK].exec(url);
    const matchTelegram = regex[SocialsEnum.TELEGRAM].exec(url);
    if (matchTwitter || matchReddit || matchFacebook || matchTelegram) {
      setPreviewUrl(url);
      setIsValidUrl(true);
      onChange(url);
    }
  };

  return (
    <div className={styles.root}>
      <FormControl fullWidth className={styles.input} error={showError}>
        <InputLabel htmlFor="link-to-post">Link to post</InputLabel>
        <Input id="link-to-post" value={url} onChange={handleUrlChange} />
        <ShowIf condition={showError}>
          <FormHelperText id="component-error-text">
            Curently we only can import post from reddit and twitter
          </FormHelperText>
        </ShowIf>
      </FormControl>

      {previewUrl && (
        <div>
          <Typography variant="h5" gutterBottom className={styles.title}>
            Post Preview
          </Typography>

          <div className={styles.preview}>
            <Embed url={previewUrl} options={{facebookAppId: '1349208398779551'}} />
          </div>
        </div>
      )}
    </div>
  );
};
