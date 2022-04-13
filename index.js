
import config from './user_config.js';
import DouBan from './src/movie/douban.js';




const main = async ()=>{
    
    const douban = new DouBan();
    await douban.init();
    const res = await douban.getUserMovieList('252889511');

};

main();

