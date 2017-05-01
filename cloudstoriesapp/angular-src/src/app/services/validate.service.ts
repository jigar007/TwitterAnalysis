import { Injectable } from '@angular/core';

// now wherever we want to use this service
// remember to first import the 'ValidateService' module
// after that inject the service into the constructor of the class
// so that it can be used in the 'this' context for that component

@Injectable()
export class ValidateService {

  constructor() { }

  validateTweet(tweet) {
      if(tweet._id == undefined ||
         tweet.text == undefined ||
         tweet.location == undefined) {
          return false;
      }
      else {
          return true;
      }
  }

}
