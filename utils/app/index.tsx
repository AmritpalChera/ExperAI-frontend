export function checkUrl (string: string) {
  let givenURL ;
  try {
      givenURL = new URL (string);
  } catch (error) {
     return false; 
  }
  return true;
}

