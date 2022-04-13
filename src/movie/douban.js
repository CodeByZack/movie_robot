import HttpUtils from '../utils/http_utils.js';
import dayjs from 'dayjs';
import temmeCommon from 'temme';

const temme = temmeCommon.default;

const DOUBAN_URL = 'https://movie.douban.com/';
const Headers = {
  Referer: 'https://movie.douban.com/',
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
};

class DouBan {
  constructor() {
    this.httpUtil = new HttpUtils(true);
    // this.init();
  }
  async init() {
    // 先访问一次首页，显得像个正常人
    const res = await this.httpUtil.get(DOUBAN_URL, Headers);
    const cookies = res.headers['set-cookie'];
    this.cookies = cookies;
  }
  /***
   * @param {*} user : 豆瓣唯一账号
   * @param {*} types : 豆瓣用户电影类型，支持wish（想看）、do（在看）、collect（看过）
   * @param {*} within_days : 多少天内加入想看的影视，默认365
   * @param {*} turn_page : 是否自动翻页
   * @returns {*} ```{'name': '地球改变之年', 'local_name': 'The Year Earth Changed', 'year': '2021', 'type': 'Movie', 'count': None, 'release_date': [{'date': '2021-04-16', 'aera': '美国'}], 'cate': ['纪录片'], 'add_date': '2022-01-01'}```
   */
  async getUserMovieList(
    user,
    types = ['wish'],
    within_days = 365,
    turn_page = true,
  ) {
    const allResults = [];
    for (const type of types) {
      console.log(`开始获取${user}(${type})的电影`);
      let offset = 0;
      let pageCount = 1;
      let result = [];
      let uri = `/people/${user}/${type}?start=${offset}&sort=time&rating=all&filter=all&mode=grid`;
      while (uri) {
        let url = DOUBAN_URL + uri;
        const res = await this.httpUtil.get(url, {
          ...Headers,
          cookies: this.cookies,
        });
        console.log(res);
        const html = res.data;
        if (html.includes('有异常请求从你的 IP 发出')) {
          console.log('被豆瓣识别到抓取行为了，请更换IP后才能使用');
          return;
        }
        // await fs.writeFile('./tt.html', res.data);

        const nextPage = temme(html, 'div.paginator .next a[href=$];');
        if (nextPage) {
          uri = nextPage;
        } else {
          uri = null;
        }

        const data = temme(
          html,
          `div.item @{
            li.title a em{$title};
            span.date{$date};
            li.title a[href=$link];
          }`,
        );

        for (let i = 0; i < data.length; i++) {
          const element = data[i];
          const add_date = element.date;
          const days_ago = dayjs().diff(add_date, 'day');
          if (within_days && within_days < days_ago) {
            turn_page = false;
            continue;
          }
          url = element.link;
          const a_name = element.title;
          const name_arr = a_name.split(' / ');
          let local_name;
          if (name_arr.length > 1) {
            local_name = name_arr[1];
          }
          const match_id = url.match(/\/subject\/(\d+)/);
          let id;
          if (match_id) {
            id = match_id[1];
          }
          result.push({
            id,
            name: name_arr[0],
            local_name,
            url,
            add_date,
          });
          //     if not turn_page:
          //     break
          // if uri is not None:
          //     print('已经完成%s页数据的获取，开始获取下一页...' % page_cnt)
          //     page_cnt = page_cnt + 1
          if (!turn_page) break;
        }
        if (uri) {
          console.log(`已经完成${pageCount}页数据的获取，开始获取下一页...`);
          pageCount = pageCount + 1;
        }
      }

      allResults.push(...result);
      console.log(
        `${within_days}天之内加入${type}的影视，共${result.length}部`,
      );
    }
  }
}

export default DouBan;

// const init = async ()=>{

// };

// /**
//  *
//  * @param {*} user : 豆瓣唯一账号
//  * @param {*} types : 豆瓣用户电影类型，支持wish（想看）、do（在看）、collect（看过）
//  * @param {*} within_days : 多少天内加入想看的影视，默认365
//  * @param {*} turn_page : 是否自动翻页
//  * @returns {*} ```{'name': '地球改变之年', 'local_name': 'The Year Earth Changed', 'year': '2021', 'type': 'Movie', 'count': None, 'release_date': [{'date': '2021-04-16', 'aera': '美国'}], 'cate': ['纪录片'], 'add_date': '2022-01-01'}```
//  */

// const getUserMovieList = async (user, types=['wish'], within_days=365, turn_page=True)=>{

// };

// const douban = {
//     init
// }

// export default douban;
