# Rxify 

Utility for turning a promise-based API into an observable one.

## Installation 
```
npm install https://github.com/bathcat/rxify
```

## Example
```ts
import {rxify} from 'rxify';

interface User{
  id:number;
  name:string;
}

interface Department{
  name:string;
  state:string;
  address:string;
}

const api = {
  getUser(id:number):Promise<User>{
    return new Promise((resolve)=>{
      resolve({id,name:'JoeBloggs'})
    });
  },
}

api.getUser(5).then(u=>{
  console.log(`User: ${JSON.stringify(u)}`);
});

const rxApi = rxify(api);

rxApi.getUser$(23).subscribe(u=>{
  console.log(`User: ${JSON.stringify(u)}`);
});


```