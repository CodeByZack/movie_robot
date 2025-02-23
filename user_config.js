const config = {
  douban: {
    /** 是否自动翻页，豆瓣的电影页面是分页的方式，开启此配置将自动点击下一页读取更多电影信息，推荐开启；*/
    turn_page: true,
    /** wish为想看、do为在看、collect为看过，多个支持;号隔开 示范：wish;do */
    types: 'wish',
    /** 这个就是豆瓣ID https://movie.douban.com/people/user1/wish PC端，这个访问地址中的user1 就是你的豆瓣ID，豆瓣手机客户端，也可以在账户管理页面看到，支持监听多个用户，;号隔开 */
    user_domain: 'xxxxxx;',
    /** 你加入想看的电影一定是有添加时间的，这个就是取多少天内的电影；如果你曾经在想看点了很多不想看的电影，用这个配置，一定程度上可以过滤掉无效被你遗忘的信息； */
    within_days: 365,
  },
  radarr: {
    host: 'xxxx',
    port: 'xxx',
    https: false,
    /** radarr api_key 在通用 APi密钥获取 */
    api_key: '',
    /** 设置默认的放置资源路径 */
    rootFolderPath: '/media/movie',
    /** 1: any , 6: 720p/1080p, 4: 1080p, 3: 720p, 2: SD, 5: Ultra-HD，具体数字可能有所不同，可参见博客 */
    qualityProfileId: 6,
    addOptions: {
      searchForMovie: true,
    },
    minimumAvailability: 'announced',
    /** 是否监控 */
    monitored: true,
  },
  sonarr: {
    host: 'xxx',
    port: 'xxx',
    https: false,
    /** 在通用 API 密钥获取 */
    api_key: '',
    /** 设置默认的放置资源路径 */
    rootFolderPath: '/media/tv',
    /** 1: any , 6: 720p/1080p, 4: 1080p, 3: 720p, 2: SD, 5: Ultra-HD，具体数字可能有所不同，可参见博客 */
    qualityProfileId: 6,
    /** 1: English  2: Chinese 3: any，具体设置可能不同，看参见博客 */
    languageProfileId: 3,
    /** 剧集类型 */
    seriesType: 'Standard',
    seasonFolder: true,
    monitored: true,
    addOptions: {
      monitor: 'all',
      searchForCutoffUnmetEpisodes: true,
      searchForMissingEpisodes: true,
    },
    /** 这是为了根据不同类型的资源设置，不同的下载路径和剧集类型，这样就不必将所有资源放在一个目录了 */
    typeMappingPath: [
      {
        type: ['电视剧', '剧情'],
        rootFolderPath: '/media/电视剧',
        seriesType: 'Standard',
      },
      {
        type: ['动漫', '动画'],
        rootFolderPath: '/media/动漫',
        seriesType: 'Anime',
      },
      {
        type: ['纪录片'],
        rootFolderPath: '/media/纪录片',
        seriesType: 'Standard',
      },
      {
        type: ['综艺', '真人秀'],
        rootFolderPath: '/media/综艺',
        seriesType: 'Daily',
      },
    ],
  },
};
export default config;
