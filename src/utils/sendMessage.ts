export const sendMessage = (event: any, type: string, msg: any) => {
  event.sender.send(type, msg);
};
