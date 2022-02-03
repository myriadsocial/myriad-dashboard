import MyriadAPI from './base';
import {PAGINATION_LIMIT} from './constants/pagination';
import {BaseList} from './interfaces/base-list.interface';
import {LoopbackWhere} from './interfaces/loopback-query.interface';

import {Dislike, Like} from 'src/interfaces/interaction';
import {Post, PostProps, ImportPostProps, PostVisibility, PostStatus} from 'src/interfaces/post';
import {
  TimelineSortMethod,
  TimelineSortOrder,
  TimelineFilter,
  TimelineType,
  PostOrigin,
} from 'src/interfaces/timeline';
import {User} from 'src/interfaces/user';

type PostList = BaseList<Post>;
type ImporterList = BaseList<User>;
type WalletAddress = {
  walletAddress: string;
};

export const getPost = async (
  page: number,
  userId: string,
  type: TimelineType = TimelineType.TRENDING,
  sort?: TimelineSortMethod,
  filters?: TimelineFilter,
  asFriend = false,
  sortOrder?: TimelineSortOrder,
): Promise<PostList> => {
  const where: LoopbackWhere<PostProps> = {
    deletedAt: {exists: false},
  };

  let sortField = 'latest';
  let orderField = 'DESC';

  switch (sort) {
    case 'comment':
      sortField = 'comment';
      break;
    case 'like':
      sortField = 'upvote';
      break;
    case 'trending':
      sortField = 'popular';
      break;
    case 'created':
    default:
      break;
  }

  switch (sortOrder) {
    case 'latest':
      orderField = 'DESC';
      break;
    case 'oldest':
      orderField = 'ASC';
      break;
    default:
      break;
  }

  if (filters && filters.people && filters.people.length) {
    const condition = {
      peopleId: {
        inq: filters.people,
      },
    };

    if (where.or) {
      where.or.push(condition);
    } else {
      where.or = [condition];
    }
  }

  if (filters && filters.layout === 'photo') {
    // code
  }

  if (filters && filters.platform && filters.platform.length) {
    where.platform = {
      inq: filters.platform,
    };
  }

  if (filters && filters.owner) {
    where.or = [
      {
        createdBy: {
          eq: filters.owner,
        },
      },
      {
        importers: {
          inq: [filters.owner],
        },
      },
    ];

    if (userId === filters.owner) {
      delete where.deletedAt;
    } else {
      // filter only public post if no friend status provided
      if (asFriend) {
        where.visibility = {
          inq: [PostVisibility.PUBLIC, PostVisibility.FRIEND],
        };
      } else {
        where.visibility = {
          eq: PostVisibility.PUBLIC,
        };
      }
    }
  }

  if (filters && filters.importer) {
    // @ts-expect-error
    where.importers = {
      inq: [filters.importer],
    };

    if (userId === filters.importer) {
      delete where.deletedAt;
    } else {
      // filter only public post if no friend status provided
      if (asFriend) {
        where.visibility = {
          inq: [PostVisibility.PUBLIC, PostVisibility.FRIEND],
        };
      } else {
        where.visibility = {
          eq: PostVisibility.PUBLIC,
        };
      }
    }
  }

  const filterParams: Record<string, any> = {
    include: [
      {
        relation: 'user',
      },
      {
        relation: 'people',
      },
    ],
  };

  if (userId) {
    filterParams.include.push({
      relation: 'votes',
      scope: {
        where: {
          userId: {eq: userId},
        },
      },
    });
  }

  const params: Record<string, any> = {
    sortBy: sortField,
    order: orderField,
    importers: true,
    pageNumber: page,
    pageLimit: PAGINATION_LIMIT,
  };

  switch (type) {
    case TimelineType.FRIEND:
    case TimelineType.TRENDING:
      params.filter = filterParams;
      params.timelineType = type;
      break;
    case TimelineType.EXPERIENCE:
      params.filter = filterParams;
      params.timelineType = type;
      params.experienceId = filters?.experienceId;
      break;
    default:
      filterParams.where = where;

      if (!filters?.importer && !filters?.owner && (!filters?.tags || filters.tags?.length === 0)) {
        params.timelineType = TimelineType.ALL;
      }

      if (filters?.tags?.length) {
        params.topic = filters.tags;
      }

      params.filter = filterParams;
      break;
  }

  const {data} = await MyriadAPI.request<PostList>({
    url: '/posts',
    method: 'GET',
    params,
  });

  data.data.map(post => {
    if (post.platform === 'reddit') {
      post.text = post.text.replace(new RegExp('&amp;#x200B;', 'g'), '&nbsp;');
    }

    if (post.deletedAt) {
      post.text = '[post removed]';
    }

    return post;
  });

  return data;
};

