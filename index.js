
import config from './user_config.js';
import DouBan from './src/movie/douban.js';




const main = async ()=>{
    
    const douban = new DouBan();
    await douban.init();
    const res = await douban.getUserMovieList('252889511');
    console.log(res);
    if(res.length > 0){
        await douban.getMovieDetail(res[0].url);
    }

};

main();

