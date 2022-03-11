import { Injectable } from '@angular/core';
import { Checkout } from 'capacitor-razorpay';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RazorpayService {

  constructor() { }

  async payWithRazorPay(param) {
    try {
      const options = {
        key: environment.razorpay.key_id,
        amount: (param.amount).toString(),
        image: '../../assests/imgs/logo.png',
        currency: 'ZAR',
        name: 'SK-Events',
        prefill: {
          email: param.email,
          contact: param.phone
        },
        theme: {
          color: '#de0f17'
        }
      };
      const data = await Checkout.open(options);
      console.log(data.response);
      return data.response;
    } catch (e) {
      throw (e);
    }
  }

}