export const findPosts = async (user: User | null, query: string, page = 1): Promise<PostList> => {
  const path = `/posts?q=${encodeURIComponent(query)}`;

  let where: Record<string, any> = {};
  const include: Array<any> = [
    {
      relation: 'user',
    },
    {
      relation: 'people',
    },
  ];

  if (user) {
    where = {
      or: [
        {
          visibility: {
            inq: ['public'],
          },
        },
        {
          or: [
            {createdBy: user.id},
            {
              importers: {
                inq: [user.id],
              },
            },
          ],
        },
      ],
    };
  } else {
    where = {
      visibility: {
        inq: ['public'],
      },
    };
  }

  if (user) {
    include.push({
      relation: 'votes',
      scope: {
        where: {
          userId: {eq: user.id},
        },
      },
    });
  }

  const {data} = await MyriadAPI.request<PostList>({
    url: path,
    method: 'GET',
    params: {
      pageNumber: page,
      pageLimit: PAGINATION_LIMIT,
      importers: true,
      filter: {
        order: `createdAt DESC`,
        include,
        where,
      },
    },
  });

  data.data.map(post => {
    if (post.platform === 'reddit') {
      post.text = post.text.replace(new RegExp('&amp;#x200B;', 'g'), '&nbsp;');
    }

    return post;
  });

  return data;
};

export const createPost = async (values: PostProps): Promise<Post> => {
  const {data} = await MyriadAPI.request<Post>({
    url: '/posts',
    method: 'POST',
    data: {
      ...values,
      status: PostStatus.PUBLISHED,
    },
  });

  return data;
};

export const importPost = async (values: ImportPostProps): Promise<Post> => {
  const attributes: ImportPostProps = {
    ...values,
  };

  const {data} = await MyriadAPI.request<Post>({
    url: `/posts/import`,
    method: 'POST',
    data: attributes,
  });

  if (data.platform === 'reddit') {
    data.text = data.text.replace(new RegExp('&amp;#x200B;', 'g'), '&nbsp;');
  }

  return data;
};

export const getPostDetail = async (id: string, userId?: string): Promise<Post> => {
  const {data} = await MyriadAPI.request<Post>({
    url: `/posts/${id}`,
    method: 'GET',
    params: {
      userId: userId ?? 'anonymous',
      importers: true,
      filter: {
        include: [
          {
            relation: 'user',
          },
          {
            relation: 'people',
          },
          {
            relation: 'votes',
            scope: {
              where: {
                userId: {eq: userId},
              },
            },
          },
        ],
      },
    },
  });

  if (data.platform === 'reddit') {
    data.text = data.text.replace(new RegExp('&amp;#x200B;', 'g'), '&nbsp;');
  }

  return data;
};

export const editPost = async (id: string, payload: Partial<PostProps>): Promise<void> => {
  await MyriadAPI.request<Post>({
    url: `/posts/${id}`,
    method: 'PATCH',
    data: payload,
  });
};

export const like = async (userId: string, postId: string): Promise<void> => {
  await MyriadAPI.request({
    url: `/posts/${postId}/likes`,
    method: 'POST',
    data: {
      status: true,
      userId,
      postId,
    },
  });
};

export const getLikes = async (postId: string): Promise<Like[]> => {
  const {data} = await MyriadAPI.request({
    url: `/posts/${postId}/likes`,
    method: 'GET',
  });

  return data;
};

export const getDislikes = async (postId: string): Promise<Dislike[]> => {
  const {data} = await MyriadAPI.request({
    url: `/posts/${postId}/dislikes`,
    method: 'GET',
  });

  return data;
};

export const dislike = async (userId: string, postId: string): Promise<void> => {
  await MyriadAPI.request({
    url: `/posts/${postId}/dislikes`,
    method: 'POST',
    data: {
      status: true,
      userId,
      postId,
    },
  });
};

export const removePost = async (postId: string): Promise<void> => {
  await MyriadAPI.request({
    url: `/posts/${postId}`,
    method: 'DELETE',
  });
};

export const getWalletAddress = async (postId: string): Promise<WalletAddress> => {
  const {data} = await MyriadAPI.request<WalletAddress>({
    url: `/posts/${postId}/walletaddress`,
    method: 'GET',
  });

  return data;
};

export const getImporters = async (
  originPostId: string,
  platform: PostOrigin,
): Promise<ImporterList> => {
  const {data} = await MyriadAPI.request({
    url: `/posts/${originPostId}/importers/${platform}`,
    method: 'GET',
  });

  return data;
};
