import vars     from './variables';
import gameLoop from './gameLoop';
import stats    from './stats';

const animloop = () => {
  stats.begin();
  gameLoop();
  stats.end();
  vars.animLoopHandle = window.requestAnimFrame(animloop);
};

export default animloop;
