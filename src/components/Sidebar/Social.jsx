import img1_1 from '../../assets/ohm/1-1.png';
import img1_2 from '../../assets/ohm/1-2.png';
import img1_3 from '../../assets/ohm/1-3.png';
import img1_4 from '../../assets/ohm/1-4.png';
import medium from '../../assets/ohm/med@2x.png';
import discord from '../../assets/ohm/discord-logo.png';
import RedditImg from '../../assets/ohm/reddit.png';

export default function Social() {
  return (
    <div className="social-row " >
      <a href="https://twitter.com/WaltsWorldDAO" target="_blank" className="bottomImgs" style={{marginLeft:5,marginRight:10}}><img src={img1_1} alt="" className="bottomImgs2" style={{width:30,height:30}}/></a>
      <a href="https://github.com/WaltsWorldDAO" target="_blank" className="bottomImgs" style={{marginLeft:5,marginRight:10}}><img src={img1_2} alt="" className="bottomImgs2" style={{width:30,height:30}}/></a>
      <a href="https://medium.com/@waltsworlddao" target="_blank" className="bottomImgs" style={{marginLeft:5,marginRight:10}}><img src={medium} alt="" className="bottomImgs2" style={{width:30,height:30}}/></a>
      <a href="https://t.me/MoonFarmersChat" target="_blank" className="bottomImgs" style={{marginLeft:5,marginRight:10}}><img src={img1_4} alt="" className="bottomImgs2" style={{width:30,height:30}}/></a>
      <a href="https://www.reddit.com/r/WaltsWorldDAO/" target="_blank" className="bottomImgs" style={{marginLeft:10,marginRight:5}}><img src={RedditImg} alt="" className="bottomImgs2" style={{width:30,height:30}}/></a>
      <a href="https://discord.gg/U5yT3UYcjm" target="_blank" className="bottomImgs" style={{marginLeft:5,marginRight:10}}><img src={discord} alt="" className="bottomImgs2" style={{width:30,height:30}}/></a>
    </div>
  );
}
