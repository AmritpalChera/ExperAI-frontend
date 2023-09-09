import { toast } from "react-toastify";

export function checkUrl (string: string) {
  let givenURL ;
  try {
      givenURL = new URL (string);
  } catch (error) {
     return false; 
  }
  return true;
}

export const baseurl = process.env.NODE_ENV === 'development'? 'http://localhost:3000' : 'https://experai.com'

export const CustomerPlans = {
  LITE: 'lite',
  BASIC: 'basic',
  CUSTOM: 'custom'
}

const development = process.env.NODE_ENV === 'development';

export const billManageURL = development ? 'https://billing.stripe.com/p/login/test_6oE7tQ6KPbWj4RW000' : 'https://billing.stripe.com/p/login/9AQ03j7hr8QdgEgaEE';
