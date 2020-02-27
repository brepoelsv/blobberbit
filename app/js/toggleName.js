import Config from './config';

export default (chat) => {
  if (!Config.toggleShowNameState) {
    Config.toggleShowNameState = 1;
    if (chat !== undefined)
      chat.addSystemLine('Viewing name enabled.');
  } else {
    Config.toggleShowNameState = 0;
    if (chat !== undefined) 
      chat.addSystemLine('Viewing name disabled.');
  }
  console.log({toggleShowNameState : Config.toggleShowNameState})
};
