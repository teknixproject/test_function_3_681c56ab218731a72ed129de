export const useActionsGlobal = () => {
  const handle1 = () => {
    console.log('handle1');
  };
  const handle2 = () => {
    console.log('handle1');
  };
  return { handle1, handle2 };
};
